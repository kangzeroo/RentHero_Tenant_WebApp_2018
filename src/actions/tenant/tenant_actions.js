import {
  SAVE_TENANT_FAVORITES,
  SET_TENANT_ID,
} from '../action_types'

export const saveTenantFavoritesToRedux = (tenant_favorites) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_TENANT_FAVORITES,
      payload: tenant_favorites,
    })
  }
}

export const setTenantID = (tenant_id) => {
  return (dispatch) => {
    dispatch({
      type: SET_TENANT_ID,
      payload: tenant_id
    })
  }
}
