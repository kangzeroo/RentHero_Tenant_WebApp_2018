import {
  SET_MAIN_MAP,
  SET_CURRENT_MAP_LOCATION,
  SET_MAP_LOADED,
  SET_FLAG_PIN_LOCATION,
  SAVE_NEARBY_LOCATIONS,
  SET_CURRENT_CLICKED_LOCATION,
  SET_MAP_LISTINGS,
} from '../../actions/action_types'

const INITIAL_STATE = {
  main_map: {},

  current_location: {},

  map_loaded: false,

  flag_location: {},

  nearby_locations: {},

  current_clicked_location: {},

  listings: [],
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_MAIN_MAP:
      return {
        ...state,
        main_map: action.payload,
      }
    case SET_CURRENT_MAP_LOCATION:
      return {
        ...state,
        current_location: action.payload,
      }
    case SET_MAP_LOADED:
      return {
        ...state,
        map_loaded: action.payload,
      }
    case SET_FLAG_PIN_LOCATION:
      return {
        ...state,
        flag_location: action.payload,
      }
    case SAVE_NEARBY_LOCATIONS:
      return {
        ...state,
        nearby_locations: action.payload,
      }
    case SET_CURRENT_CLICKED_LOCATION:
      return {
        ...state,
        current_clicked_location: action.payload,
      }
    case SET_MAP_LISTINGS:
      return {
        ...state,
        listings: action.payload,
      }
    default:
      return {
        ...state,
      }
  }
}
