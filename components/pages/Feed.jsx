import Image from 'next/image';
import Card from '../ui/Card';

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
import { AppContext, getHotTracks, getNewTracks, playTrack } from '../../store/state';

import * as selectors from '../../store/selectors';

const Feed = () => {
  const { state, dispatch } = useContext(AppContext);

  console.log(state, 'state.playing.index Feed')
  const fetchTodayLists = useCallback(async () => {
    // Fetch json from external API
    const res = await fetch('https://txly2.net/index.php?option=com_vdata&task=get_feeds&type=vd6usermons42&column=sermon_publish_up&value=2022-03-16')
    const today = await res.json()
    state.tracks.today = today;
    dispatch({
      type: 'setTracts',
      tracks: state.tracks
    })

    // doPlay(today[0]);
    // // 设置当前播放的节目
    // let index = 0;
    // dispatch({
    //   type: 'setTract',
    //   tracks: today[index]
    // })
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

  const doPlay = useCallback(track => {
    console.log('doPlay called', 'then dispatch(playTrack', track)
    dispatch(playTrack(track));
  });

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
      <IonContent className="ion-padding" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Feed</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Notifications open={showNotifications} onDidDismiss={() => setShowNotifications(false)} />
        <IonList>
        {state.tracks.today.map((track, index) => (
            <IonItem key={index} onClick={() => doPlay(track)} >
              <IonAvatar slot="start">
                <img src={track.avatar_sq} />
              </IonAvatar>
              <IonLabel>
                <h2>{track.series_title}</h2>
                <p>{track.sermon_notes.replace(/(<([^>]+)>)/gi, "")}</p>
              </IonLabel>
              <IonIcon icon={caretForwardOutline}/>
            </IonItem>
        ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Feed;
