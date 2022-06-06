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
} from '@ionic/react';
import { caretForwardOutline, pauseOutline  } from 'ionicons/icons';
// import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonList, IonText, IonAvatar, IonThumbnail, IonButton, IonIcon, IonDatetime, IonSelect, IonSelectOption, IonToggle, IonInput, IonCheckbox, IonRange, IonNote, IonItemDivider } from '@ionic/react';

import { useCallback, useContext, useEffect } from 'react';
import { AppContext, getCategories, setProgramTracks, switchATrack, playTrack, setTracks, pauseTrack,getTrackCurrent } from '../../store/state';

const ListDetail = ({ match }) => {
  const { state, dispatch } = useContext(AppContext);
  // const lists = Store.useState(selectors.getLists);
  const {
    params: { listId },
  } = match;

  const categories = getCategories(state);
  let Aprogram = {}
  categories.map((category, i)=>{
    category.programs.map((program, j)=>{
      if(program.alias === listId){
        Aprogram = program
      }
    })
  })

  const fetchLists = useCallback(async () => {
    // Fetch json from external API
    const res = await fetch('https://open.729ly.net/api/program/'+listId)
    const programs = await res.json()
    dispatch(setProgramTracks(programs.data));
  }, [dispatch]);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);



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
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/lists" />
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

        {state.programTracks && state.programTracks.map((trackItem, index) => (
            <IonItem key={index} onClick={() => doPlayToggle(trackItem, index)}>
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
      </IonContent>
    </IonPage>
  );
};

export default ListDetail;
