import React from 'react'


export class PlayListItem extends React.Component {

  playTrack(index) {
    this.props.playThisTrack(index);
  }
  
  render() {
    const currentTrack = this.props.currentTrack;

    const currentClass = currentTrack.isActive ?
      'list-group-item active' : 'list-group-item';

    return (
      <li onClick={this.playTrack.bind(this, currentTrack.index)} className={currentClass}>
        {currentTrack.index + 1}. <span dangerouslySetInnerHTML={{__html: currentTrack.artist}}></span> - <span dangerouslySetInnerHTML={{__html: currentTrack.title}}></span>
      </li>
    )
  }
}


