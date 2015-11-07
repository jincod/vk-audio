import React from 'react'
import { Link } from 'react-router'
import { PlayListItem } from './playlist-item'

export class PlayList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if(!this.props.tracks.length) {
      return (
        <div>
          <h4>Take wall id or user id in search form or choose examples</h4>
          <Link to="/wall-20833574">BBC Radio 1 / 1Xtra</Link>
        </div>
      )
    }

    const items = this.props.tracks.map((track, index) => {
      track.index = index;
      track.isActive = index === this.props.currentTrackIndex;
      return <PlayListItem key={index} currentTrack={track} playThisTrack={this.props.playThisTrack} />
    });
    return <ul className="list-group track-list">{items}</ul>
  }
}


