import React from 'react';
import {Link} from 'react-router';
import PlayList from './playlist';
import EmptyPlayList from './empty-playlist';
import loadTracks from './api-wrapper';
import AudioPlayer from './components/audio-player';
import { ActiveTrack } from './components/active-track';

export default class Player extends React.Component {
  constructor(props) {
    super(props);

    this.scrollToCurrentTrack = this.scrollToCurrentTrack.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.loadTracks = this.loadTracks.bind(this);
    this.playThisTrack = this.playThisTrack.bind(this);

    this.state = {
      playlistId: props.params.playlistId,
      tracks: [],
      currentTrackIndex: -1,
      isLoading: true
    }
  }

  componentDidMount() {
    const playlistId = this.state.playlistId;

    window.document.title = playlistId ? 'VK Audio - ' +  playlistId : 'VK Audio';

    if (playlistId) {
      loadTracks(playlistId, this.loadTracks);
    } else {
      this.setState({isLoading: false});
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

  loadTracks(err, tracks) {
    if(err) {
      this.showError();
      return;
    }
    let currentTrackIndex = this.getCurrentTrackIndex();

    if (currentTrackIndex >= tracks.length) {
      currentTrackIndex = 0;
    }

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
        document.querySelector('.playlist__item_active').previousElementSibling.scrollIntoView();
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
    const {tracks, currentTrackIndex} = this.state;

    return (
      <PlayList
        tracks={tracks}
        currentTrackIndex={currentTrackIndex}
        playThisTrack={this.playThisTrack}/>
    );
  }

  render() {
    const {isError, isLoading, tracks, currentTrackIndex} = this.state;
    const track = tracks[currentTrackIndex];

    if (isError) {
      return (
        <div>Error: Can't load tracks</div>
      );
    }

    if (isLoading) {
      return (
        <div>Loading...</div>
      );
    }

    if (track) {
      track.isPlaying = localStorage.getItem('isPlaying-' + this.state.playlistId) === 'true';
      track.playlistId = this.state.playlistId;
    }

    if (tracks.length === 0) {
      return (
        <EmptyPlayList />
      );
    }

    return (
      <div>
        <div className="navbar-fixed">
          <div className="layout">
            <nav className="navbar">
              <AudioPlayer track={track} playNextTrack={this.playNextTrack.bind(this)} />
              <ActiveTrack
                track={track}
                currentTrackIndex={currentTrackIndex}
                scrollToCurrentTrack={this.scrollToCurrentTrack}
              />
            </nav>
          </div>
        </div>
        <div className="layout layout_main">
          {this.renderPlaylist()}
        </div>
      </div>
    );
  }
}