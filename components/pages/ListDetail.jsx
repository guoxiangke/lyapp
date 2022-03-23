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
} from '@ionic/react';
import { caretForwardOutline,refreshOutline,pauseOutline  } from 'ionicons/icons';
// import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonList, IonText, IonAvatar, IonThumbnail, IonButton, IonIcon, IonDatetime, IonSelect, IonSelectOption, IonToggle, IonInput, IonCheckbox, IonRange, IonNote, IonItemDivider } from '@ionic/react';

import Store from '../../store';
import * as actions from '../../store/actions';
import * as selectors from '../../store/selectors';

const ListItems = ({ list }) => {
  return (
    <IonList>
      {(list?.items || []).map((item, key) => (
        <ListItemEntry list={list} item={item} key={key} />
      ))}
    </IonList>
  );
};

const ListItemEntry = ({ list, item }) => (
  <IonItem onClick={() => actions.setDone(list, item, !item.done)}>
    <IonLabel>{item.name}</IonLabel>
    <IonIcon icon={caretForwardOutline}  slot="end" />
  </IonItem>
);

import { useState, useRef, useCallback, useContext, useEffect } from 'react';
import { AppContext, getCategories, setProgramTracks,  getHotTracks, getNewTracks, switchATrack, playTrack, initTrack, setTracks, pauseTrack,getTrackCurrent } from '../../store/state';

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
            <IonTitle size="large">{Aprogram.name}</IonTitle>
          </IonToolbar>
        </IonHeader>

        {state.programTracks && state.programTracks.map((trackItem, index) => (
            <IonItem key={index} onClick={() => doPlayToggle(trackItem, index)}>
              <IonAvatar slot="start">
                <img src={"https://images.weserv.nl/?w=100&url=https://txly2.net/images/program_banners/"+Aprogram.alias+"_prog_banner_sq.png"} />
              </IonAvatar>
              <IonLabel>
                <h2>{trackItem.description}</h2>
                <p>{trackItem.play_at}</p>
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
