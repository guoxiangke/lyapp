import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import ReactHowler from 'react-howler'
import styles from '../styles/Player.module.css'
import { IonProgressBar, IonIcon, IonContent,IonAvatar } from '@ionic/react';
import { caretForwardOutline,refreshOutline,pauseOutline  } from 'ionicons/icons';

import { AppContext, getPlaying, seekTrack, getTrackCurrent, pauseTrack, playTrack, getIsPlaying, setDuration, setOnPlay, getTracks, switchATrack, getCurrentTrackIndex } from '../store/state';

function Player() {
  const { state, dispatch } = useContext(AppContext);
  const playing = getPlaying(state); // 当前播放的节目{}
  const track = getTrackCurrent(state);
  const tracks = getTracks(state);
  const index = getCurrentTrackIndex(state);
  if (!playing) return null;
  if (!track) return null;
  const isPlaying = getIsPlaying(state); // 当前播放状态
  // console.log('Player', '5次？')
  

  // const player = this.refs.player;
  const playerRef = useRef();

  const doPlayToggle = useCallback((e) => {
    // Stop the toggle from opening the modal
    e.stopPropagation();
    if (playing.paused) {
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
    dispatch(setOnPlay());
    // setIsPlaying(true);
    // isPlaying = true // Uncaught TypeError: "isPlaying" is read-only
    // React useState hook is asynchronous!  https://dev.to/shareef/react-usestate-hook-is-asynchronous-1hia
    console.log('handleOnPlay');
  };
  const handleOnEnd =  () => {
    //reset progress
    dispatch(pauseTrack());
    dispatch(seekTrack(0));
    console.log('handleOnEnd','seekTrack(0)');
  };



  // https://stackoverflow.com/questions/53898810/executing-async-code-on-update-of-state-with-react-hooks
  const [handle, setHandle] = useState(null);

  useEffect(() => {
    const playing = getPlaying(state);
    console.log(playing)
    let h;
    if (track.isloaded && playing && !playing.paused) {
      clearTimeout(h);
      h = setTimeout(() => {
        dispatch(seekTrack(Math.floor(playing.progress + 1)));
        // setProgress(progress+1)
      }, 1000);
      setHandle(h);
    }

    return () => {
      clearTimeout(h);
    };
  }, [state.playing]);
  
  const doPlayPrev = useCallback(() => {
      let i = index
      if(i == 0) {
        i=tracks.length-1;
      }else{
        i--;
      }
      dispatch(switchATrack(tracks[i]));
      dispatch(playTrack());
  })
  const doPlayNext = useCallback(() => {
      let i = index
      if(++i == tracks.length) i=0;
      dispatch(switchATrack(tracks[i]));
      dispatch(playTrack());
  })
   return (
    <>
      <div>
       <ReactHowler
          src={track.url.replace('txly2.net','lystore.yongbuzhixi.com')}
          playing={!playing.paused}
          preload={true}
          onLoad={handleOnLoad}
          ref={playerRef}
          onPlay={handleOnPlay}
          onEnd={handleOnEnd}
        />
        <IonProgressBar className={`${styles.bar} flex flex-row justify-center mx-36 text-2xl`} value={0.1}></IonProgressBar>
      </div>
      <div className={`${styles.player} flex flex-row justify-center mx-36 text-2xl`}>

        <IonAvatar slot="start">
          <img src={"https://images.weserv.nl/?w=100&url="+track.avatar_sq} />
        </IonAvatar>

        <div className={`px-8 py-2`}>
        	<div className="meta">
          	<h5 className="title font-semibold text-sm">{track.series_title}-{playing.progress.toFixed(0)} / {track.duration.toFixed(0)}</h5>
          	<p className="description text-sm">{track.sermon_notes.replace(/(<([^>]+)>)/gi, "")}</p>
          </div>
        </div>

        <div>
          {playing.paused ? (
              <IonIcon icon={caretForwardOutline} onClick={doPlayToggle} />
          ) : (
            <IonIcon icon={pauseOutline} onClick={doPlayToggle} />
          )}
        </div>
      </div>
     </>
  )
}

export default Player