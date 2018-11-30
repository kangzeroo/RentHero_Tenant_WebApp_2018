import moment from 'moment'
import axios from 'axios'
const GET_LISTINGS_ENDPOINT = require('../API_URLS').GET_LISTINGS_ENDPOINT
const GET_LISTING_BY_REF_ENDPOINT = require('../API_URLS').GET_LISTING_BY_REF_ENDPOINT
const GET_LISTING_BY_REFS_ENDPOINT = require('../API_URLS').GET_LISTING_BY_REFS_ENDPOINT

let myPrefs = {
  rooms: {
    avail: {
      min: 1,
      ideal: 2,
      max: 2,
    },
    random_roommates: true,
    max_roommates: 3,
  },
  budget: {
    ideal_per_person: 800,
    max_per_person: 1100,
    flexible: true,
  },
  movein: {
    ideal_movein: 'ISOString',
    earliest_movein: "ISOString",
    latest_movein: "ISOString",
  },
  location: {
    ideal_neighbourhoods: ['Downtown', 'Annex'],
    flexible: true,
  },
  commute: [
    { destination_placeids: 'ChIJC9nc5rU0K4gRgyoVQ0e7q8c', transport: 'driving || public transit || walking', "avoids": ["tolls"], "arrival_time": 435356456 }
  ],
  nearby: ['nightlife', 'cafes', ''],
  property: {
    acceptable_types: ['condo', 'apartment', 'house', 'basement', 'den_or_shared'],
    min_sqft: 800,
    ensuite_bath: false,
    pets: false,
    style: ['family', 'young_professional', 'senior', 'student', 'immigrant', 'luxury'],
    amenities: ["gym", "balcony", "parking", "elevator", "pool", "security", "front_desk", "ensuite_laundry", "walkin_closet"],
    decor: ['chic', 'cozy', 'no_preference'],
    utilities: ['price_all_inclusive', 'available_maybe_inclusive']
  },
  personal: {
    guarantor_needed: true,
    cosigner_needed: true,
    allergies: '',
  },
  destinations: [
    { address: '123 Main St', place_id: 'abcdef', commute_mode: 'transit', gps: { lat: 46.7846426, lng: -68.4352647 } }
  ],
  posted_in_last_x_days: 10,
  include_missing_matched: true,
  radius: 20000
}

export const getListings = (prefs) => {
  console.log(prefs)
  myPrefs.rooms.avail.min = prefs.max_beds
  myPrefs.rooms.avail.ideal = prefs.max_beds
  myPrefs.rooms.avail.max = prefs.max_beds
  myPrefs.budget.ideal_per_person = prefs.max_budget
  myPrefs.budget.max_per_person = prefs.max_budget
  myPrefs.destinations = [prefs.destination]
  if (prefs.destination.commute_mode === 'driving') {
    myPrefs.radius = 30000
  } else if (prefs.destination.commute_mode === 'transit') {
    myPrefs.radius = 20000
  } else if (prefs.destination.commute_mode === 'bicycling') {
    myPrefs.radius = 20000
  } else if (prefs.destination.commute_mode === 'walking') {
    myPrefs.radius = 20000
  }
	const p = new Promise((res, rej) => {
		axios.post(GET_LISTINGS_ENDPOINT, myPrefs)
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

export const getCurrentListingByReference = (ref_id) => {
  const p = new Promise((res, rej) => {
    axios.post(GET_LISTING_BY_REF_ENDPOINT, { ref_id: ref_id })
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
