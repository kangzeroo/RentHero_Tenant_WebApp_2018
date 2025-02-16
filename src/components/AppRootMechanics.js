// Higher Order Compt for initializing actions upon AppRoot load

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { retrieveTenantFromLocalStorage, unauthRoleTenant } from '../api/aws/aws-cognito'
import { dispatchActionsToRedux } from '../actions/system/system_actions'
import {
	saveStaffProfileToRedux,
	authenticateTenant,
	authenticationLoaded,
	forwardUrlLocation,
	saveCorporationProfileToRedux,
	saveTenantProfileToRedux,
} from '../actions/auth/auth_actions'
import { saveLoadingCompleteToRedux } from '../actions/app/app_actions'
import {
	saveListingsToRedux,
} from '../actions/listings/listings_actions'
import { updatePreferences } from '../actions/prefs/prefs_actions'
import {
	redirectPath,
	setLanguageFromLocale,
	checkIfPartOfRoutes,
} from '../api/general/general_api'
import {
	getTenantFromSQL,
	getCorporationProfile,
} from '../api/auth/auth_api'
import {
	getListings,
} from '../api/listings/listings_api'
import { getTenantPreferences } from '../api/prefs/prefs_api'
import { FINANCIALS } from '../reducers/prefs/schemas/financials_schema'
import { GROUP } from '../reducers/prefs/schemas/group_schema'
import { MOVEIN } from '../reducers/prefs/schemas/movein_schema'
import { CREDIT } from '../reducers/prefs/schemas/credit_schema'
import { LOCATION } from '../reducers/prefs/schemas/location_schema'
import { AMENITIES } from '../reducers/prefs/schemas/amenities_schema'
import { TOUR } from '../reducers/prefs/schemas/tour_schema'
import { DOCUMENTS } from '../reducers/prefs/schemas/documents_schema'
import { ROOMMATES } from '../reducers/prefs/schemas/roommates_schema'
import { isMobile } from '../api/general/general_api'
import { isMobileRedux } from '../actions/app/app_actions'
import { setTenantID, saveTenantFavoritesToRedux, } from '../actions/tenant/tenant_actions'
import { getFavoritesForTenant } from '../api/tenant/tenant_api'


