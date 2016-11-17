import React, {Component} from 'react';
import {Link} from 'react-router';
import PlayListItem from './playlist-item';

export default class PlayList extends Component {
  renderEmpty() {
    return (
      <div className="hello-block">
        <h4 className="hello-block__title">Take wall id or user id in search form or choose examples</h4>
        <Link to="/wall-20833574" className="hello-block__link">BBC Radio 1 / 1Xtra</Link>
      </div>
    );
  }
  render() {
    const {tracks, currentTrackIndex, playThisTrack} = this.props;

    if(!tracks.length) {
      return this.renderEmpty();
    }

    return (
      <div className="playlist">
      {
        tracks
          .map((track, index) => Object.assign(track, {index, currentTrackIndex}))
          .map(track => (
            <PlayListItem key={track.index} track={track} playThisTrack={playThisTrack} />
          ))
      }
      </div>);
  }
}