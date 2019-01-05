import {
  SAVE_LISTINGS_TO_REDUX,
  PREV_LISTING,
  NEXT_LISTING,
  SET_CURRENT_LISTING,
  SET_CURRENT_LISTINGS_STACK,
  INCREMENT_LIKES,
  SORT_LISTINGS_BY,
  SELECT_CITY,
} from '../../actions/action_types'
import { calcDistance } from '../../api/listings/listings_api'

const INITIAL_STATE = {
  empty_listings_stack_redirect: '',
  current_listings_stack: [],
  all_listings: [],
  current_listing: null,
  sorted_by: '',
  chosen_city: 'Waterloo, Canada',
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case SAVE_LISTINGS_TO_REDUX:
      return {
        ...state,
        current_listings_stack: action.payload,
        all_listings: action.payload,
        // current_listing: state.current_listing ? state.current_listing : action.payload[0]
      }
    case SET_CURRENT_LISTING:
      return {
        ...state,
        current_listing: action.payload,
      }
    case SET_CURRENT_LISTINGS_STACK:
      return {
        ...state,
        current_listings_stack: action.payload.stack,
        current_listing: action.payload.stack[0],
        empty_listings_stack_redirect: action.payload.urlRedirect,
      }
    case SORT_LISTINGS_BY:
      let sorted_stack = state.current_listings_stack
      if (action.payload.title === 'Most Recent') {
        sorted_stack = state.current_listings_stack.sort((a,b) => {
          return b.SCRAPED_AT_UNIX - a.SCRAPED_AT_UNIX
        })
      } else if (action.payload.title === 'Closest Distance') {
        sorted_stack = state.current_listings_stack.sort((a,b) => {
          return calcDistance(a.GPS.lat, a.GPS.lng, action.payload.destination.lat, action.payload.destination.lng, 'K') - calcDistance()
        })
      }
      return {
        ...state,
        sorted_by: action.payload.title,
        current_listings_stack: sorted_stack,
      }
    case NEXT_LISTING:
      let nextListingIndex = 0
      state.current_listings_stack.forEach((listing, index) => {
        if (listing.REFERENCE_ID === state.current_listing.REFERENCE_ID) {
          if (index + 1 <= state.current_listings_stack.length - 1) {
            nextListingIndex = index + 1
          } else {
            nextListingIndex = 0
          }
        }
      })
      console.log(nextListingIndex)
      return {
        ...state,
        current_listing: state.current_listings_stack[nextListingIndex]
      }
    case PREV_LISTING:
      let prevListingIndex = 0
      state.current_listings_stack.forEach((listing, index) => {
        if (state.current_listing && listing.REFERENCE_ID === state.current_listing.REFERENCE_ID) {
          if (index - 1 >= 0) {
            prevListingIndex = index - 1
          } else {
            prevListingIndex = 0
          }
        }
      })
      console.log(prevListingIndex)
      return {
        ...state,
        current_listing: state.current_listings_stack[prevListingIndex]
      }
    case SELECT_CITY:
      return {
        ...state,
        chosen_city: action.payload
      }
		default:
			return {
				...state
			}
	}
}
