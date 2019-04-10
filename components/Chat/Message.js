import React from 'react';

class Message extends React.Component {
  constructor(){
    super();
  }

  render() {

		return (
		    <div className={`message ${(this.props.is_me) ? "mine" : ""}`}>
          <span>{this.props.message}</span>
        </div>
		);
  }
}

export default Message;
