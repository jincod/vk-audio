import React from 'react'


export class ActiveTrack extends React.Component {
  render() {
    const {currentTrackIndex, tracks} = this.props;
    if(!tracks.length) {
      return <div/>;
    }
    const track = tracks[currentTrackIndex];
    const index = currentTrackIndex + 1;

    return (
      <div className="current-track navbar-left">
        <span onClick={this.props.scrollToCurrentTrack} className="navbar-text current-track__title">
          {index}. <span dangerouslySetInnerHTML={{__html: track.artist}}></span> - <span dangerouslySetInnerHTML={{__html: track.title}}></span>
        </span>
      </div>
    );
  }
}