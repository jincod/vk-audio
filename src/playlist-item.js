import React from 'react'


export class PlayListItem extends React.Component {
  playTrack(index) {
    this.props.playThisTrack(index);
  }

  formatDuration(seconds) {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    var seconds = seconds - (hours * 3600) - (minutes * 60);

    if (hours < 10) {hours = '0' + hours;}
    if (minutes < 10) {minutes = '0' + minutes;}
    if (seconds < 10) {seconds = '0' + seconds;}

    if (hours === '00') {
      return `${minutes}:${seconds}`;
    }
    return `${hours}:${minutes}:${seconds}`;
  }
  
  render() {
    const track = this.props.track;
    const currentTrackIndex = track.currentTrackIndex;
    const currentClass = track.index === currentTrackIndex ?
      'playlist__item playlist__item_active' : 'playlist__item';

    return (
      <div onClick={this.playTrack.bind(this, track.index)} className={currentClass}>
        <div className="playlist__item_index">{track.index + 1}.</div>
        <div className="playlist__item_title"><span dangerouslySetInnerHTML={{__html: track.title}}></span></div>
        <div className="playlist__item_artist"><span dangerouslySetInnerHTML={{__html: track.artist}}></span></div>
        <div className="playlist__item_time">{this.formatDuration(track.duration)}</div>
      </div>
    );
  }
}
