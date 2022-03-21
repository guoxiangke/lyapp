import Store from '../../store';

import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonList, IonText, IonAvatar, IonThumbnail, IonButton, IonIcon, IonDatetime, IonSelect, IonSelectOption, IonToggle, IonInput, IonCheckbox, IonRange, IonNote, IonItemDivider } from '@ionic/react';
import { closeCircle, home, star, navigate, informationCircle, checkmarkCircle, shuffle } from 'ionicons/icons';


const ListEntry = ({ list, ...props }) => (
  <IonItem routerLink={`/tabs/lists/${list.id}`} className="list-entry">
    <IonLabel>{list.name}</IonLabel>
  </IonItem>
);

import { useState, useRef, useCallback, useContext, useEffect } from 'react';
import { AppContext, setCategories, getCategories } from '../../store/state';


const Lists = () => {
  const { state, dispatch } = useContext(AppContext);
  const fetchLists = useCallback(async () => {
    // Fetch json from external API
    const res = await fetch('https://open.ly.yongbuzhixi.com/api/categories')
    const categories = await res.json()
    dispatch(setCategories(categories.data));
  }, [dispatch]);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const categories = getCategories(state);
  console.log(categories)
  return (
     <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>节目分类</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>

    {/*-- Item Dividers in a List  color="secondary" --*/}
    <IonList>
     {categories.map((Category, index) => (
      <div  key={index}>
      <IonItemDivider>
        <IonLabel>
          {Category.name}
        </IonLabel>
      </IonItemDivider>
        {Category && Category.programs.map((Item, i) => (
          <IonItem key={i} button onClick={() => { }}>
            <IonThumbnail slot="start">
              <img src={"https://images.weserv.nl/?w=100&url=https://txly2.net/images/program_banners/"+Item.alias+"_prog_banner_sq.png"} />
            </IonThumbnail>
            <IonLabel>
              <h3>{Item.name}</h3>
              <p>{Item.brief}</p>
            </IonLabel>
            <IonIcon icon={closeCircle} slot="end" />
          </IonItem>
          ))}
      </div>
      ))}



    </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Lists;
