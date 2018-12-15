import axios from 'axios'
import { ACCOUNTS_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'

export const verifyPhone = (phone) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ACCOUNTS_MICROSERVICE}/verify_phone`, { phone }, authHeaders())
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
