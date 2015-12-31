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
        self.props.playNextTrack();
      }
    })[0];

    const {track} = this.props;

    if(track.isPlaying) {
      this.audio.play();
    }

    document.querySelector('.play-pause').addEventListener('click', (e) => {
      const playlistId = this.props.track.playlistId;
      const isPlaying = localStorage.getItem('isPlaying-' + playlistId) === 'true';
      localStorage.setItem('isPlaying-' + playlistId, !isPlaying);
    });
  }

  componentDidUpdate() {
    const {track} = this.props;

    if(this.audio.source.src !== track.url) {
      this.audio.load(track.url);
    }
    
    if(track.isPlaying) {
      this.audio.play();
    } else {
      this.audio.pause();
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