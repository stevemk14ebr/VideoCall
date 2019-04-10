import React from 'react';

import Video from './Video';
import NoVideo from './NoVideo';

class VideoWrapper extends React.Component {
  constructor(){
    super();
  }

  render() {
    let video = (<NoVideo />);

    if (this.props.stream){
      video = (
        <Video stream={this.props.stream} />
      );
    }
		return (
			<div className="video-container">
        {video}
      </div>
		);
  }
}

export default VideoWrapper;
