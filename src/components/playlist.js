import React from 'react';
import PlayListItem from './playlist-item';

const PlayList = ({tracks, currentTrackIndex, playThisTrack}) => {
  return (
    <div className="playlist">
    {
      tracks
        .map((track, index) => Object.assign(track, {index, currentTrackIndex}))
        .map(track => (
          <PlayListItem key={track.index} track={track} playThisTrack={playThisTrack} />
        ))
    }
    </div>
  );
}

export default PlayList;
