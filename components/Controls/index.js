import React from 'react';
import { EntypoBlock } from 'react-entypo';

import KeyButton from './KeyButton';

class Controls extends React.Component {
  constructor(){
    super();
  }

  render() {
		return (
      <div className="controls">

        <div className="controlls-container">

          <div className="movement">

            <KeyButton
              keyCode="KeyW"
              activeKeys={this.props.activeKeys}
              onKeyUp={this.props.onKeyUp}
              onKeyDown={this.props.onKeyDown}
            >
              <span>W</span>
            </KeyButton>

            <div>
              <KeyButton
                keyCode="KeyA"
                activeKeys={this.props.activeKeys}
                onKeyUp={this.props.onKeyUp}
                onKeyDown={this.props.onKeyDown}
              >
                <span>A</span>
              </KeyButton>
              <KeyButton
                keyCode="KeyS"
                activeKeys={this.props.activeKeys}
                onKeyUp={this.props.onKeyUp}
                onKeyDown={this.props.onKeyDown}
              >
                <span>S</span>
              </KeyButton>
              <KeyButton
                keyCode="KeyD"
                activeKeys={this.props.activeKeys}
                onKeyUp={this.props.onKeyUp}
                onKeyDown={this.props.onKeyDown}
              >
                <span>D</span>
              </KeyButton>
            </div>

          </div>

          <div className="other-keys">
            <KeyButton
              keyCode="ShiftRight"
              activeKeys={this.props.activeKeys}
              onKeyUp={this.props.onKeyUp}
              onKeyDown={this.props.onKeyDown}
            >
              <span className="shift-margin">Shift</span>
            </KeyButton>
          </div>

        </div>

      </div>
		);
  }
}

export default Controls;
