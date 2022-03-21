import React from 'react';

/**
 * This is a simple redux-like state management pattern for React using hooks
 * that might be useful in your simpler Ionic React apps that don't
 * require something as complex as Redux.
 * 
 * See each page for an example of how to read from state and
 * dispatch actions.
 * 
 * Learn more:
 * https://ionicframework.com/blog/a-state-management-pattern-for-ionic-react-with-react-hooks/
 */

export const AppContext = React.createContext();

const reducer = (state, action) => {
  const playing = getPlaying(state);
  const ct = getCurrentTrack(state);
  const user = getUser(state);

  switch (action.type) {
    case 'setPlaying': {
      return { ...state, playing: action.playing }
    }

    case 'SET_PLAYER_OPEN': {
      return {
        ...state,
        ui: {
          ...state.ui,
          playerOpen: action.open
        }
      }
    }
    case 'PAUSE': {
      return {
        ...state,
        playing: {
          ...state.playing,
          paused: true
        }
      }
    }
    case 'PLAY': {
      return {
        ...state,
        playing: {
          ...state.playing,
          paused: false
        }
      }
    }
    case 'setTracks': {
      return {
        ...state,
        tracks: action.tracks
      }
    }
    case 'setCategories': {
      return {
        ...state,
        categories: action.categories
      }
    }

    case 'INIT': {
      return {
        ...state,
        track: {
          isloaded: false,
          duration: 1,
          ...action.track
        }
      }
    }
    case 'switchATrack': {
      const index = getTrackIndex(state, state.track.url);
      console.log(index)
      return {
        ...state,
        playing: {
          ...state.playing,
          progress: 0,
          index
        },
        track: {
          isloaded: false,
          duration: 1,
          ...action.track
        },
      }
    }
    case 'setDuration': {
      return {
        ...state,
        track: {
          ...state.track,
          isloaded: true,
          duration: action.duration
        }
      }
    }
    case 'onPlay': {
      return {
        ...state,
        playing: {
          ...state.playing,
          paused: false
        },
      }
    }
    case 'PLAY1': {
      if (action.track && action.track !== ct) {
        const newRecentTracks = getRecentTracks(state).filter(t => t.id !== action.track.id);
        const index = getTrackIndex(state, action.track.id);
        return {
          ...state,
          ui: {
            playerOpen: true
          },
          user: {
            ...user,
            recentTracks: [action.track, ...newRecentTracks]
          },
          playing: {
            ...playing,
            index,
            progress: 0,
            paused: false
          }
        }
      }
      return {
        ...state,
        playing: {
          ...playing,
          paused: false
        }
      }
    }
    case 'SEEK': {
      return {
        ...state,
        playing: {
          ...state.playing,
          progress: action.time// <= ct.time ? Math.floor(action.time) : ct.time
        }
      }
    }
    case 'NEXT': {
      return {
        ...state,
        playing: {
          index: (playing.index + 1) % getTracks(state).length,
          progress: 0
        }
      }
    }
    case 'PREV': {
      return {
        ...state,
        playing: {
          index: Math.max(0, state.playing.index - 1),
          progress: 0
        }
      }
    }
    case 'FAV': {
      const isFav = isFavTrack(state, action.track);
      const newFavs = getFavTracks(state).filter(t => t.id !== action.track.id);
      return {
        ...state,
        user: {
          ...user,
          favTracks: !isFav ? [ct, ...newFavs] : newFavs
        }
      }
    }
    case 'LOGOUT': {
      return {
        ...state,
        playing: null,
        auth: {
          ...state.auth,
          user: null
        } 
      }
    }
    case 'LOGGED_IN': {
      return {
        ...state,
        auth: {
          ...state.auth,
          user: action.user
        }
      }
    }

    return state;
  }
};

const logger = (reducer) => {
  const reducerWithLogger = (state, action) => {
    console.log("%cPrevious State:", "color: #9E9E9E; font-weight: 700;", state);
    console.log("%cAction:", "color: #00A7F7; font-weight: 700;", action);
    console.log("%cNext State:", "color: #47B04B; font-weight: 700;", reducer(state,action));
    return reducer(state,action);
  };

  return reducerWithLogger;
}

const loggerReducer = logger(reducer);

