import {
  SAVE_LISTINGS_TO_REDUX,
  NEXT_LISTING,
  SAVE_PREFS,
  INCREMENT_LIKES,
  DECREMENT_LIKES,
} from '../action_types'

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
