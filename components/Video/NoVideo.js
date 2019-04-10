import React from 'react';
import { EntypoBlock } from 'react-entypo';

class NoVideo extends React.Component {
  constructor(){
    super();
  }

  render() {
		return (
			<div className="no-video">
        <EntypoBlock />
        <span>Unable to load the stream</span>
      </div>
		);
  }
}

export default NoVideo;
