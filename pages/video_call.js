import React, { Component } from 'react';
import io from 'socket.io-client';
import SimpleSignalClient from 'simple-signal-client';
import getUserMedia from 'getusermedia';
import wrtc from 'wrtc';

import NotConnected from '../components/NotConnected';
import Chat from '../components/Chat';
import Video from '../components/Video';
import Controls from '../components/Controls';

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

		this.b_startStream = this.startStream.bind(this);
		this.b_onClientSelected = this.onClientSelected.bind(this);
		this.b_initPeer = this.initPeer.bind(this);
		this.b_disconnect = this.disconnect.bind(this);

		this.b_onKeyUp = this.onKeyUp.bind(this);
		this.b_onKeyDown = this.onKeyDown.bind(this);

		this.state = {
			socket: null,
			clientList: [],
			otherId: null,
			chatHistory: [
				{is_me:false,message:"Hey from afar"},
				{is_me:true,message:"What's up yo, mr far man"}
			],
			stream:null,
			activeKeys: []
		};
	}

	disconnect(){
		this.socket.disconnect();
		console.log('cleaning up');
	}

	componentWillUnmount() {
		window.removeEventListener('beforeunload', this.b_disconnect);
		this.b_disconnect();
  }

	onKeyUp(e){
		let keys = [...this.state.activeKeys];
		if (keys.indexOf( e.code ) != -1) {

			console.log(`${e.code} released`);
			keys.splice(keys.indexOf( e.code ),1);
			this.socket.emit('keyup', {key: e.code});

			this.setState({
				...this.state,
				activeKeys:keys
			});
		}
	}

	onKeyDown(e){
		let keys = [...this.state.activeKeys];
		if (keys.indexOf( e.code ) == -1) {
			console.log(`${e.code} pressed`);
			keys.push( e.code );
			this.socket.emit('keydown', {key: e.code});

			this.setState({
				...this.state,
				activeKeys:keys
			});
		}
	}

	componentDidMount(){
		window.addEventListener('beforeunload', this.b_disconnect);

		this.socket = io('http://localhost:3001');
		this.socket.on('connect', this.b_onConnect);

		this.client = new SimpleSignalClient(this.socket) // Uses an existing socket.io-client instance
		this.client.on('request', this.b_onRequest );
		this.client.on('discover', this.b_onDiscover);

		window.addEventListener("keydown",this.b_onKeyDown);
		window.addEventListener("keyup",this.b_onKeyUp);
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
			getUserMedia({video: true, audio: true}, function (err, stream) {
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

		this.setState({
			...this.state,
			otherId: request.initiator
		});

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

	onStream(stream) {
		this.setState({
			...this.state,
			stream
		});
	}

	async startStream( otherId ) {
		// calling, start our stream, and init the peer's callbacks
		this.stream = await this.b_getMedia();
		const { peer } = await this.client.connect(otherId, null, {initiator: true, wrtc: wrtc, stream: this.stream}) // connect to target client
		this.b_initPeer(peer);
	}

	async onMessage(msg) {
		var dec = new TextDecoder("utf-8");
		console.log(dec.decode(msg));

		// add message to chat
		let chatHistory = [...this.state.chatHistory];
		chatHistory.push({
			is_me: false,
			message: dec.decode(msg)
		});

		this.setState({
			...this.state,
			chatHistory
		});
	}

	sendMessage(msg) {
		let chatHistory = [...this.state.chatHistory];
		chatHistory.push({
			is_me: true,
			message: msg
		});

		this.setState({
			...this.state,
			chatHistory
		});

		this.peer.send(msg);
	}

	async initPeer(peer) {
		this.peer = peer; // this is a fully-signaled simple-peer object
		this.peer.on('stream', this.b_onStream);
		this.peer.on('data', this.b_onMessage);
	}

	generateKey() {
		return `${ uuidv4() }_${ new Date().getTime() }`;
	}

	async onClientSelected( otherId ) {
		await this.b_startStream( otherId );

		this.setState({
			...this.state,
			otherId
		});
	}

	render() {
		let socketID = (this.state.socket) ? this.state.socket.id : null;

		if (!this.state.otherId){
			return (
				<NotConnected
					myPeerID={socketID}
					clientList={this.state.clientList}
					onClientSelected={this.b_onClientSelected}
				/>
			);
		}

		return (
			<main className="main">
				<Chat
					otherId={this.state.otherId}
					sendMessage={this.b_sendMessage}
					messageHistory={this.state.chatHistory}
				/>

				<div className="video-wrapper">
					<Video
						stream={this.state.stream}
					/>

					<Controls
						activeKeys={this.state.activeKeys}
						onKeyUp={this.b_onKeyUp}
						onKeyDown={this.b_onKeyDown}
					/>
				</div>
			</main>
		)
	}
}

export default VideoCall;
