import {
  AUTHENTICATED_STAFF,
  AUTHENTICATION_LOADED,
  UNAUTHENTICATED_STAFF,
  SAVE_STAFF_PROFILE,
  SAVE_CORPORATION_PROFILE,
  LOCATION_FORWARDING,
  REMOVE_STAFF_PROFILE,
} from '../action_types'

// authenticate the staff member's account
export const authenticateStaff = (staffProfile) => {
  return (dispatch) => {
    dispatch({
      type: AUTHENTICATED_STAFF,
      payload: staffProfile,
    })
  }
}

// authentication loaded, this will be called when the staff profile has been loaded either successfully or unsuccessfully
export const authenticationLoaded = () => {
  return (dispatch) => {
    dispatch({
      type: AUTHENTICATION_LOADED,
      payload: true,
    })
  }
}

// unauthenticate the staff members' account
export const unauthenticateStaff = () => {
  return (dispatch) => {
    dispatch({
      type: UNAUTHENTICATED_STAFF
    })
  }
}


// save staff profile to redux
export const saveStaffProfileToRedux = (staffProfile) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_STAFF_PROFILE,
      payload: staffProfile,
    })
  }
}

// save corporation profile to redux
export const saveCorporationProfileToRedux = (corpProfile) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_CORPORATION_PROFILE,
      payload: corpProfile,
    })
  }
}

export const forwardUrlLocation = (url) => {
  return (dispatch) => {
    dispatch({
      type: LOCATION_FORWARDING,
      payload: url,
    })
  }
}

// remove the staff members' profile
export const removeStaffProfile = () => {
	return (dispatch) => {
    localStorage.removeItem('cognito_staff_token')
		dispatch({
			type: REMOVE_STAFF_PROFILE,
		})
	}
}
