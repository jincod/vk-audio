import React from 'react'
import { Link } from 'react-router'
import { PlayListItem } from './playlist-item'

export class PlayList extends React.Component {
  constructor(props) {
    super(props);
  }
  renderEmpty() {
    return (
      <div>
        <h4>Take wall id or user id in search form or choose examples</h4>
        <Link to="/wall-20833574">BBC Radio 1 / 1Xtra</Link>
      </div>
    );
  }
  render() {
    if(!this.props.tracks.length) {
      return this.renderEmpty();
    }

    const items = this.props.tracks.map((track, index) => {
      track.index = index;
      track.currentTrackIndex = this.props.currentTrackIndex;
      return <PlayListItem key={index} track={track} playThisTrack={this.props.playThisTrack} />
    });
    return <div className="playlist">{items}</div>;
  }
}