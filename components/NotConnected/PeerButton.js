import React from 'react';

class PeerButton extends React.Component {
  constructor(){
    super();

    this.b_onClick = this.onClick.bind(this);
  }

  hash( str ){
    var hash = 0, i, chr;

    if (str.length === 0) return hash;

    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }

    return hash;
  }

  getColorTag( str ){
    let number = this.hash(str);

    if ( number % 4 == 0 ){
      return "green";
    } else if ( number % 3 == 0){
      return "yellow";
    } else if (number % 2 == 0){
      return "blue";
    } else {
      return "red";
    }
  }

  onClick(){
    this.props.onClientSelected( this.props.peerID );
  }

  render() {
    if (this.props.onClientSelected){

      return(
        <button className={`connection-id ${this.getColorTag( this.props.peerID )}`} onClick={ this.b_onClick }>
          <span>
            { this.props.peerID }
          </span>
        </button>
      );
    } else {

      return(
        <div className={`connection-id ${this.getColorTag( this.props.peerID )}`}>
          <span>
            { this.props.peerID }
          </span>
        </div>
      );
    }

  }
}

export default PeerButton;
