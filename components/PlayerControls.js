import React from "react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

export default function PlayerControls(props) {
	console.log(props.song.src)
  return (
    <>
      <AudioPlayer
        // autoPlay
        src={props.song.src}
        onPlay={(e) => console.log("onPlay")}
        showSkipControls
        autoPlayAfterSrcChange
        customVolumeControls={[]}
        showJumpControls={false}
        customAdditionalControls={[]}
        
      />
    </>
  );
}
