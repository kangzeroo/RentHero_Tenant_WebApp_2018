import {
  SET_MAIN_MAP,
  SET_CURRENT_MAP_LOCATION,
  SET_MAP_LOADED,
  SET_FLAG_PIN_LOCATION,
  SAVE_NEARBY_LOCATIONS,
  SET_CURRENT_CLICKED_LOCATION,
  SET_MAP_LISTINGS,
} from '../action_types'
import {
  FLAG_PIN,
} from '../../assets/map_pins'

export const setMainMapToRedux = (map) => {
  return (dispatch) => {
    dispatch({
      type: SET_MAIN_MAP,
      payload: map,
    })
  }
}

export const setCurrentMapLocationToRedux = (current_location) => {
  return (dispatch) => {
    dispatch({
      type: SET_CURRENT_MAP_LOCATION,
      payload: current_location
    })
  }
}

export const setMapLoadedToRedux = (bool) => {
  return (dispatch) => {
    dispatch({
      type: SET_MAP_LOADED,
      payload: bool,
    })
  }
}

export const setCurrentFlagPin = (current_location) => {
  const coords = current_location.coords
  const map = current_location.map

  let flagPin = new google.maps.Marker({
      position: new google.maps.LatLng(coords.lat, coords.lng),
      pin_type: 'destination',
      icon: FLAG_PIN,
      zIndex: 55,
      pin_id: 'flag',
  })

  flagPin.addListener('click', (event) => {

  })

  flagPin.setMap(map)

  return (dispatch) => {
    dispatch({
      type: SET_FLAG_PIN_LOCATION,
      payload: coords,
    })
  }
}

export const saveNearbyLocationsToRedux = (nearbys) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_NEARBY_LOCATIONS,
      payload: nearbys,
    })
  }
}

// setCurrentClickedLocation
// ACTIONS: add / remove ! IMPORTANT
export const setCurrentClickedLocation = (action, item, locations) => {
  let clicked
  if (action === 'add') {
    locations.forEach((loc) => {
      if (loc.id === item.id) {
        loc.marker.setAnimation(google.maps.Animation.BOUNCE)
        clicked = loc
      } else {
        loc.marker.setAnimation(null)
      }
    })
  } else if (action === 'remove') {
    locations.forEach((loc) => {
        loc.marker.setAnimation(null)
    })
    clicked = {}
  }

  return (dispatch) => {
    dispatch({
      type: SET_CURRENT_CLICKED_LOCATION,
      payload: clicked,
    })
  }
}

export const saveMapListingsToRedux = (listings) => {
  return (dispatch) => {
    dispatch({
      type: SET_MAP_LISTINGS,
      payload: listings,
    })
  }
}
