import {
  INCREMENT_LIKES,
  DECREMENT_LIKES,
  SAVE_PREFS,
  CHANGE_COMMUTE_MODE,
  CHANGE_CARD_SECTION_SHOWN,
  SET_NAME,
  LOAD_LOCAL_STORAGE_ACCOUNT,
  RESTART_SEARCH,
} from '../../actions/action_types'

const INITIAL_STATE = {
  tenant_id: 'aaa-888-zzz',
  name: '',
  likes: [],
  dislikes: [],
  card_section_shown: 'commute',
  prefs: {
    max_beds: 1,
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
  let new_state = state
  switch (action.type) {
    case LOAD_LOCAL_STORAGE_ACCOUNT:
      const acct_details = localStorage.getItem('acct_details')
      console.log(acct_details)
      if (acct_details) {
        return JSON.parse(acct_details)
      } else {
        return state
      }
    case RESTART_SEARCH:
      localStorage.setItem('acct_details', null)
      return {
        ...state,
        name: '',
        card_section_shown: 'commute',
        likes: [],
        dislikes: []
      }
    case SET_NAME:
      new_state = {
        ...state,
        name: action.payload
      }
      localStorage.setItem('acct_details', JSON.stringify(new_state))
      return new_state
    case INCREMENT_LIKES:
      new_state = {
        ...state,
        [action.payload.judgement]: state[action.payload.judgement].filter(summ => summ.REFERENCE_ID !== action.payload.REFERENCE_ID).concat(action.payload)
      }
      localStorage.setItem('acct_details', JSON.stringify(new_state))
      return new_state
    case DECREMENT_LIKES:
      new_state = {
        ...state,
        [action.payload.judgement]: state[action.payload.judgement].filter(summ => summ.REFERENCE_ID !== action.payload.REFERENCE_ID)
      }
      localStorage.setItem('acct_details', JSON.stringify(new_state))
      return new_state
    case SAVE_PREFS:
      new_state = {
        ...state,
        prefs: action.payload,
      }
      localStorage.setItem('acct_details', JSON.stringify(new_state))
      return new_state
    case CHANGE_COMMUTE_MODE:
      new_state = {
        ...state,
        prefs: {
          ...state.prefs,
          destination: {
            ...state.prefs.destination,
            commute_mode: action.payload
          }
        }
      }
      localStorage.setItem('acct_details', JSON.stringify(new_state))
      return new_state
    case CHANGE_CARD_SECTION_SHOWN:
      new_state = {
        ...state,
        card_section_shown: action.payload
      }
      localStorage.setItem('acct_details', JSON.stringify(new_state))
      return new_state
    default:
      return {
        ...state,
      }
  }
}
