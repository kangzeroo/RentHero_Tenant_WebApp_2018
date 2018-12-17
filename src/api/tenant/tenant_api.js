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

export const registerTenantPhone = ({ tenant_id, phone_number, national_format, country_code, email, }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ACCOUNTS_MICROSERVICE}/register_tenant_phone`, { tenant_id, phone_number, national_format, country_code, email, }, authHeaders())
      .then((data) => {
        res(data.data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

export const registerTenantEmail = ({ tenant_id, email, }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ACCOUNTS_MICROSERVICE}/register_tenant_email`, { tenant_id, email, }, authHeaders())
      .then((data) => {
        res(data.data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

export const updateTenantName = ({ tenant_id, first_name, authenticated, }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ACCOUNTS_MICROSERVICE}/update_tenant_name`, { tenant_id, first_name, authenticated, }, authHeaders())
      .then((data) => {
        res(data.data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}
