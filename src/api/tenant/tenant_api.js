import axios from 'axios'
import { ACCOUNTS_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'

export const addToFavoritesToSQL = ({ tenant_id, property_id, meta, }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ACCOUNTS_MICROSERVICE}/insert_tenant_favorite`, { tenant_id, property_id, meta,  }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

export const getFavoritesForTenant = (tenant_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ACCOUNTS_MICROSERVICE}/get_favorites_for_tenant`, { tenant_id, }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}
