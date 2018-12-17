import {
  AUTHENTICATED_STAFF,
  AUTHENTICATION_LOADED,
  UNAUTHENTICATED_TENANT,
  SAVE_STAFF_PROFILE,
  SAVE_CORPORATION_PROFILE,
  LOCATION_FORWARDING,
  REMOVE_TENANT_PROFILE,
  SAVE_TENANT_PROFILE,
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

export const unauthenticateTenant = () => {
  return (dispatch) => {
    dispatch({
      type: UNAUTHENTICATED_TENANT
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

export const removeTenantProfile = () => {
	return (dispatch) => {
		dispatch({
			type: REMOVE_TENANT_PROFILE,
		})
	}
}

export const saveTenantProfileToRedux = (tenant) => {
	return (dispatch) => {
		dispatch({
			type: SAVE_TENANT_PROFILE,
      payload: tenant,
		})
	}
}
