import moment from 'moment'
import axios from 'axios'


const myPrefs = {
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
  posted_in_last_x_days: 5,
  include_missing_matched: true
}

export const getListings = () => {
	const p = new Promise((res, rej) => {
		axios.post('https://1w7f6p6d9c.execute-api.us-east-1.amazonaws.com/production/get-listings', myPrefs)
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