const initialState = {
  playing: {
    index: 0,
    progress: 0,
    paused: true,
  },
  track: {
    isloaded: false,
    duration: 1,

    avatar_sq: "https://txly2.net/images/program_banners/hp_prog_banner_sq.png",
    bookmark_id: "15-489",
    series_alias: "hp",
    series_id: "489",
    series_title: "星动一刻",
    sermon_id: "89616",
    sermon_notes: "直播节目",
    sermon_publish_up: "2022-03-16",
    sermon_title: "直播节目-20220316",
    tag_id: "6",
    url: "https://txly2.net/ly/audio/2022/hp/hp220316.mp3",
  },
  auth: {
    user: null
  },
  user: {
    recentTracks: [],
    favTracks: []
  },
  ui: {
    playerOpen: false
  },
  tracks: [],
  categories: [],
  music: {
    tracks: [
      {
        id: '0',
        title: 'Hey Jude',
        artist: 'The Beatles',
        img: 'music/hey-jude.jpg',
        time: 359000
      },
    ],
    hotTracks: ['0', '1', '2', '3'],
    newTracks: ['4', '5', '6', '7']
  },
};

// const persistedState = JSON.parse(window.localStorage['persistedState']);
export function AppContextProvider(props) {
  const fullInitialState = {
    ...initialState,
    // ...persistedState,
  }

  let [state, dispatch] = React.useReducer(reducer, fullInitialState);
  let value = { state, dispatch };

  // useEffect(() => {
  //   // Persist any state we want to
  //   window.localStorage['persistedState'] = JSON.stringify({
  //     user: state.user
  //   });
  // }, [state]);

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
}

export const AppContextConsumer = AppContext.Consumer;

// Some state action creators
export const openPlayer = () => ({
  type: 'SET_PLAYER_OPEN',
  open: true
})

export const closePlayer = () => ({
  type: 'SET_PLAYER_OPEN',
  open: false
})


export const pauseTrack = () => ({
  type: 'PAUSE'
});

export const playTrack = () => ({
  type: 'PLAY',
});

export const setDuration = (duration) => ({
  type: 'setDuration',
  duration
});

export const setOnPlay = () => ({
  type: 'onPlay',
});


export const switchATrack = (track) => ({
  type: 'switchATrack',
  track
});

export const initTrack = (track) => ({
  type: 'INIT',
  track
});

export const setTracks = (tracks) => ({
  type: 'setTracks',
  tracks
});
export const setCategories = (categories) => ({
  type: 'setCategories',
  categories
});


export const seekTrack = (time) => ({
  type: 'SEEK',
  time
});

export const nextTrack = () => ({
  type: 'NEXT',
});

export const prevTrack = () => ({
  type: 'PREV',
});

export const favTrack = (track) => ({
  type: 'FAV',
  track
});

export const logout = () => ({
  type: 'LOGOUT'
});

export const loggedIn = (user) => ({
  type: 'LOGGED_IN',
  user
});

// Some state selectors

export const isPlayerOpen = (state) => state.ui.playerOpen;

// Get all tracks in database
export const getTracks = (state) => state.tracks;
export const getCategories = (state) => state.categories;

export const getCurrentTrackIndex = (state) => state.playing.index;

export const getNewTracks = (state) => 
  state.music.tracks.filter(t => state.music.newTracks.find(nt => nt === t.id));
export const getHotTracks = (state) => 
  state.music.tracks.filter(t => state.music.hotTracks.find(nt => nt === t.id));

export const getFavTracks = (state) => state.user.favTracks;
export const getRecentTracks = (state) => state.user.recentTracks;
export const isFavTrack = (state, track) => !!state.user.favTracks.find(t => t.id === track.id);

export const getPlaying = (state) => state.playing;
export const getIsPlaying = (state) => !state.playing.paused;

// export const getCurrentTrack = (state, index) => state.music.tracks[state.playing ? state.playing.index : -1];
export const getTrackCurrent = (state) => state.track;
export const getCurrentTrack = (state) => state.track;


export const getTrack = (state, id) => state.music.tracks.find(t => t.id === id);
// const index = getTrackIndex(state, action.track.url);
export const getTrackIndex = (state, url) => state.tracks.findIndex(t => t.url === url);
export const getUser = (state) => state.user;