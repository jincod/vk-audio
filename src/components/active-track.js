import React from 'react'


export class ActiveTrack extends React.Component {
  render() {
    return (
      <div className="current-track navbar-left">
        <span onClick={this.props.scrollToCurrentTrack} className="navbar-text current-track__title">
          {this.props.index}. <span dangerouslySetInnerHTML={{__html: this.props.artist}}></span> - <span dangerouslySetInnerHTML={{__html: this.props.title}}></span>
        </span>
      </div>
    )
  }
}