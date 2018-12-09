import {
  UPDATE_PREFERENCES,
} from '../action_types'

// update preferences
export const updatePreferences = (PREF_OBJECT) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_PREFERENCES,
      payload: PREF_OBJECT,
    })
  }
}
