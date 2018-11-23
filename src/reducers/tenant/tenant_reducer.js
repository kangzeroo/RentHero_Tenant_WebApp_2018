import {
  INCREMENT_LIKES,
  DECREMENT_LIKES,
} from '../../actions/action_types'

const INITIAL_STATE = {
  likes: [],
  dislikes: []
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
    default:
      return {
        ...state,
      }
  }
}
