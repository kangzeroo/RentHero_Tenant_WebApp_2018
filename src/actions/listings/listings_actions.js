import {
  SAVE_LISTINGS_TO_REDUX,
  NEXT_LISTING,
  SAVE_PREFS,
  INCREMENT_LIKES,
  DECREMENT_LIKES,
  CHANGE_COMMUTE_MODE,
  CHANGE_CARD_SECTION_SHOWN,
  SET_CURRENT_LISTING,
  SET_CURRENT_LISTINGS_STACK,
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

export const setCurrentListingsStack = (urlRedirect, listings) => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: SET_CURRENT_LISTINGS_STACK,
      payload: {
        urlRedirect: urlRedirect,
        stack: listings
      },
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

export const incrementLikes = (judgement, listing) => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: INCREMENT_LIKES,
      payload: {
        judgement,
        REFERENCE_ID: listing.REFERENCE_ID,
        ADDRESS: listing.ADDRESS,
        BEDS: listing.BEDS,
        BATHS: listing.BATHS,
        DATE_POSTED_UNIX: listing.DATE_POSTED_UNIX,
        PRICE: listing.PRICE,
        THUMBNAIL: listing.IMAGES[0] || 'https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/rSpYilaDliykdxju6/videoblocks-smoke-in-corner-of-black-screen-perfect-for-smoke-detector-advert-recorded-against-a-black-background-and-intended-as-a-stand-alone-shot-or-for-compositing-with-graphics-or-using-a-blending-mode-looping-clip_bgvjbtv9e_thumbnail-full01.png'
      }
    })
  }
}

export const decrementLikes = (judgement, listing) => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: DECREMENT_LIKES,
      payload: {
        judgement,
        REFERENCE_ID: listing.REFERENCE_ID,
        ADDRESS: listing.ADDRESS,
        BEDS: listing.BEDS,
        BATHS: listing.BATHS,
        DATE_POSTED_UNIX: listing.DATE_POSTED_UNIX,
        PRICE: listing.PRICE,
      }
    })
  }
}
