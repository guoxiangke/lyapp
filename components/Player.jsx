import React, { useContext, useEffect, useRef, useState } from "react";
import ReactHowler from 'react-howler'
import raf from 'raf' // requestAnimationFrame polyfill
import styles from '../styles/Player.module.css'
import { IonProgressBar, IonIcon, IonContent } from '@ionic/react';
import { caretForwardOutline,refreshOutline,pauseOutline  } from 'ionicons/icons';

import { AppContext, getPlaying, seekTrack, getTrackCurrent } from '../store/state';

function Player() {
  const { state, dispatch } = useContext(AppContext);
  // console.log(state.playing, 'state.playing.index Player')
  const track = getTrackCurrent(state);
  const playing = getPlaying(state);
  
  // console.log(track, '5次track？')
  // console.log(playing, '5次playing？')
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seek, setSeek] = useState(0.0);
  const [duration, setDuration] = useState(0.0);

  const [raf1, setRaf1] = useState();
  

  // const player = this.refs.player;
  const playerRef = useRef();
  const handlePlay =  () => setIsPlaying(true);
  const handleStop =  () => { playerRef.current.stop() || setIsPlaying(false) };

// {() => setIsLoaded(true)}
    // this.setState({
    //   loaded: true,
    //   duration: this.player.duration()
    // })
  const handleOnLoad =  () => {
    setIsLoaded(true)
    setDuration(playerRef.current.duration())
  };
  const handleOnPlay =  () => {
    setIsPlaying(true);
    // isPlaying = true // Uncaught TypeError: "isPlaying" is read-only
    // React useState hook is asynchronous!  https://dev.to/shareef/react-usestate-hook-is-asynchronous-1hia
    console.log('handleOnPlay', isPlaying);
    renderSeekPos();
  };
  const handleOnEnd =  () => {
    console.log('handleOnEnd');
    clearRAF()
    console.log('handleOnEnd2');
  };

  const renderSeekPos =  () => {
    if (!isSeeking) {
      setSeek(playerRef.current.seek());
    }
    // console.log(playerRef.current.howler.playing, playerRef.current.howler._src)
    if (isPlaying) {
      setRaf1(raf(renderSeekPos))
    }
    console.log('renderSeekPos',isSeeking);
  };
  // componentWillUnmount 
  const clearRAF = () => {
    raf.cancel(raf1)
  }

  // https://stackoverflow.com/questions/53898810/executing-async-code-on-update-of-state-with-react-hooks
  useEffect(() => {
    const player = playerRef.current;
    console.log(player, 'player');
    if(isPlaying) renderSeekPos()
  }, [isPlaying]);

  
   return (
    <>
      <div>
       <ReactHowler
          src={track.url.replace('txly2.net','lystore.yongbuzhixi.com')}
          playing={isPlaying}
          preload={true}
          onLoad={handleOnLoad}
          ref={playerRef}
          onPlay={handleOnPlay}
          onEnd={handleOnEnd}
        />
        <IonProgressBar className={`${styles.bar} flex flex-row justify-center mx-36 text-2xl`} value={0.1}></IonProgressBar>
      </div>
      <div className={`${styles.player} flex flex-row justify-center mx-36 text-2xl`}>

        <div className={`px-8 py-2`}>
        	<div className="meta">
          	<h5 className="title font-semibold text-sm">{track.series_title}-{seek.toFixed(0)} / {duration.toFixed(0)}</h5>
          	<p className="description text-sm">{track.sermon_notes.replace(/(<([^>]+)>)/gi, "")}</p>
          </div>
        </div>

        <div>
            {!isPlaying && <IonIcon onClick={handlePlay} icon={caretForwardOutline}/>}
            {isPlaying && <IonIcon onClick={handleStop}  icon={pauseOutline}/>}
        </div>
      </div>
     </>
  )
}

export default Player