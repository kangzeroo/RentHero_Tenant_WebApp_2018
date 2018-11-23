// Higher Order Compt for initializing actions upon AppRoot load

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { retrieveStaffFromLocalStorage } from '../api/aws/aws-cognito'
import { dispatchActionsToRedux } from '../actions/system/system_actions'
import {
	saveStaffProfileToRedux,
	authenticateStaff,
	authenticationLoaded,
	forwardUrlLocation,
	saveCorporationProfileToRedux,
} from '../actions/auth/auth_actions'
import { saveLoadingCompleteToRedux } from '../actions/app/app_actions'
import {
	saveListingsToRedux,
} from '../actions/listings/listings_actions'
import {
	redirectPath,
	setLanguageFromLocale,
	checkIfPartOfRoutes,
} from '../api/general/general_api'
import {
	getStaffProfile,
	getCorporationProfile,
} from '../api/auth/auth_api'
import {
	getListings,
} from '../api/listings/listings_api'


// this 'higher order component'(HOC) creator takes a component (called ComposedComponent)
// and returns a new component with added functionality
export default (ComposedComponent) => {
	class AppRootMechanics extends Component {

    componentWillMount() {
			this.grabListings()
			// check if staff is already authenticated
			this.checkIfStaffLoggedIn()

			// do stuff based on the URL
			this.executeOnURL()
    }

		grabListings() {
			getListings({
	      max_beds: this.props.prefs.max_beds,
	      max_budget: this.props.prefs.max_budget,
	      destination: {
	        address: this.props.prefs.destination.address,
	        place_id: this.props.prefs.destination.place_id,
	        commute_mode: this.props.prefs.destination.commute_mode,
	        gps: { lat: this.props.prefs.destination.gps.lat, lng: this.props.prefs.destination.gps.lng }
	      }
	    })
				.then((data) => {
					console.log(data)
					this.props.saveListingsToRedux(data)
				})
				.catch((err) => {
					console.log(err)
				})
		}

		checkIfStaffLoggedIn() {
			// grab the url that was given, will be used in this,saveStaffProfileToRedux()
			let location = this.props.location.pathname + this.props.location.search + this.props.location.hash
			if (location === '/login') {
				location = '/'
			}
			retrieveStaffFromLocalStorage()
				.then((staff) => {
					console.log(staff)
					console.log('kz trippin balls')
					console.log(location)
					return getStaffProfile(staff.IdentityId, {})
				})
				.then((data) => {
					console.log(data)
					if (location === '/') {
						location = '/app/home'
					}
					// if they have, then we'll auto log them in
					this.props.history.push(location)
					this.props.authenticationLoaded()
					return this.saveStaffProfileToRedux(data.profile, location)
				})
				.catch((err) => {
					// if not then we do nothing
					console.log('kz tripping shit')
					console.log(err)
					this.props.forwardUrlLocation(location)
					this.props.history.push(location)
					this.props.authenticateStaff(null)
					this.props.authenticationLoaded()
				})
		}

		saveStaffProfileToRedux(staff, location) {
			let app_location = location
			this.props.saveStaffProfileToRedux(staff)
			this.props.authenticateStaff(staff)

			return getCorporationProfile(staff.corporation_id)
				.then((corp) => {
					if (corp === '') {
						console.log('corp is nth')
						this.props.saveCorporationProfileToRedux({})
						app_location = '/app/registration'
						this.props.history.push('/app/registration')
					} else {
						this.props.saveCorporationProfileToRedux(corp)
						return this.grabAllInitialData(corp.corporation_id)
					}
				})
				.then((results) => {
					console.log(results)
					this.props.saveLoadingCompleteToRedux()
					this.props.history.push(app_location)
				})
				.catch((err) => {
					console.log('nooooo')
					console.log(err)
				})
		}

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
		authenticateStaff: PropTypes.func.isRequired,
		saveCorporationProfileToRedux: PropTypes.func.isRequired,
		dispatchActionsToRedux: PropTypes.func.isRequired,
		saveLoadingCompleteToRedux: PropTypes.func.isRequired,
		authenticationLoaded: PropTypes.func.isRequired,
		saveListingsToRedux: PropTypes.func.isRequired,
		prefs: PropTypes.object.isRequired,
  }

  // for all optional props, define a default value
  AppRootMechanics.defaultProps = {

  }

	const mapStateToProps = (redux) => {
		return {
			prefs: redux.listings.prefs
		}
	}

	// we nest our custom HOC to connect(), which in itself is a HOC
	// we can actually nest HOC infinitely deep
	return withRouter(
		connect(mapStateToProps, {
			forwardUrlLocation,
			saveStaffProfileToRedux,
			authenticateStaff,
			saveCorporationProfileToRedux,
			dispatchActionsToRedux,
			saveLoadingCompleteToRedux,
			authenticationLoaded,
			saveListingsToRedux,
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
