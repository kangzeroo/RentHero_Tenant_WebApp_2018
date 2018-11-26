import {
  CHANGE_LANGUAGE,
  CHANGE_TAB,
  LOADING_COMPLETE,
  TOGGLE_DRAWER_NAV,
} from '../../actions/action_types'

const INITIAL_STATE = {
  selected_language: 'en',
  selected_tab: 'home',
  loading_complete: false,
  drawer_nav_open: false,
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
    case TOGGLE_DRAWER_NAV:
      return {
        ...state,
        drawer_nav_open: action.payload
      }
		default:
			return {
				...state
			}
	}
}
