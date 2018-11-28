import {
  SAVE_LISTINGS_TO_REDUX,
  NEXT_LISTING,
  SAVE_PREFS,
  INCREMENT_LIKES,
  DECREMENT_LIKES,
  CHANGE_COMMUTE_MODE,
  CHANGE_CARD_SECTION_SHOWN,
  SET_CURRENT_LISTING,
  SET_NAME,
  LOAD_LOCAL_STORAGE_ACCOUNT,
  RESTART_SEARCH,
} from '../action_types'


export const loadLocalStorageAccount = () => {
  return (dispatch) => {
    dispatch({
      type: LOAD_LOCAL_STORAGE_ACCOUNT
    })
  }
}

export const restartSearch = () => {
  return (dispatch) => {
    dispatch({
      type: RESTART_SEARCH
    })
  }
}

// names
export const saveNameToRedux = (name) => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: SET_NAME,
      payload: name,
    })
  }
}

// change the language of the app
export const saveListingsToRedux = (listings) => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: SAVE_LISTINGS_TO_REDUX,
      payload: listings,
    })
  }
}

export const setCurrentListing = (current_listing) => {
  return (dispatch) => {
    dispatch({
      type: SET_CURRENT_LISTING,
      payload: current_listing
    })
  }
}

export const nextListing = () => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: NEXT_LISTING
    })
  }
}

export const savePrefs = (prefs) => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: SAVE_PREFS,
      payload: prefs
    })
  }
}

export const changeCommuteMode = (mode) => {
  return (dispatch) => {
    dispatch({
      type: CHANGE_COMMUTE_MODE,
      payload: mode
    })
  }
}

export const changeShownSectionCards = (section) => {
  return (dispatch) => {
    dispatch({
      type: CHANGE_CARD_SECTION_SHOWN,
      payload: section
    })
  }
}

export const incrementLikes = (judgement, id) => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: INCREMENT_LIKES,
      payload: {
        judgement,
        id,
      }
    })
  }
}

export const decrementLikes = (judgement, id) => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: DECREMENT_LIKES,
      payload: {
        judgement,
        id,
      }
    })
  }
}
