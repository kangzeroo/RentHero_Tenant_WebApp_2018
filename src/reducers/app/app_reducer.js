import {
  CHANGE_LANGUAGE,
  CHANGE_TAB,
  LOADING_COMPLETE,
} from '../../actions/action_types'

const INITIAL_STATE = {
  selected_language: 'en',
  selected_tab: 'home',
  loading_complete: false,
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case CHANGE_LANGUAGE:
      return {
        ...state,
        selected_language: action.payload,
      }
    case CHANGE_TAB:
      return {
        ...state,
        selected_tab: action.payload,
      }
    case LOADING_COMPLETE:
      return {
        ...state,
        loading_complete: true,
      }
		default:
			return {
				...state
			}
	}
}
