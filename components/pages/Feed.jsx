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
import { useState, useRef } from 'react';
import { notificationsOutline } from 'ionicons/icons';
import { getHomeItems } from '../../store/selectors';
// import { getTodayItems } from '../../store/selectors';
import Store from '../../store';

import * as selectors from '../../store/selectors';
// import { setSettings } from '../../store/actions';
// const Settings = () => {
//   const settings = Store.useState(selectors.getSettings);
//TODO setPlayerList
const Feed = ({ data }) => {
  const homeItems = Store.useState(getHomeItems);
  const todayItems = Store.useState(selectors.getTodayItems);

  const playList = Store.useState(selectors.getPlayerList);

  console.log('playList.length', playList.length)
  const [showNotifications, setShowNotifications] = useState(false);
  // const playerRef = useRef();
  

  // console.log(playerRef.current)
  console.log( '1111playList',  playList)
  if(playList.value){
    console.log(playList.value, 'playList')
  }
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
        {todayItems.map((i, index) => (
            <IonItem key={index}>
              <IonAvatar slot="start">
                <img src={i.avatar_sq} />
              </IonAvatar>
              <IonLabel>
                <h2>{i.series_title}</h2>
                <p>{i.sermon_notes.replace(/(<([^>]+)>)/gi, "")}</p>
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
