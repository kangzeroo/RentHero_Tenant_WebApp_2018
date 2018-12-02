import axios from 'axios'
import authHeaders from '../authHeaders'
import { GET_HEATMAP_ENDPOINT } from '../API_URLS'

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

export const getHeatMapDist = (prefs) => {
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
		axios.post(GET_HEATMAP_ENDPOINT, myPrefs)
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

export const calculateGeoDistance = (pointA, pointB, unit) => {
  const lat1 = pointA.lat
  const lon1 = pointA.lng
  const lat2 = pointB.lat
  const lon2 = pointB.lng

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
  if (unit.toLowerCase()=="m") { dist = dist * 1.609344 * 1000 }
  if (unit.toLowerCase()=="km") { dist = dist * 1.609344 }
  if (unit.toLowerCase()=="n") { dist = dist * 0.8684 }
  return dist
}

export const calculateNearbyStats = (point, ads, radius = 1000) => {
  /*
      point = {
        lat: 43.5637446,
        lng: -79.3432654
      }
      ads = [
        { REFERENCE_ID, PRICE: 2100, BEDS: 1.5, GPS: { lat: 43.5476566, lng: -79.5634654 } }
      ]
  */
  const x = ads.map((ad) => {
    return {
      ...ad,
      distance: calculateGeoDistance(point, {
                  lat: parseFloat(ad.GPS.lat),
                  lng: parseFloat(ad.GPS.lng)
                }, 'm')
    }
  }).sort((a, b) => {
    return a.distance - b.distance
  }).filter((a) => {
    return a.distance <= radius
  })
  console.log(x)
  const avg_price_per_bed = (x.reduce((acc, curr) => {
    return acc + curr.PRICE
  }, 0) / x.reduce((acc, curr) => {
    return acc + curr.BEDS
  }, 0)).toFixed(0)
  console.log(`avg_price_per_bed: ${avg_price_per_bed}`)
  return {
    avg_price_per_bed: avg_price_per_bed,
    nearby_count: x.length
  }
}
