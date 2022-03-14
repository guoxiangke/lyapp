import { Store as PullStateStore } from 'pullstate';

import { lists, homeItems, todayItems, notifications } from '../mock';

const Store = new PullStateStore({
  safeAreaTop: 0,
  safeAreaBottom: 0,
  menuOpen: false,
  notificationsOpen: false,
  currentPage: null,
  homeItems,
  lists,
  notifications,
  settings: {
    enableNotifications: true,
  },
  todayItems,
  playerList: [],
  playerCurrent: 0,
  isPlaying: false,
});

export default Store;
