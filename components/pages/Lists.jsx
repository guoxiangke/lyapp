import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonList, IonText, IonAvatar, IonThumbnail, IonButton, IonIcon, IonDatetime, IonSelect, IonSelectOption, IonToggle, IonInput, IonCheckbox, IonRange, IonNote, IonItemDivider } from '@ionic/react';
// import { closeCircle, home, star, navigate, informationCircle, checkmarkCircle, shuffle } from 'ionicons/icons';


import { useCallback, useContext, useEffect } from 'react';
import { AppContext, setCategories, getCategories } from '../../store/state';


const Lists = () => {
  const { state, dispatch } = useContext(AppContext);
  const fetchLists = useCallback(async () => {
    // Fetch json from external API
    const res = await fetch('https://open.729ly.net/api/categories')
    const categories = await res.json()
    dispatch(setCategories(categories.data));
  }, [dispatch]);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const categories = getCategories(state);
  return (
     <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>节目分类</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
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

                <IonAvatar slot="start">
                  <img src={"https://images.weserv.nl/?w=100&url=https://txly2.net/images/program_banners/"+Program.alias+"_prog_banner_sq.png"} />
                </IonAvatar>
                <IonLabel>
                  <h3>{Program.name}</h3>
                  <p>{Program.brief}</p>
                </IonLabel>
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
