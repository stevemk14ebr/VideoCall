import React from 'react';
import Link from 'next/link';
import { EntypoPaperPlane } from 'react-entypo';

import Message from './Message';

class Chat extends React.Component {
  constructor(){
    super();

    this.b_onChange = this.onChange.bind(this);
    this.b_onSubmit = this.onSubmit.bind(this);

    this.b_onKeyUp = this.onKeyUp.bind(this);
    this.b_onKeyDown = this.onKeyDown.bind(this);

    this.state = {
      text:""
    }
  }

  onKeyDown(e){
    if (e.keyCode == 13){
      e.preventDefault();
      this.b_onSubmit();
    }

    e.stopPropagation();
  }

  onKeyUp(e){
    e.stopPropagation();
  }

  onChange(e){
    this.setState({
      text:e.target.value
    })
  }

  onSubmit(){
    this.props.sendMessage(this.state.text);
    this.setState({
      text:""
    });
  }

  render() {

    let chatHistory = [];

    for (var i = 0; i < this.props.messageHistory.length; i++) {
      chatHistory.push(
        <Message
          key={i}
          message={this.props.messageHistory[i].message}
          is_me={this.props.messageHistory[i].is_me}
        />
      );
    }

		return (
			<aside className="chat">
        <div className="header">
          <span>{this.props.otherId}</span>
        </div>
        <div className="scroll">
          <div className="history">
            {chatHistory}
          </div>
        </div>
        <div className="input">
          <textarea
            placeholder="Say something..."
            onChange={this.b_onChange}
            value={this.state.text}
            onKeyDown={this.b_onKeyDown}
            onKeyUp={this.b_onKeyUp}
          />

          <div className="button-wrapper">
            <button onClick={this.b_onSubmit}>
              <EntypoPaperPlane
                size={20}
              />
            </button>
          </div>
        </div>
      </aside>
		);
  }
}

export default Chat;
