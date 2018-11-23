import {
  SAVE_LISTINGS_TO_REDUX,
  NEXT_LISTING,
  SAVE_PREFS,
} from '../../actions/action_types'

const INITIAL_STATE = {
  listings: [],
  current_listing: null,
  prefs: {
    max_beds: 2,
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
	switch (action.type) {
    case SAVE_LISTINGS_TO_REDUX:
      return {
        ...state,
        listings: action.payload,
        current_listing: action.payload[0]
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
    case SAVE_PREFS:
      return {
        ...state,
        prefs: action.payload,
      }
		default:
			return {
				...state
			}
	}
}
