import { IonApp, IonRouterOutlet, IonSplitPane, IonPage } from '@ionic/react';
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


import { AppContextProvider } from "../store/state";
const AppShell = () => {
  // AppContextProvider 放在哪里？
  // @see https://ionicframework.com/blog/using-react-hooks-in-an-ionic-react-app/
  // Hi. For your App component, you can't use useContext(AppContext) there since App is not children of AppContextProvider.
  // @see https://github.com/facebook/react/issues/16225
  return (
    <IonApp>
      <AppContextProvider>
        <IonReactRouter>
          <IonPage>
            <IonSplitPane contentId="main">
              <IonRouterOutlet id="main">
                <Route path="/tabs" render={() => <Tabs />} />
                <Route exact path="/" render={() => <Redirect to="/tabs" />} />
              </IonRouterOutlet>
            </IonSplitPane>
            <Player />
          </IonPage>
        </IonReactRouter>
      </AppContextProvider>
    </IonApp>
  );
};

export default AppShell;
