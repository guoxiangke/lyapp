import {
  IonBackButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonAvatar,
  IonIcon,
  IonImg,
  IonThumbnail,
  IonButton,
} from '@ionic/react';
import { caretForwardOutline, pauseOutline,notificationsOutline, musicalNotesOutline  } from 'ionicons/icons';
import Notifications from './Notifications';
import Bottom from './Bottom';
import { useState, useCallback, useContext, useEffect } from 'react';
import { AppContext, getCategories, setCategories, setProgramTracks, switchATrack, playTrack, setTracks, pauseTrack,getTrackCurrent } from '../../store/state';

const ListDetail = ({ match }) => {
  const { state, dispatch } = useContext(AppContext);
  // const lists = Store.useState(selectors.getLists);
  const {
    params: { listId },
  } = match;


  const fetchLists = useCallback(async () => {
    // Fetch json from external API
    const res = await fetch('https://open.lyapp3.net/api/program/'+listId)
    const programs = await res.json()
    dispatch(setProgramTracks(programs.data));
    // 如果是刷新，而非从 列表进入本页详情
    if(categories.length==0) {
      const res = await fetch('https://open.lyapp3.net/api/categories')
      const categories = await res.json()
      dispatch(setCategories(categories.data));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const categories = getCategories(state);
  let Aprogram = {}
  categories.map((category, i)=>{
    category.programs.map((program, j)=>{
      if(program.alias === listId){
        Aprogram = program
      }
    })
  })

  const ct = getTrackCurrent(state);
  const playing = !ct.paused; // 当前播放的节目{}
  var d = new Date(); //2022-03-18
  const doPlayToggle = useCallback((tract, index) => {
    dispatch(setTracks(state.programTracks));
    if(ct.id !== tract.id){
      dispatch(switchATrack(tract, index));
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
  const today = new Date();
  const priorDate = new Date(new Date().setDate(today.getDate() - 30));
  const las30days = priorDate.toISOString().slice(2,10).replace(/-/g,"");
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/lists" />
          </IonButtons>

          <IonButtons slot="end">
            <IonButton onClick={() => setShowNotifications(true)}>
              <IonIcon icon={musicalNotesOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>{Aprogram.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large"  className={`d-ion-title-large`}>{Aprogram.name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Notifications open={showNotifications} onDidDismiss={() => setShowNotifications(false)} />
        <IonList>
        {state.programTracks && state.programTracks.filter(trackItem => {
          return (trackItem.play_at >= las30days) // now - 30天
        }).map((trackItem, index) => (
            <IonItem button detail="false" key={index} onClick={() => doPlayToggle(trackItem, index)}>
              <IonThumbnail slot="start">
                <IonImg src={"https://txly2.net/images/program_banners/"+Aprogram.alias+"_prog_banner_sq.png"} />
              </IonThumbnail>
              <IonLabel>
                <h3>{trackItem.description}</h3>
                <p>20{trackItem.play_at.slice(0,2)}-{trackItem.play_at.slice(2,4)}-{trackItem.play_at.slice(4,6)}</p>
              </IonLabel>
              {
                trackItem.id  == ct.id
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

export default ListDetail;
