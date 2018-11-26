import {
  INCREMENT_LIKES,
  DECREMENT_LIKES,
  SAVE_PREFS,
  CHANGE_COMMUTE_MODE,
  CHANGE_CARD_SECTION_SHOWN,
} from '../../actions/action_types'

const INITIAL_STATE = {
  likes: [],
  dislikes: [],
  card_section_shown: 'commute',
  prefs: {
    max_beds: 2,
    max_budget: 3000,
    destination: {
      address: "763 Bay St, Toronto, ON M5G 2R3, Canada",
      place_id: "ChIJC9nc5rU0K4gRgyoVQ0e7q8c",
      commute_mode: 'transit',
      gps: { lat: 43.6601025, lng: -79.3850843 }
    }
  }
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INCREMENT_LIKES:
      return {
        ...state,
        [action.payload.judgement]: state[action.payload.judgement].concat(action.payload.id)
      }
    case DECREMENT_LIKES:
      return {
        ...state,
        [action.payload.judgement]: state[action.payload.judgement].filter(id => id !== action.payload.id)
      }
    case SAVE_PREFS:
      return {
        ...state,
        prefs: action.payload,
      }
    case CHANGE_COMMUTE_MODE:
      return {
        ...state,
        prefs: {
          ...state.prefs,
          destination: {
            ...state.prefs.destination,
            commute_mode: action.payload
          }
        }
      }
    case CHANGE_CARD_SECTION_SHOWN:
      return  {
        ...state,
        card_section_shown: action.payload
      }
    default:
      return {
        ...state,
      }
  }
}
