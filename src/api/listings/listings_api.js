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

export const calcDistance = (lat1, lon1, lat2, lon2, unit) => {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var radlon1 = Math.PI * lon1/180
    var radlon2 = Math.PI * lon2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
}
