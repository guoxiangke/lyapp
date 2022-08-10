import styles from '../../styles/Feed.module.css'

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonMenuButton,
  IonList,
  IonItem,
  IonLabel,
  IonImg,
  IonThumbnail,
  IonFab, IonFabButton, IonFabList
} from '@ionic/react';

import { add, caretForwardOutline,refreshOutline,pauseOutline  } from 'ionicons/icons';
import Notifications from './Notifications';
import Bottom from './Bottom';
import { useState, useCallback, useContext, useEffect } from 'react';
import { notificationsOutline, musicalNotesOutline } from 'ionicons/icons';

import { AppContext, switchATrack, playTrack, initTrack, setTracks, setTodayTracks, pauseTrack,getTrackCurrent } from '../../store/state';


const Feed = () => {
  const { state, dispatch } = useContext(AppContext);
  const fetchTodayLists = useCallback(async () => {
    // Fetch json from external API
    const res = await fetch('https://open.729ly.net/api/today')
    let today = await res.json()
    dispatch(setTodayTracks(today.data));
    dispatch(setTracks(today.data)); //第一次播放本页面的音乐的时候设定！用来上一曲/下一曲
    // 设置当前播放的节目及index
    let index = 0;
    dispatch(initTrack(today.data[index])); //同时设定了当前播放的是第0首
  }, [dispatch]);

  useEffect(() => {
    fetchTodayLists();
  }, [fetchTodayLists]);

  // const playing = getPlaying(state); // 当前播放的节目{}
  const ct = getTrackCurrent(state);
  const doPlayToggle = useCallback((trackItem, index) => {
    dispatch(setTracks(state.todayTracks));
    if(ct.id !== trackItem.id){
      dispatch(switchATrack(trackItem, index));
      dispatch(playTrack());
    }else{
      if (ct.paused) {
        dispatch(playTrack());
      }else{
        dispatch(pauseTrack());
      }
    }
  })

  const [showNotifications, setShowNotifications] = useState(false);
  // const playerRef = useRef();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>今日节目</IonTitle>
          <IonButtons slot="start">
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowNotifications(true)}>
              <IonIcon icon={musicalNotesOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent  className={`${styles.yyy} ion-padding`} fullscreen>
       {/*-- fab placed to the top end --*/}
        <IonFab vertical="bottom" horizontal="end" slot="fixed" className="right-16">
          <a href="https://ly729.airtime.pro" rel="noreferrer" target="_blank">
            <IonFabButton className="w-12 h-12">
            <IonImg src="/recorded.jpg" alt="同行频道" />
            </IonFabButton>
          </a>
        </IonFab>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large" className={`d-ion-title-large`}>今日节目</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Notifications open={showNotifications} onDidDismiss={() => setShowNotifications(false)} />
        <IonList>
        {state.todayTracks.map((trackItem, index) => (
            <IonItem button detail="false" key={index} onClick={() => doPlayToggle(trackItem, index)}>
              <IonThumbnail slot="start">
                <IonImg src={"https://txly2.net/images/program_banners/"+trackItem.code+"_prog_banner_sq.png"} />
              </IonThumbnail>
              <IonLabel>
                <h2>{trackItem.program_name}</h2>
                <p>{trackItem.description}</p>
              </IonLabel>
              {
                trackItem.id == ct.id
                ?(ct.paused ? (
                    <IonIcon icon={caretForwardOutline} />
                  ) : (
                    <IonIcon icon={pauseOutline} />
                  )
                )
                : 
                <IonIcon icon={caretForwardOutline}/>
              }

              
            </IonItem>
        ))}
        </IonList>
        <Bottom />
      </IonContent>
    </IonPage>
  );
};

export default Feed;
