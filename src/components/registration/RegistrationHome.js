// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'antd-mobile'


class RegistrationHome extends Component {

	render() {
		return (
			<div id='RegistrationHome' style={comStyles().container}>
				<div style={comStyles().mainContainer}>
					<h2>{`Hello, ${this.props.staff_profile.first_name}, welcome to RentHero. Please start by giving me some information about your business name!`}</h2>

				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
RegistrationHome.propTypes = {
	history: PropTypes.object.isRequired,
	staff_profile: PropTypes.object.isRequired,
}

// for all optional props, define a default value
RegistrationHome.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(RegistrationHome)

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
		},
		mainContainer: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			height: '100%',
			width: '100%',
		}
	}
}
