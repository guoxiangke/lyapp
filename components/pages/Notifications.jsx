import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonNote,
  IonLabel,
  IonRange,
  IonAvatar,
  IonImg,
  IonGrid, IonRow, IonCol
} from '@ionic/react';
import { caretForwardOutline,refreshOutline,pauseOutline, playSkipForwardOutline, playSkipBackOutline,

} from 'ionicons/icons';

// import { IonProgressBar, IonIcon, IonContent,IonAvatar, IonRange } from '@ionic/react';
import Store from '../../store';
import { getNotifications } from '../../store/selectors';

import { close } from 'ionicons/icons';
import styles from '../../styles/Player.module.css'
import { msToTime } from '../../utils/tools';

const NotificationItem = ({ notification }) => (
  <IonItem>
    <IonLabel>{notification.title}</IonLabel>
    <IonNote slot="end">{notification.when}</IonNote>
    <IonButton slot="end" fill="clear" color="dark">
      <IonIcon icon={close} />
    </IonButton>
  </IonItem>
);
import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import { AppContext, seekTrack, getTrackCurrent,getTrackIsPlaying, pauseTrack, playTrack, setDuration, setOnPlay, getTracks, switchATrack,
  getPlayer,
  } from '../../store/state';

const Notifications = ({ open, onDidDismiss }) => {
  const { state, dispatch } = useContext(AppContext);
  const track = getTrackCurrent(state);
  const tracks = getTracks(state);
  const player = getPlayer(state);
  // console.log(player)
  
  const notifications = Store.useState(getNotifications);
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

  const seek = (p) =>{
    player.stop();
    dispatch(seekTrack(p));
    player.seek(p);
    dispatch(playTrack());
  }

  const doSpeedForward = useCallback(() => {
    let p = Math.floor(track.progress + 15);
    if(p>=track.duration) p=track.duration-10;
    seek(p)
  })

  const doSpeedBack = useCallback(() => {
    let p = Math.floor(track.progress - 15);
    if(p<=0) p=0;
    seek(p)
  })
    
  const doPlayNext = useCallback(() => {
      let i = track.index;
      if(++i == tracks.length) i=0;
      dispatch(switchATrack(tracks[i], i));
  })
    const doPlayToggle = useCallback(() => {
    // Stop the toggle from opening the modal
    // e.stopPropagation();
    if (track.paused) {
      dispatch(playTrack());
    } else {
      dispatch(pauseTrack());
    }
  })

  const handlePC = useCallback((e,p)=>{
    if ('ontouchstart' in window) {
        return; // onClick 事件，只在pc中执行！
    }
    seek(p)
  })

  const handleMobile = useCallback((e,p)=>{
    seek(p)
  })

  return (
    <IonModal isOpen={open} onDidDismiss={onDidDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>当前播放</IonTitle>
          <IonButton slot="end" fill="clear" color="dark" onClick={onDidDismiss}>
            <IonIcon icon={close} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large"  className={`d-ion-title-large`}>当前播放</IonTitle>
          </IonToolbar>
        </IonHeader>

        
          <IonImg className={`${styles.cover} pt-4`} src={"https://txly2.net/images/program_banners/"+track.code+"_prog_banner_sq.png"} />
         
              <div className={`px-8 py-2`}>
                <div className="meta">
                  <h5 className="title font-semibold text-sm">{track.program_name}</h5>
                  <p className="description text-sm">{track.description}</p>
                </div>
              </div>

          
            <div>
              <IonRange 
                className={`${styles.range} flex flex-row justify-center py-0 text-xl`}  
                value={track.progress/track.duration*100}
                // onIonChange={(e) => { s(e.target.value)}}
                onTouchEnd={(e) => {handleMobile(e, e.target.value/100*track.duration)}}
                onClick ={(e) => {handlePC(e, e.target.value/100*track.duration)}}
                // onTouchStart={(e) => { alert(e.target.value)}}
                ></IonRange>
            </div>
            

            <div className={`flex flex-row justify-between text-xs px-3`}>
              <div>{msToTime(track.progress*1000)}</div>
              <div>- {msToTime((track.duration-track.progress)*1000)}</div>
            </div>
          
           <div className={`flex flex-row justify-between text-4xl mx-4`}>
            <IonIcon icon={playSkipBackOutline} onClick={doPlayPrev} />
            <img  onClick={doSpeedBack}  width="36px" src="/15-sec-back-white.png" />
            {track.paused ? (
              <IonIcon icon={caretForwardOutline} onClick={doPlayToggle} />
            ) : (
              <IonIcon icon={pauseOutline} onClick={doPlayToggle} />
            )}
            <img  onClick={doSpeedForward}  width="36px" src="/15-sec-forward-white.png" />
            <IonIcon icon={playSkipForwardOutline} onClick={doPlayNext} />
          </div>

      </IonContent>
    </IonModal>
  );
};

export default Notifications;
