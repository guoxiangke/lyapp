import Store from '.';

export const setMenuOpen = open => {
  Store.update(s => {
    s.menuOpen = open;
  });
};

export const setNotificationsOpen = open => {
  Store.update(s => {
    s.notificationsOpen = open;
  });
};

export const setSettings = settings => {
  Store.update(s => {
    s.settings = settings;
  });
};

export const setPlayerList = (playerList) => {
  Store.update(s => {
    s.playerList = playerList;
    console.log('setPlayerList called', playerList.length)
  });
};

export const setCurrentPlayer = (playerCurrent, isPlaying) => {
  Store.update(s => {
    s.playerCurrent = playerCurrent;
    s.isPlaying = isPlaying;
  });
};

// App-specific actions

export const setDone = (list, item, done) => {
  Store.update((s, o) => {
    const listIndex = o.lists.findIndex(l => l === list);
    const itemIndex = o.lists[listIndex].items.findIndex(i => i === item);
    s.lists[listIndex].items[itemIndex].done = done;
    if (list === o.selectedList) {
      s.selectedList = s.lists[listIndex];
    }
  });
};
