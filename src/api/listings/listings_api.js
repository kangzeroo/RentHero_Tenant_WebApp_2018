import moment from 'moment'
import axios from 'axios'
const GET_LISTINGS_ENDPOINT = require('../API_URLS').GET_LISTINGS_ENDPOINT
const GET_LISTING_BY_REF_ENDPOINT = require('../API_URLS').GET_LISTING_BY_REF_ENDPOINT
const GET_LISTING_BY_REFS_ENDPOINT = require('../API_URLS').GET_LISTING_BY_REFS_ENDPOINT

export const getListings = (prefs) => {
	const p = new Promise((res, rej) => {
		axios.post(GET_LISTINGS_ENDPOINT, prefs)
			.then((data) => {
				console.log(data)
				res(data.data.data)
			})
			.catch((err) => {
				console.log(err)
				rej(err)
			})
	})
	return p
}

export const getCurrentListingByReference = ({ ref_id, short_id }) => {
  const p = new Promise((res, rej) => {
    // axios.post(GET_LISTING_BY_REF_ENDPOINT, { ref_id, short_id })
    //   .then((data) => {
    //     console.log(data.data)
    //     res(data.data.data)
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //     rej(err)
    //   })
		axios.post(GET_LISTING_BY_REFS_ENDPOINT, { ref_ids: [ref_id] })
      .then((data) => {
        console.log(data.data)
        res(data.data.data[0])
      })
      .catch((err) => {
        console.log(err)
        rej(err)
      })
  })
  return p
}

export const getAdsByRefs = (ref_ids) => {
  const p = new Promise((res, rej) => {
    axios.post(GET_LISTING_BY_REFS_ENDPOINT, { ref_ids: ref_ids })
      .then((data) => {
        res(data.data.data)
      })
      .catch((err) => {
        console.log(err)
        rej(err)
      })
  })
  return p
}
