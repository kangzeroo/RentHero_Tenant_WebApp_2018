// Compt for logging out functionality

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { unauthenticateStaff, removeStaffProfile } from '../../actions/auth/auth_actions'
import { signOutLandlord } from '../../api/aws/aws-cognito'


class Logout extends Component {

	componentWillMount() {
		this.props.unauthenticateStaff()
		this.props.removeStaffProfile()
		signOutLandlord()
		this.props.history.push('/login')
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
		unauthenticateStaff,
		removeStaffProfile,
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
