import {
  CHANGE_LANGUAGE,
  CHANGE_TAB,
  LOADING_COMPLETE,
  TOGGLE_DRAWER_NAV,
  TOGGLE_INSTANT_CHARS,
  TOGGLE_IS_MOBILE,
} from '../action_types'

// change the language of the app
export const changeAppLanguage = (languageCode) => {
  // dispatch lets you send actions to Redux
  localStorage.setItem('rentburrow_lang', languageCode)
  return (dispatch) => {
    dispatch({
      type: CHANGE_LANGUAGE,
      payload: languageCode,
    })
  }
}

export const toggleInstantCharsSegmentID = (id) => {
  return (dispatch) => {
    dispatch({
      type: TOGGLE_INSTANT_CHARS,
      payload: id,
    })
  }
}


export const changeSelectedTab = (tab) => {
  return (dispatch) => {
    dispatch({
      type: CHANGE_TAB,
      payload: tab,
    })
  }
}

export const saveLoadingCompleteToRedux = () => {
  return (dispatch) => {
    dispatch({
      type: LOADING_COMPLETE,
      payload: true,
    })
  }
}


export const triggerDrawerNav = (bool) => {
  return (dispatch) => {
    dispatch({
      type: TOGGLE_DRAWER_NAV,
      payload: bool,
    })
  }
}

export const isMobileRedux = (bool) => {
  return (dispatch) => {
    dispatch({
      type: TOGGLE_IS_MOBILE,
      payload: bool,
    })
  }
}
