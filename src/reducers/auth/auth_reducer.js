import {
  AUTHENTICATED_STAFF,
  AUTHENTICATION_LOADED,
  UNAUTHENTICATED_STAFF,
  SAVE_STAFF_PROFILE,
  SAVE_CORPORATION_PROFILE,
  LOCATION_FORWARDING,
  REMOVE_STAFF_PROFILE,
} from '../../actions/action_types'

const INITIAL_STATE = {
  corporation_profile: {
		// corporation_id: '99cc0669-f407-4470-bb26-5e43742e3758',
		// corp_name: 'Jake Malliaros',
    // email: 'info@studenthousing.ca',
    // thumbnail: 'https://imgur.com/348djld',
	},
	staff_profile: {
    // corporation_id: null,
    // created_at: '2017-07-11T02:54:03.142Z',
    // email: 'kangze.web.lance@gmail.com',
    // name: 'Khan Huang',
    // phone: '24859357437',
    // staff_id: '5d7b0bd0-4ce1-4c9b-b860-02cf79667952',
    // thumbnail: 'https://imgur.com/348djld',
	},
  authenticated: false,
  authentication_loaded: false,
  location_forwarding: '',    // forwarding location after sign in
  // browser_fingerprint: '',    // unique identifier for web browser
  // s3_corporation: '',
  // staffs: [],
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTHENTICATED_STAFF:
      return {
        ...state,
        authenticated: action.payload ? true : false,
      }
    case AUTHENTICATION_LOADED:
      return {
        ...state,
        authentication_loaded: true,
      }
    case UNAUTHENTICATED_STAFF:
      return {
        ...state,
        staff_profile: {},
        authenticated: false,
      }
    case SAVE_STAFF_PROFILE:
      localStorage.setItem('staff_id', action.payload.staff_id)
      return {
        ...state,
        staff_profile: action.payload,
      }
    case SAVE_CORPORATION_PROFILE:
      return {
        ...state,
        corporation_profile: action.payload,
      }
    case LOCATION_FORWARDING:
      return {
        ...state,
        location_forwarding: action.payload,
      }
    case REMOVE_STAFF_PROFILE:
      localStorage.removeItem('user_id')
      return {
        ...state,
        staff_profile: {},
        corporation_profile: {},
      }
    default:
      return {
        ...state,
      }
  }
}
