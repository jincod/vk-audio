import React from 'react'


export class AudioPlayer extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isLoading: false,
      isPlaying: false
    }
  }
  componentDidMount() {
    var self = this;

    this.audio = audiojs.createAll({
      trackEnded: () => {
        self.playNextTrack();
      }
    })[0];

    const {track} = this.props;

    if(track.isPlaying) {
      this.audio.play();
    }
  }

  componentDidUpdate() {
    const {track} = this.props;

    if(track.isPlaying) {
      this.audio.play();
    }
  }

  render() {
    const {track} = this.props;

    return (
      <div className="navbar-btn navbar-left">
        <audio id='audio' ref='audio' src={track.url}></audio>
      </div>
    );
  }
}