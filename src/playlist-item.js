import React from 'react'


export class PlayListItem extends React.Component {

  playTrack(index) {
    this.props.playThisTrack(index);
  }
  
  render() {
    const track = this.props.track;
    const currentTrackIndex = track.currentTrackIndex;
    const currentClass = track.index === currentTrackIndex ?
      'list-group-item active' : 'list-group-item';

    return (
      <li onClick={this.playTrack.bind(this, track.index)} className={currentClass}>
        {track.index + 1}. <span dangerouslySetInnerHTML={{__html: track.artist}}></span> - <span dangerouslySetInnerHTML={{__html: track.title}}></span>
      </li>
    )
  }
}


