import React, { Component } from 'react';
import io from 'socket.io-client';
import SimpleSignalClient from 'simple-signal-client';
import getUserMedia from 'getusermedia';
import wrtc from 'wrtc';
const uuidv4 = require('uuid/v4');

class VideoCall extends Component {
	constructor(props) {
		super(props);

		this.b_onConnect = this.onConnect.bind(this);
		this.b_onRequest = this.onRequest.bind(this);
		this.b_onDiscover = this.onDiscover.bind(this);
		
		this.b_onStream = this.onStream.bind(this);
		this.b_getMedia = this.getMedia.bind(this);
		this.b_onMessage = this.onMessage.bind(this);
		this.b_sendMessage = this.sendMessage.bind(this);
		this.b_onMessageType = this.onMessageType.bind(this);
		
		this.b_startStream = this.startStream.bind(this);
		this.b_onClientSelected = this.onClientSelected.bind(this);
		this.b_initPeer = this.initPeer.bind(this);
		
		this.socket = io('http://localhost:3001');
		this.socket.on('connect', this.b_onConnect);
		
		this.client = new SimpleSignalClient(this.socket) // Uses an existing socket.io-client instance
		this.client.on('request', this.b_onRequest );
		this.client.on('discover', this.b_onDiscover);
		
		this.videoRef = React.createRef();
		this.state = {
			socket: this.socket,
			clientList: [],
			otherId: 'unset'
		};
	}
	
	componentWillUnmount() {
		console.log('cleaning up');
		this.socket.disconnect();
    }
		
	onConnect() {
		console.log('Connected to relay server');
		this.setState({
			...this.state,
			socket: this.socket
		});
		
		// find other clients
		this.client.discover();
	}
		
	async getMedia(){
		return new Promise((resolve, reject) => {
			getUserMedia({video: true, audio: false}, function (err, stream) { 
				if(err) {
					console.log('failed to get video stream');
					reject(err);
				} else {
					console.log('got stream');
					resolve(stream);
				}
			}.bind(this));
		});
	}
	
	async onRequest(request){
		// we're receiving, get video stream (before accepting connection)
		this.stream = await this.b_getMedia();
		
		// pass stream to webrtc
		const { peer } = await request.accept(undefined, {wrtc: wrtc, stream: this.stream}); 
		this.b_initPeer(peer);
	}

	async onDiscover(idList) {
		// update view when new clients discovered
		this.setState({
			...this.state,
			clientList: idList
		});
	}
	
	async onStream(stream) {
		console.log('Setting source video');
		this.videoRef.current.srcObject = stream;
		this.videoRef.current.play()
	}
	
	async startStream() {
		// calling, start our stream, and init the peer's callbacks
		this.stream = await this.b_getMedia();
		const { peer } = await this.client.connect(this.state.otherId, null, {initiator: true, wrtc: wrtc, stream: this.stream}) // connect to target client
		this.b_initPeer(peer);
	}
	
	async onMessage(msg) {
		var dec = new TextDecoder("utf-8");
		console.log(dec.decode(msg));
	}
	
	async sendMessage() {
		this.peer.send(this.msgToSend);
	}
	
	async onMessageType(event) {
		this.msgToSend = event.target.value;
	}
	
	initPeer(peer) {
		this.peer = peer; // this is a fully-signaled simple-peer object
		this.peer.on('stream', this.b_onStream);
		this.peer.on('data', this.b_onMessage);
	}
	
	generateKey() {
		return `${ uuidv4() }_${ new Date().getTime() }`;
	}
	
	onClientSelected(event) {
		this.setState({
			...this.state,
			otherId: event.target.value
		});
	}
	
	render() {
		return (
			<div>
				<p>Peer Id {this.state.socket.id}</p>
				<p>Target Id {this.state.otherId}</p>
				<button onClick={this.b_startStream}>
					Start Stream
				</button>
				<textarea rows="3" cols="30" placeholder="Enter your message" onChange={this.b_onMessageType}>
					
				</textarea>
				<button onClick={this.b_sendMessage}>
					Send Message
				</button>
				<video ref={this.videoRef}/>
				<select onChange={this.b_onClientSelected}>
					{ this.state.clientList.map((option) => <option key={this.generateKey()}>{option}</option>) }
				</select>
			</div>
		)
	}
}

export default VideoCall;
