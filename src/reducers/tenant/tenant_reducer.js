import {
  INCREMENT_LIKES,
  DECREMENT_LIKES,
  CHANGE_COMMUTE_MODE,
  CHANGE_CARD_SECTION_SHOWN,
  LOAD_LOCAL_STORAGE_ACCOUNT,
  SAVE_TENANT_FAVORITES,
} from '../../actions/action_types'

const INITIAL_STATE = {
  tenant_id: 'aaa-888-zzz',
  name: '',
  likes: [],
  dislikes: [],
  card_section_shown: 'commute',
  commute_mode: 'transit',
  favorites: [],
}

export default (state = INITIAL_STATE, action) => {
  let new_state = state
  switch (action.type) {
    case INCREMENT_LIKES:
      return {
        ...state,
        [action.payload.judgement]: state[action.payload.judgement].filter(summ => summ.REFERENCE_ID !== action.payload.REFERENCE_ID).concat(action.payload)
      }
    case DECREMENT_LIKES:
      return {
        ...state,
        [action.payload.judgement]: state[action.payload.judgement].filter(summ => summ.REFERENCE_ID !== action.payload.REFERENCE_ID)
      }
    case CHANGE_COMMUTE_MODE:
      return {
        ...state,
        commute_mode: action.payload,
      }
    case CHANGE_CARD_SECTION_SHOWN:
      return {
        ...state,
        card_section_shown: action.payload
      }
    case SAVE_TENANT_FAVORITES:
      return {
        ...state,
        favorites: action.payload,
      }
    default:
      return {
        ...state,
      }
  }
}
