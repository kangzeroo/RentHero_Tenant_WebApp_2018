import axios from 'axios'
import authHeaders from '../authHeaders'
import { GET_HEATMAP_ENDPOINT } from '../API_URLS'


export const getHeatMapDist = (prefs) => {
  console.log(prefs)
	const p = new Promise((res, rej) => {
		axios.post(GET_HEATMAP_ENDPOINT, prefs)
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
    matches: x,
  }
}
