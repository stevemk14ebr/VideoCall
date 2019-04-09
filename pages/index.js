import React, { Component } from 'react'
import VideoCall from './video_call.js'

class Index extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<VideoCall/>
			</div>
		)
	}
}

export default Index;