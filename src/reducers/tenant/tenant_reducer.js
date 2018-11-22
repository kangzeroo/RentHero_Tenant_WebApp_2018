import {
  INCREMENT_LIKES,
  INCREMENT_DISLIKES,
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
        likes: state.likes.concat(action.payload)
      }
    case INCREMENT_DISLIKES:
      return {
        ...state,
        dislikes: state.likes.concat(action.payload)
      }
    default:
      return {
        ...state,
      }
  }
}
