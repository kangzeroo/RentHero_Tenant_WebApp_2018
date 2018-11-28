import {
  SAVE_LISTINGS_TO_REDUX,
  NEXT_LISTING,
  SET_CURRENT_LISTING,
} from '../../actions/action_types'

const INITIAL_STATE = {
  listings: [],
  current_listing: null,
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case SAVE_LISTINGS_TO_REDUX:
      console.log(action.payload)
      return {
        ...state,
        listings: action.payload,
        current_listing: action.payload[0]
      }
    case SET_CURRENT_LISTING:
      return {
        ...state,
        current_listing: action.payload,
      }
    case NEXT_LISTING:
      let nextListingIndex = 0
      state.listings.forEach((listing, index) => {
        if (listing.listing.ITEM_ID === state.current_listing.listing.ITEM_ID) {
          if (index + 1 <= state.listings.length - 1) {
            nextListingIndex = index + 1
          } else {
            nextListingIndex = 0
          }
        }
      })
      console.log(nextListingIndex)
      return {
        ...state,
        current_listing: state.listings[nextListingIndex]
      }
		default:
			return {
				...state
			}
	}
}
