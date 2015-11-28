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

  playThisTrack(index) {
    this.setState({currentTrackIndex: index});
    localStorage.setItem(`currentTrackIndex-${this.state.playlistId}`, index);
    localStorage.setItem(`isPlaying-${this.state.playlistId}`, 'true');
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
    }

    return (
      <div>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            {
              track && <AudioPlayer track={track} />
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