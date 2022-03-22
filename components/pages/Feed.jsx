import Image from 'next/image';
import Card from '../ui/Card';
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
import { useState, useRef, useCallback, useContext, useEffect } from 'react';
import { notificationsOutline } from 'ionicons/icons';

import Store from '../../store';
import { AppContext, getHotTracks, getNewTracks, switchATrack, playTrack, initTrack, setTracks, getPlaying, pauseTrack,getTrackCurrent } from '../../store/state';

import * as selectors from '../../store/selectors';

const Feed = () => {
  const { state, dispatch } = useContext(AppContext);
  const fetchTodayLists = useCallback(async () => {
    // Fetch json from external API
    var d = new Date(); //2022-03-18
    const res = await fetch('https://txly2.net/index.php?option=com_vdata&task=get_feeds&type=vd6usermons42&column=sermon_publish_up&value='+d.toISOString().substring(0, 10))
    const today = await res.json()
    console.log(today)
    dispatch(setTracks(today));

    // 设置当前播放的节目
    let index = 0;
    dispatch(initTrack(today[index]));

    // 设置当前播放的节目 index
    // state.playing.index = index;
    // dispatch({
    //   type: 'setPlaying',
    //   tracks: state.playing
    // })
  }, [dispatch]);

  useEffect(() => {
    fetchTodayLists();
  }, [fetchTodayLists]);

  // const doPlay = useCallback(track => {
  //   console.log('doPlay useCallback', 'then dispatch(playTrack', track)
  //   dispatch(switchATrack(track));
  //   dispatch(playTrack());
  // });

  const playing = getPlaying(state); // 当前播放的节目{}
  const track = getTrackCurrent(state);
  const doPlayToggle = useCallback((trackItem) => {
    if(track.sermon_title !== trackItem.sermon_title){
      dispatch(switchATrack(trackItem));
      dispatch(playTrack());
    }else{
      if (playing.paused) {
        dispatch(playTrack());
      }else{
        dispatch(pauseTrack());
      }
    }
  })

  const [showNotifications, setShowNotifications] = useState(false);
  // const playerRef = useRef();
  
  const ct = getTrackCurrent(state);
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
        {state.tracks.map((trackItem, index) => (
            <IonItem key={index} onClick={() => doPlayToggle(trackItem)}>
              <IonAvatar slot="start">
                <img src={"https://images.weserv.nl/?w=100&url="+trackItem.avatar_sq} />
              </IonAvatar>
              <IonLabel>
                <h2>{trackItem.series_title}</h2>
                <p>{trackItem.sermon_notes.replace(/(<([^>]+)>)/gi, "")}</p>
              </IonLabel>
              {
                trackItem.sermon_title == ct.sermon_title
                ?(playing.paused ? (
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
