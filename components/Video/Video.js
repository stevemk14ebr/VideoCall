import React from 'react';

class Video extends React.Component {
  constructor(){
    super();

    this.videoRef = React.createRef();
  }

  componentDidMount(){
    this.videoRef.current.srcObject = this.props.stream;
		this.videoRef.current.play()
  }

  render() {
		return (
      <video ref={this.videoRef}/>
		);
  }
}

export default Video;
