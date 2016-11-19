import React from 'react';

const ActiveTrack = ({
  track,
  currentTrackIndex,
  scrollToCurrentTrack
}) => {
  const {artist, title} = track;

  return (
    <div onClick={scrollToCurrentTrack} className="current-track">
      {currentTrackIndex + 1}. <span dangerouslySetInnerHTML={{__html: artist}}></span> - <span dangerouslySetInnerHTML={{__html: title}}></span>
    </div>
  );
};

export default ActiveTrack;
