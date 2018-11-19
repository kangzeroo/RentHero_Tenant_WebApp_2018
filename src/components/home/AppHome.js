// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'antd'


class AppHome extends Component {

	render() {
		return (
			<div id='AppHome' style={comStyles().container}>
				<div style={comStyles().mainContainer}>
					<h1>{`Welcome back, ${this.props.staff_profile.first_name}`}</h1>
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
AppHome.propTypes = {
	history: PropTypes.object.isRequired,
	staff_profile: PropTypes.object.isRequired,
}

// for all optional props, define a default value
AppHome.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AppHome)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		staff_profile: redux.auth.staff_profile,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {

	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
			width: '100%',
			height: '100%',
		},
		mainContainer: {
			width: '100%',
			height: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		}
	}
}
