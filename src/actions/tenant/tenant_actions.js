import {
  SAVE_TENANT_FAVORITES,
} from '../action_types'

export const saveTenantFavoritesToRedux = (tenant_favorites) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_TENANT_FAVORITES,
      payload: tenant_favorites,
    })
  }
}
