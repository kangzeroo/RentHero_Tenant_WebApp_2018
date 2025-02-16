import { combineReducers } from 'redux'
import appReducer from './app/app_reducer'
import authReducer from './auth/auth_reducer'
import listingsReducer from './listings/listings_reducer'
import tenantReducer from './tenant/tenant_reducer'
import prefsReducer from './prefs/prefs_reducer'
import mapReducer from './map/map_reducer'

// takes all your seperate reducers into one giant reducer
// each Redux action will flow through each middleware and then reach the reducers
// then it will go through each reducer
const rootReducer = combineReducers({
	app: appReducer,
	auth: authReducer,
	listings: listingsReducer,
	tenant: tenantReducer,
	prefs: prefsReducer,
	map: mapReducer,
})

export default rootReducer
