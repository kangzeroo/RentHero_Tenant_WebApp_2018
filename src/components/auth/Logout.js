// Compt for logging out functionality

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { unauthenticateTenant, removeTenantProfile } from '../../actions/auth/auth_actions'
import { signOutTenant } from '../../api/aws/aws-cognito'
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '../../api/ENV_CREDs'
import auth0 from 'auth0-js'

class Logout extends Component {

	componentWillMount() {


		this.props.unauthenticateTenant()
		this.props.removeTenantProfile()
		signOutTenant()
		this.props.history.push('/login')
	}

	logoutWebAuth() {
		const webAuth = new auth0.WebAuth({
			domain:       AUTH0_DOMAIN,
			clientID:     AUTH0_CLIENT_ID
		});

		webAuth.logout({
			returnTo: '/',
			client_id: AUTH0_CLIENT_ID
		});
	}

	render() {
		return (
			<div id='Logout'>
				<p>Sorry to see you go...</p>
			</div>
		)
	}
}

Logout.propTypes = {
	history: PropTypes.object,
}

const RadiumHOC = Radium(Logout);

export default withRouter(
	connect(null, {
		unauthenticateTenant,
		removeTenantProfile,
	})(RadiumHOC)
)

// ==================================


// const comStyles = () => {
// 	return {
// 		background: {
// 			backgroundColor: xMidBlue,
// 			width: "100%",
// 			height: "100%",
// 			margin: "0",
// 			left: "0",
// 			top: "0",
// 			display:"flex",
// 			WebkitBoxPack: "justify", WebkitJustifyContent: "center", justifyContent: "center"
// 		},
// 		goodbye: {
// 			fontSize: "1.5rem",
// 			fontWeight: "bold",
// 			color: "white",
// 			margin: "auto"
// 		}
// 	}
// }
