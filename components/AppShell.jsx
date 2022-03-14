import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { StatusBar, Style } from '@capacitor/status-bar';

import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './Menu';

import Tabs from './pages/Tabs';

window.matchMedia("(prefers-color-scheme: dark)").addListener(async (status) => {
  try {
    await StatusBar.setStyle({
      style: Style.Light, //status.matches ? Style.Dark : 
    });
  } catch {}
});

import React, { useEffect, useState } from "react";
import Player from "./Player"
// 1. 拉区当日节目列表 作为默认播放列表
// 2. 管理player 播放
// 3. 切换音乐时， 可能切换 播放列表


const AppShell = () => {
  const [songs, setsongs] = useState([

  {

     title: "song 1",

     artist: "artist 1",

     img_src: "./images/img1.jpg",

     src: "https://lystore.yongbuzhixi.com/ly/audio/2022/bc/bc220310.mp3",

  },

  {

     title: "song 2",

     artist: "artist 2",

     img_src: "./images/img2.jpg",

     src: "./songs/Young Dumb & Broke Khalid .mp3",

  },

]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [nextSongIndex, setNextSongIndex] = useState(currentSongIndex + 1);
  return (
    <IonApp>
      <Player
         song={songs[currentSongIndex]}
         nextSong={songs[nextSongIndex]}
        />
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/tabs" render={() => <Tabs />} />
            <Route exact path="/" render={() => <Redirect to="/tabs" />} />
          </IonRouterOutlet>

        </IonSplitPane>
      </IonReactRouter>

    </IonApp>
  );
};

export default AppShell;
