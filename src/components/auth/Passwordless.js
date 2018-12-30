// Compt for copying as a Passwordless
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Spin,
} from 'antd'
import { registerPasswordlessAuth0WithCognito } from '../../api/aws/aws-cognito'
import { registerTenantPhone, registerTenantEmail, addToFavoritesToSQL } from '../../api/tenant/tenant_api'
import { saveTenantProfileToRedux } from '../../actions/auth/auth_actions'
import { saveTenantFavoritesToRedux } from '../../actions/tenant/tenant_actions'
// import { getTenantInfo } from '../../api/tenant/tenant_api'
import auth0 from 'auth0-js'


class Passwordless extends Component {

	componentDidMount() {
		const hash = this.props.location.hash
		console.log(hash)
		const access_token_start = hash.indexOf('access_token=')
		const expires_in_start = hash.indexOf('&expires_in=')
		const token_type_start = hash.indexOf('&token_type=')
		const state_start = hash.indexOf('&state=')
		const id_token_start = hash.indexOf('&id_token=')
    const scope_start = hash.indexOf('&scope=')
    // const id_token = hash.slice(id_token_start + '&id_token='.length, scope_start)
		const id_token = hash.slice(id_token_start + '&id_token='.length)
		console.log(id_token_start)
    // const access_token = hash.slice(access_token_start + 'access_token='.length, id_token_start)
    console.log(id_token)

		let unauth_exists = false
		const prev_user_obj = localStorage.getItem('userObj')
		if (prev_user_obj && prev_user_obj.length > 0) {
			const prev_userObj = JSON.parse(prev_user_obj)
			if (prev_userObj.type === 'unauth') {
				console.log('PREVIOUS USER OBJECT UNAUTH EXISTS')
				unauth_exists = true
			}
		}
    registerPasswordlessAuth0WithCognito(id_token, unauth_exists)
			.then(({ IdentityId }) => {
				console.log(IdentityId)
				const phoneStr = localStorage.getItem('phone')
				const emailStr = localStorage.getItem('email')
				if (phoneStr) {
					const phoneObj = JSON.parse(phoneStr)
					const tenantObj = {
						tenant_id: IdentityId,
						phone_number: phoneObj.phoneNumber,
						national_format: phoneObj.nationalFormat,
						country_code: phoneObj.countryCode,
						email: emailStr,
						authenticated: true,
					}

					return registerTenantPhone(tenantObj)
				} else if (emailStr) {
					const tenantObj = {
						tenant_id: IdentityId,
						email: emailStr,
						authenticated: true,
					}

					return registerTenantEmail(tenantObj)
				} else {
					console.log('PHONE AND EMAIL NOT IN LOCAL STORAGE')
				}
			})
			.then((data) => {
				console.log(data)
				return this.props.saveTenantProfileToRedux(data.tenant)
			})
			.then(() => {
				let auth_listing_id = localStorage.getItem('auth_listing_id')
				let auth_action = localStorage.getItem('auth_action')
				if (auth_listing_id && auth_listing_id.length > 0) {
					console.log('AUTH LISTING TOKEN EXISTS: ', auth_listing_id)
					this.props.history.push(`/matches/${auth_listing_id}`)
					if (auth_action === 'favorite') {
						addToFavoritesToSQL({
							tenant_id: this.props.tenant_profile.tenant_id,
							listing_id: listing_id,
							meta: ''
						})
						.then((data) => {
							this.props.saveTenantFavoritesToRedux(data.favorites)
						})
						.catch((err) => {
							console.log(err)
						})
					}
				} else {
					this.props.history.push('/intro')
				}
			})
			.catch((err) => {
				console.log(err)
			})
	}

	render() {
		return (
			<div id='Passwordless' style={comStyles().container}>
				<Spin tip='Verifying...' />
			</div>
		)
	}
}

// defines the types of variables in this.props
Passwordless.propTypes = {
	history: PropTypes.object.isRequired,
	saveTenantProfileToRedux: PropTypes.func.isRequired,
	saveTenantFavoritesToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
Passwordless.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(Passwordless)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		saveTenantProfileToRedux,
		saveTenantFavoritesToRedux,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
			height: '100vh',
			width: '100%',
			justifyContent: 'center',
			alignItems: 'center',
		}
	}
}
