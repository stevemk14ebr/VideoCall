import React from 'react';
import Link from 'next/link';

import PeerButton from './PeerButton';

class NotConnected extends React.Component {
  constructor(){
    super();
  }



  render() {
    let otherPeers = [];

    for (var i = 0; i < this.props.clientList.length; i++) {
      otherPeers.push(
        <PeerButton
          key={i}
          peerID={this.props.clientList[i]}
          onClientSelected={this.props.onClientSelected}
        />
      );
    }

    if (this.props.myPeerID == null){
      return (
        <main className="not-connected">
          <h2 className="title">Loading...</h2>
        </main>
      );
    }

		return (
			<main className="not-connected">

        <img src="/static/Logo.png"/>

        <h2 className="title">You are disconnected!</h2>

        <h3>Your peer ID is:</h3>

        <div>
          <PeerButton
            peerID={this.props.myPeerID}
          />
        </div>

        <h3>Other peers:</h3>

        <div className="peer-list">
          {otherPeers}
        </div>
      </main>
		);
  }
}

export default NotConnected;
