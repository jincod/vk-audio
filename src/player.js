import request from 'superagent'
import React from 'react'
import { Link } from 'react-router'
import { PlayList } from './playlist'
import { AudioPlayer } from './components/audio-player'
import { ActiveTrack } from './components/active-track'
import { ChangeForm } from './components/form'

const loadTracks = (query, callback) => {
  request
    .get('/api/track')
    .query({query: query})
    .end(callback);
};

export class Player extends React.Component {
  constructor(props) {
    super(props);

    this.scrollToCurrentTrack = this.scrollToCurrentTrack.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    this.state = {
      playlistId: props.params.playlistId,
      tracks: [],
      currentTrackIndex: -1,
      isLoading: false
    }
  }

  componentDidMount() {
    const playlistId = this.state.playlistId;

    window.document.title = playlistId ? 'VK Audio - ' +  playlistId : 'VK Audio';

    if(playlistId) {
      this.setState({isLoading: true});
      loadTracks(playlistId, this.loadTracks.bind(this));
    }

    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown, false);
  }

  onKeyDown(e) {
    const unicode = e.charCode ? e.charCode : e.keyCode;
    // right arrow
    if (unicode == 39) {
      e.preventDefault();
      this.playNextTrack();
      // back arrow
    } else if (unicode == 37) {
      e.preventDefault();
      this.playPrevTrack();
      // spacebar
    } else if (unicode == 32) {       
      e.preventDefault();
      this.playPauseTrack();
    }
  }

  loadTracks(err, res) {
    if(err) {
      this.showError();
      return;
    }
    const tracks = res.body;
    const currentTrackIndex = this.getCurrentTrackIndex();

    this.setState({
      tracks: tracks,
      currentTrackIndex: currentTrackIndex,
      isLoading: false
    });

    this.updateHistory();
  }

  getCurrentTrackIndex() {
    const currentTrackIndex = localStorage.getItem('currentTrackIndex-' + this.state.playlistId);
    return currentTrackIndex && parseInt(currentTrackIndex, 10) || 0;
  }

  scrollToCurrentTrack() {
    if(this.state.tracks.length > 1) {
      if(this.state.currentTrackIndex > 1) {
        document.querySelector('li.active').previousElementSibling.scrollIntoView();
      } else {
        document.body.scrollIntoView();
      }
    }
  }

  componentWillReceiveProps(props) {
    const playlistId = props.params.playlistId;
    if(playlistId) {
      this.setState({
        isLoading: true,
        playlistId: playlistId
      }, loadTracks(playlistId, this.loadTracks.bind(this)));
    }
  }

  updateHistory() {
    var history = localStorage.getItem('history')
      && JSON.parse(localStorage.getItem('history')) || [];
    
    if(this.state.playlistId !== '' && history.indexOf(this.state.playlistId) === -1) {
      history.push(this.state.playlistId);
      localStorage.setItem('history', JSON.stringify(history));
    }
  }

  showError() {
    this.setState({isLoading: false, isError: true});
  }

  playPrevTrack() {
    this.playThisTrack(this.getCurrentTrackIndex() - 1);
  }

  playNextTrack() {
    this.playThisTrack(this.getCurrentTrackIndex() + 1);
  }

  playPauseTrack() {
    const index = this.getCurrentTrackIndex();
    const isPlaying = localStorage.getItem(`isPlaying-${this.state.playlistId}`) === 'true';
    if(isPlaying) {
      localStorage.setItem(`isPlaying-${this.state.playlistId}`, 'false');
    } else {
      this.playThisTrack(index);
    }
    this.setState({isPlaying: !isPlaying});
  }

  playThisTrack(index) {
    if(index < 0 || index > this.state.tracks.length - 1) {
      index = 0;
    }
    localStorage.setItem(`currentTrackIndex-${this.state.playlistId}`, index);
    localStorage.setItem(`isPlaying-${this.state.playlistId}`, 'true');
    this.setState({currentTrackIndex: index});
  }

  renderPlaylist() {
    var playlist;

    if(this.state.isError) {
      playlist = <div>Error: Can't load tracks</div>
    } else if(this.state.isLoading) {
      playlist = <div>Loading...</div>
    } else {
      playlist = <PlayList tracks={this.state.tracks} currentTrackIndex={this.state.currentTrackIndex} playThisTrack={this.playThisTrack.bind(this)}/>
    }

    return playlist;
  }

  render() {
    const {tracks, currentTrackIndex} = this.state;
    const track = tracks[currentTrackIndex];
    if(track) {
      track.isPlaying = localStorage.getItem('isPlaying-' + this.state.playlistId) === 'true';
      track.playlistId = this.state.playlistId;
    }

    return (
      <div>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            {
              track && <AudioPlayer track={track} playNextTrack={this.playNextTrack.bind(this)} />
            }
            <ChangeForm />
            <ActiveTrack
              scrollToCurrentTrack={this.scrollToCurrentTrack}
              currentTrackIndex={this.state.currentTrackIndex}
              tracks={this.state.tracks}
            />
          </div>
        </nav>
        {this.renderPlaylist()}
      </div>
    );
  }
}