import { GET_TENANT_PROFILE, UPDATE_TENANT_PROFILE } from '../API_URLS'
import axios from 'axios'

export const savePreferences = (PREF_OBJECT) => {
  console.log(PREF_OBJECT)
  const p = new Promise((res, rej) => {
    axios.post(UPDATE_TENANT_PROFILE, PREF_OBJECT)
      .then((data) => {
        console.log(data.data)
        console.log(PREF_OBJECT.KEY)
        res(data.data[PREF_OBJECT.KEY])
      })
      .catch((err) => {
        console.log(err)
        rej(err)
      })
  })
  return p
}

export const getPreferences = (tenant_id) => {
  const p = new Promise((res, rej) => {
    axios.post(GET_TENANT_PROFILE, { TENANT_ID: tenant_id })
      .then((data) => {
        console.log(data.data)
        res(data.data)
      })
      .catch((err) => {
        console.log(err)
        rej(err)
      })
  })
  return p
}
