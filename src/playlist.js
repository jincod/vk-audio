import React, {Component} from 'react';
import PlayListItem from './playlist-item';

export default class PlayList extends Component {
  render() {
    const {tracks, currentTrackIndex, playThisTrack} = this.props;

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