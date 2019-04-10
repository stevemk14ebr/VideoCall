import React from 'react';
import { EntypoBlock } from 'react-entypo';

class KeyButton extends React.Component {
  constructor(){
    super();

    this.b_onMouseDown = this.onMouseDown.bind(this);
    this.b_onMouseUp = this.onMouseUp.bind(this);
  }

  componentDidMount(){
    window.addEventListener("mouseup",this.b_onMouseUp);
  }

  componentWillUnmount(){
    window.removeEventListener("mouseup",this.b_onMouseUp);
  }

  onMouseDown(){
    this.props.onKeyDown({
      code:this.props.keyCode
    });
  }

  onMouseUp(){
    if (this.props.activeKeys.indexOf( this.props.keyCode ) != -1){
      this.props.onKeyUp({
        code:this.props.keyCode
      });
    }
  }

  render() {
		return (
      <button
        onMouseUp={this.b_onMouseUp}
        onMouseDown={this.b_onMouseDown}
        className={`control-key ${(this.props.activeKeys.indexOf( this.props.keyCode ) == -1) ? "" : "active"}`}
      >
        {this.props.children}
      </button>
		);
  }
}

export default KeyButton;
