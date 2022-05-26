import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import ReactHowler from 'react-howler'
import styles from '../styles/Player.module.css'
import { IonProgressBar, IonIcon, IonContent,IonAvatar, IonRange } from '@ionic/react';
import { caretForwardOutline,refreshOutline,pauseOutline, playSkipForwardOutline, playSkipBackOutline  } from 'ionicons/icons';

import { AppContext, seekTrack, getTrackCurrent,getTrackIsPlaying, pauseTrack, playTrack, setDuration, setOnPlay, getTracks, switchATrack,
  setPlayer,
  } from '../store/state';

function Player() {
  const { state, dispatch } = useContext(AppContext);
  const track = getTrackCurrent(state);
  const tracks = getTracks(state);
  
  

  // const player = this.refs.player;
  const playerRef = useRef();

  const doPlayToggle = useCallback(() => {
    // Stop the toggle from opening the modal
    // e.stopPropagation();
    if (track.paused) {
      dispatch(playTrack());
    } else {
      dispatch(pauseTrack());
    }
  })

  const handleOnLoad =  () => {
    dispatch(setDuration(playerRef.current.duration()));
    console.log(playerRef.current.duration(),'2 times?')
  };
  const handleOnPlay =  () => {
    // dispatch(setOnPlay());
    // React useState hook is asynchronous!  https://dev.to/shareef/react-usestate-hook-is-asynchronous-1hia
    console.log('handleOnPlay');
    dispatch(setPlayer(playerRef.current));
  };
  const handleOnEnd =  () => {
    doPlayNext()
    console.log('handleOnEnd','doPlayNext');
  };



  // https://stackoverflow.com/questions/53898810/executing-async-code-on-update-of-state-with-react-hooks
  const [handle, setHandle] = useState(null);
  
  useEffect(() => {
    const track = getTrackCurrent(state);
    let h;
    if (track.isloaded && !track.paused) {
      clearTimeout(h);
      h = setTimeout(() => {
        dispatch(seekTrack(Math.floor(track.progress + 1)));
      }, 1000);
      setHandle(h);
    }
    return () => {
      clearTimeout(h);
    };
  }, [state.track]);
  
  const doPlayPrev = useCallback(() => {
      let i = track.index;
      if(i == 0) {
        i=tracks.length-1;
      }else{
        i--;
      }
      dispatch(switchATrack(tracks[i], i));
      dispatch(playTrack());
  })
  const doPlayNext = useCallback(() => {
      let i = track.index;
      if(++i == tracks.length) i=0;
      dispatch(switchATrack(tracks[i], i));
  })
   return (
    <>
      <div>
       <ReactHowler
          src={track.link}
          playing={!track.paused}
          preload={true}
          onLoad={handleOnLoad}
          ref={playerRef}
          onPlay={handleOnPlay}
          onEnd={handleOnEnd}
        />
      </div>
     </>
  )
}

export default Player