// this 'higher order component'(HOC) creator takes a component (called ComposedComponent)
// and returns a new component with added functionality
export default (ComposedComponent) => {
	class AppRootMechanics extends Component {

    componentWillMount() {
			this.checkIfMobile()
			console.log('checkIfTenantLoggedIn..')
			// check if tenant is already authenticated
			this.checkIfTenantLoggedIn()
				.then((data) => {
					console.log(data)
					if (data.tenant_id) {
						console.log('Grabbing prefs...')
						this.grabPrefs(data.tenant_id)
					}
					// do stuff based on the URL
					this.executeOnURL()
				})
				.catch((err) => {
					console.log(err)
					this.executeOnURL()
					// this.props.history.push('/aaa')
				})
    }

		checkIfMobile() {
			console.log('IS MOBILE', isMobile())
			this.props.isMobileRedux(isMobile())
		}

		grabListings() {
			getListings(this.props.prefs)
				.then((data) => {
					// if (data && data.length > 0) {
					// 	console.log(data)
						this.props.saveListingsToRedux(data)
						this.props.saveLoadingCompleteToRedux()

					// } else {
					// 	this.props.history.push('/noresults')
					// }
				})
				.catch((err) => {
					console.log(err)
				})
		}

		grabPrefs(tenant_id) {
			getTenantPreferences(tenant_id)
					.then((prefs) => {
						console.log(prefs)
						const keys = [
							FINANCIALS.KEY,
							GROUP.KEY,
							MOVEIN.KEY,
							CREDIT.KEY,
							LOCATION.KEY,
							AMENITIES.KEY,
							TOUR.KEY,
							DOCUMENTS.KEY,
							ROOMMATES.KEY,
						]
						keys.filter(key => key).forEach((key) => {
							this.props.updatePreferences(prefs[key] || {})
						})
						// setTimeout(() => {
							this.grabListings()
						// }, 250)
					}).catch((err) => {
						console.log(err)
					})
			getFavoritesForTenant(tenant_id)
				.then((data) => {
					this.props.saveTenantFavoritesToRedux(data)
				})
				.catch((err) => {
					console.log(err)
				})
		}

		checkIfTenantLoggedIn() {
			const p = new Promise((res, rej) => {
				// grab the url that was given, will be used in this,saveStaffProfileToRedux()
				let location = this.props.location.pathname + this.props.location.search + this.props.location.hash
				// if (location === '/login') {
				// 	location = '/'
				// }
				console.log(this.props.location)
				// if (this.props.location.pathname === '/passwordless') {
				// 	console.log('PASSWORDLESS')
				// 	this.props.authenticationLoaded()
				// 	res({ tenant_id: null })
				// } else {
					this.startLoginForTenant(location)
						.then((data) => {
							res(data)
						})
				// }

			})
			return p
		}

		startLoginForTenant(location) {
			const p = new Promise((res, rej) => {
				retrieveTenantFromLocalStorage()
					.then((tenant) => {
						console.log(tenant)
						return getTenantFromSQL(tenant.IdentityId)
					})
					.then((data) => {
						console.log(data)
						// if (location === '/') {
						// 	location = '/app/home'
						// }
						// // if they have, then we'll auto log them in
						this.props.saveTenantProfileToRedux(data)
						this.props.authenticateTenant(true)
						this.props.authenticationLoaded(true)
		        this.props.setTenantID(data.tenant_id)
						res({ tenant_id: data.tenant_id })
					})
					// .then(() => {
					// 	console.log(location)
					// 	this.props.history.push(location)
					// })
					.catch((err) => {
						console.log(err)
						// if not, then we do nothing

						// this.props.forwardUrlLocation(location)
						// this.props.history.push(location)
						// this.props.authenticateTenant(null)
						// this.props.authenticationLoaded()

						const tenant_id = localStorage.getItem('tenant_id')
						if (tenant_id && tenant_id.length > 0) {
							// tenant_id exists, relogin
							this.props.authenticationLoaded()
							res({ tenant_id: tenant_id, })
						} else {
							// tenant_id does not exists. start new session
							this.props.authenticationLoaded()
							res({ tenant_id: null })
							// unauthRoleTenant()
							// 	.then((unauthUser) => {
							// 		console.log(unauthUser)
							// 		this.props.saveTenantProfileToRedux(unauthUser)
							// 		this.props.authenticationLoaded()
							// 		res(unauthUser.tenant_id)
							// 	})
						}
					})
			})
			return p
		}

		// saveStaffProfileToRedux(staff, location) {
		// 	let app_location = location
		// 	this.props.saveStaffProfileToRedux(staff)
		// 	this.props.authenticateTenant(staff)
		//
		// 	return getCorporationProfile(staff.corporation_id)
		// 		.then((corp) => {
		// 			if (corp === '') {
		// 				console.log('corp is nth')
		// 				this.props.saveCorporationProfileToRedux({})
		// 				app_location = '/app/registration'
		// 				this.props.history.push('/app/registration')
		// 			} else {
		// 				this.props.saveCorporationProfileToRedux(corp)
		// 				return this.grabAllInitialData(corp.corporation_id)
		// 			}
		// 		})
		// 		.then((results) => {
		// 			console.log(results)
		// 			this.props.saveLoadingCompleteToRedux()
		// 			this.props.history.push(app_location)
		// 		})
		// 		.catch((err) => {
		// 			console.log('nooooo')
		// 			console.log(err)
		// 		})
		// }

		grabAllInitialData(corporation_id) {
			const initials = [

			]
			console.log(initials)
			return Promise.all(initials)
		}

		executeOnURL() {
			// grab the url that was given
			const pathname = this.props.location.pathname
			const search = this.props.location.search
			const hash = this.props.location.hash
			// take the path in the url and go directly to that page and save to redux any actions necessary
			if (pathname !== '/') {
				// use forwardUrlLocation when you have a path that requires a login first (privately available)
				// use PossibleRoutes.js when you have a path that is publically available
				this.props.forwardUrlLocation(pathname + search + hash)
				// if not, then we do nothing
				redirectPath(pathname + search + hash).then(({ path, actions }) => {
					// path = '/sage-5'
					// actions = [ { type, payload }, { type, payload } ]
					this.props.dispatchActionsToRedux(actions)
					console.log(path)
					this.props.history.push(path)
				})
			}
		}

		render() {
			// the rendered composed component, with props passed through
			return <ComposedComponent id='AppRootKernal' {...this.props} />
		}
	}

  // defines the types of variables in this.props
  AppRootMechanics.propTypes = {
  	history: PropTypes.object.isRequired,
		forwardUrlLocation: PropTypes.func.isRequired,
		saveStaffProfileToRedux: PropTypes.func.isRequired,
		authenticateTenant: PropTypes.func.isRequired,
		saveCorporationProfileToRedux: PropTypes.func.isRequired,
		dispatchActionsToRedux: PropTypes.func.isRequired,
		saveLoadingCompleteToRedux: PropTypes.func.isRequired,
		authenticationLoaded: PropTypes.func.isRequired,
		tenant_profile: PropTypes.object.isRequired,
		saveListingsToRedux: PropTypes.func.isRequired,
		updatePreferences: PropTypes.func.isRequired,
		saveTenantProfileToRedux: PropTypes.func.isRequired,
		prefs: PropTypes.object.isRequired,
		isMobileRedux: PropTypes.func.isRequired,
		setTenantID: PropTypes.func.isRequired,
		saveTenantFavoritesToRedux: PropTypes.func.isRequired,
  }

  // for all optional props, define a default value
  AppRootMechanics.defaultProps = {

  }

	const mapStateToProps = (redux) => {
		return {
			prefs: redux.prefs,
			tenant_profile: redux.auth.tenant_profile,
		}
	}

	// we nest our custom HOC to connect(), which in itself is a HOC
	// we can actually nest HOC infinitely deep
	return withRouter(
		connect(mapStateToProps, {
			forwardUrlLocation,
			saveStaffProfileToRedux,
			authenticateTenant,
			saveCorporationProfileToRedux,
			dispatchActionsToRedux,
			saveLoadingCompleteToRedux,
			authenticationLoaded,
			saveListingsToRedux,
			updatePreferences,
			saveTenantProfileToRedux,
			isMobileRedux,
			setTenantID,
			saveTenantFavoritesToRedux,
    })(AppRootMechanics)
	)
}

// Pseudo-code demonstrating how to use the higher order component (HOC)
/*
	// In some other location (not in this file), we want to use this HOC...
	import AppRootMechanics	// The HOC
	import Resources		// The component to be wrapped
	const ComposedComponent = AppRootMechanics(Resources);

	// In some render method...
	<ComposedComponent />

	// <ComposedComponent> actually renders the AppRootMechanics class, which renders the composed component
	// This 2 layer method is powerful because when we pass in props to <ComposedComponent> like below:
	<ComposedComponent propA={propA} />
	// we can pass those props into the 2nd layer (composed component) using a correct 'this' reference to the 1st layer
*/
