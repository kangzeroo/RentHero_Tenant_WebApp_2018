import {
  SAVE_LISTINGS_TO_REDUX,
  NEXT_LISTING,
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
