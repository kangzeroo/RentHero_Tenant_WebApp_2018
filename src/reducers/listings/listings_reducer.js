import {
  SAVE_LISTINGS_TO_REDUX,
} from '../../actions/action_types'

const INITIAL_STATE = {
  listings: [],
  current_listing: null
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case SAVE_LISTINGS_TO_REDUX:
      return {
        ...state,
        listings: action.payload,
        current_listing: action.payload[0]
      }
		default:
			return {
				...state
			}
	}
}
