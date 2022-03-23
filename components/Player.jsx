import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import ReactHowler from 'react-howler'
import styles from '../styles/Player.module.css'
import { IonProgressBar, IonIcon, IonContent,IonAvatar, IonRange } from '@ionic/react';
import { caretForwardOutline,refreshOutline,pauseOutline, playSkipForwardOutline, playSkipBackOutline  } from 'ionicons/icons';

import { AppContext, seekTrack, getTrackCurrent,getTrackIsPlaying, pauseTrack, playTrack, setDuration, setOnPlay, getTracks, switchATrack } from '../store/state';

function Player() {
  const { state, dispatch } = useContext(AppContext);
  const track = getTrackCurrent(state);
  if (!track) return null;
  const tracks = getTracks(state);
  
  

  // const player = this.refs.player;

  const doPlayToggle = useCallback((e) => {
    // Stop the toggle from opening the modal
    e.stopPropagation();
    if (track.paused) {
      dispatch(playTrack());
    } else {
      dispatch(pauseTrack());
    }
  })

  const handleOnLoad =  () => {
    const playerRef = useRef();
    dispatch(setDuration(playerRef.current.duration()));
    console.log(playerRef.current.duration(),'2 times?')
  };
  const handleOnPlay =  () => {
    // dispatch(setOnPlay());
    // React useState hook is asynchronous!  https://dev.to/shareef/react-usestate-hook-is-asynchronous-1hia
    console.log('handleOnPlay');
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
          src={track.link.replace('txly2.net','lystore.yongbuzhixi.com')}
          playing={!track.paused}
          preload={true}
          onLoad={handleOnLoad}
          ref={playerRef}
          onPlay={handleOnPlay}
          onEnd={handleOnEnd}
        />
        <IonRange className={`${styles.range}`}  value={track.progress/track.duration*100}></IonRange>
      </div>
      <div className={`${styles.player} flex flex-row justify-center mx-36 text-2xl`}>

        <IonAvatar slot="start">
          <img src={"https://images.weserv.nl/?w=100&url=https://txly2.net/images/program_banners/"+track.code+"_prog_banner_sq.png"} />
        </IonAvatar>

        <div className={`px-8 py-2`}>
        	<div className="meta">
          	<h5 className="title font-semibold text-sm">{track.program_name}-{track.progress.toFixed(0)} / {track.duration.toFixed(0)}</h5>
          	<p className="description text-sm">{track.description}</p>
          </div>
        </div>

        <div>

          <IonIcon icon={playSkipBackOutline} onClick={doPlayPrev} />
          {track.paused ? (
              <IonIcon icon={caretForwardOutline} onClick={doPlayToggle} />
          ) : (
            <IonIcon icon={pauseOutline} onClick={doPlayToggle} />
          )}
          <IonIcon icon={playSkipForwardOutline} onClick={doPlayNext} />

        </div>
      </div>
     </>
  )
}

export default Player