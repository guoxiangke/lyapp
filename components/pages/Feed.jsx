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
  IonAvatar,
} from '@ionic/react';
import { caretForwardOutline,refreshOutline,pauseOutline  } from 'ionicons/icons';
import Notifications from './Notifications';
import { useState, useCallback, useContext, useEffect } from 'react';
import { notificationsOutline } from 'ionicons/icons';

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
          <IonTitle>Feed</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowNotifications(true)}>
              <IonIcon icon={notificationsOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent  className={`${styles.yyy} ion-padding`} fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Feed</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Notifications open={showNotifications} onDidDismiss={() => setShowNotifications(false)} />
        <IonList>
        {state.todayTracks.map((trackItem, index) => (
            <IonItem key={index} onClick={() => doPlayToggle(trackItem, index)}>
              <IonAvatar slot="start">
                <img src={"https://images.weserv.nl/?w=100&url=https://txly2.net/images/program_banners/"+trackItem.code+"_prog_banner_sq.png"} />
              </IonAvatar>
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
      </IonContent>
    </IonPage>
  );
};

export default Feed;
