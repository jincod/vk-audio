import React from 'react'

export const ActiveTrack = ({
  currentTrackIndex,
  tracks,
  scrollToCurrentTrack
}) => {
  if(!tracks.length) {
    return <div/>;
  }
  const track = tracks[currentTrackIndex];
  const index = currentTrackIndex + 1;

  return (
    <div onClick={scrollToCurrentTrack} className="current-track">
      {index}. <span dangerouslySetInnerHTML={{__html: track.artist}}></span> - <span dangerouslySetInnerHTML={{__html: track.title}}></span>
    </div>
  );
};