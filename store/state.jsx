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
  const playing = !state.track.paused;
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
        track: {
          ...state.track,
          paused: true,
        }
      }
    }
    case 'playTrack': {
      return {
        ...state,
        track: {
          ...state.track,
          paused: false,
        }
      }
    }
    case 'setTracks': {
      return {
        ...state,
        tracks: action.tracks
      }
    }
    case 'setTodayTracks': {
      return {
        ...state,
        todayTracks: action.todayTracks
      }
    }
    case 'setProgramTracks': {
      return {
        ...state,
        programTracks: action.programTracks
      }
    }

    case 'setCategories': {
      return {
        ...state,
        categories: action.categories
      }
    }

    case 'initTrack': {
      return {
        ...state,
        track: {
          ...action.track,
          paused: true,
          isloaded: false,
          duration: 1,
          index: 0,
          progress: 0
        }
      }
    }
    case 'switchATrack': {
      console.log('switchATrack', action)
      return {
        ...state,
        track: {
          ...action.track,
          paused: false,
          isloaded: false,
          duration: 1,
          index: action.index,
          progress: 0,
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
        track: {
          ...state.track,
          paused: false,
        }
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
        track: {
          ...state.track,
          progress: action.time,
        },
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
  // playing: {
  //   index: 0,
  //   progress: 0,
  //   paused: true,
  // },
  track: {
    isloaded: false,
    duration: 1,
    index: 0,
    progress: 0,
    paused: true,

    link: "https://txly2.net/ly/audio/2022/hp/hp220316.mp3",
    id:  76970,
    description: "罪得赦免（利17:10-16）",
    alias: "mw220323",
    program_id:  28,
    program_name:  "旷野吗哪",
    code:  "mw",
    play_at: "220323",
    path:  "/ly/audio/2022/mw/mw220323.mp3",
    
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
  tracks: [],  //上一曲 下一曲
  todayTracks: [],
  programTracks: [],
  currentProgram: {},
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
  type: 'playTrack',
});

export const setDuration = (duration) => ({
  type: 'setDuration',
  duration
});

export const setOnPlay = () => ({
  type: 'onPlay',
});


export const switchATrack = (track, index) => ({
  type: 'switchATrack',
  track,
  index
});

export const initTrack = (track) => ({
  type: 'initTrack',
  track
});

export const setTracks = (tracks) => ({
  type: 'setTracks',
  tracks
});

export const setTodayTracks = (todayTracks) => ({
  type: 'setTodayTracks',
  todayTracks
});



export const setProgramTracks = (programTracks) => ({
  type: 'setProgramTracks',
  programTracks
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

export const getNewTracks = (state) => 
  state.music.tracks.filter(t => state.music.newTracks.find(nt => nt === t.id));
export const getHotTracks = (state) => 
  state.music.tracks.filter(t => state.music.hotTracks.find(nt => nt === t.id));

export const getFavTracks = (state) => state.user.favTracks;
export const getRecentTracks = (state) => state.user.recentTracks;
export const isFavTrack = (state, track) => !!state.user.favTracks.find(t => t.id === track.id);


export const getTrackIsPlaying = (state) => !state.track.paused;

export const getTrackCurrent = (state) => state.track;
export const getCurrentTrack = (state) => state.track;


export const getTrack = (state, id) => state.music.tracks.find(t => t.id === id);
// const index = getTrackIndex(state, action.track.url);
export const getTrackIndex = (state, url) => state.tracks.findIndex(t => t.url === url);
export const getUser = (state) => state.user;