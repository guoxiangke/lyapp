import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonList, IonText, 
  IonAvatar, 
  IonImg,
  IonButtons,
  IonThumbnail, IonButton, IonIcon, IonDatetime, IonSelect, IonSelectOption, IonToggle, IonInput, IonCheckbox, IonRange, IonNote, IonItemDivider } from '@ionic/react';
// import { closeCircle, home, star, navigate, informationCircle, checkmarkCircle, shuffle } from 'ionicons/icons';
import { notificationsOutline, musicalNotesOutline } from 'ionicons/icons';
import Notifications from './Notifications';
import Bottom from './Bottom';

import { useState, useCallback, useContext, useEffect } from 'react';
import { AppContext, setCategories, getCategories } from '../../store/state';


const Lists = () => {
  const { state, dispatch } = useContext(AppContext);
  const fetchLists = useCallback(async () => {
    // Fetch json from external API
    console.log(process.env.apiUrl)
    const res = await fetch(process.env.apiUrl + '/api/categories')
    const categories = await res.json()
    dispatch(setCategories(categories.data));
  }, [dispatch]);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const categories = getCategories(state);
  const [showNotifications, setShowNotifications] = useState(false);
  return (
     <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonTitle>更多节目</IonTitle>
          <IonButtons slot="start">
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowNotifications(true)}>
              <IonIcon icon={musicalNotesOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <Notifications open={showNotifications} onDidDismiss={() => setShowNotifications(false)} />
        <IonList>
         {categories.map((Category, index) => (
          <div  key={index}>
          <IonItemDivider>
            <IonLabel>
              {Category.name}
            </IonLabel>
          </IonItemDivider>
            {Category && Category.programs.map((Program, i) => (
              <IonItem key={i} button onClick={() => { console.log('clicked!'); }} routerLink={`/tabs/lists/${Program.alias}`}>

                <IonThumbnail slot="start">
                  <IonImg src={process.env.bannersUrl.replace('[code]', Program.alias)} />
                </IonThumbnail>
                <IonLabel>
                  <h3>{Program.name}</h3>
                  <p>{Program.description}</p>
                </IonLabel>
              </IonItem>
              ))}
          </div>
          ))}
        </IonList>
        <Bottom />
      </IonContent>
    </IonPage>
  );
};

export default Lists;
