// Compt for copying as a RegisterPage
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'antd-mobile'
import TenantRegistrationDialog from '../dialogs/onboarding/TenantRegistrationDialog'
import TenantInfoDialog from '../dialogs/onboarding/TenantInfoDialog'
import HeatMap from '../hunting/HeatMapHunting'
import { isMobile } from '../../api/general/general_api'

class RegisterPage extends Component {

	constructor() {
		super()
		this.state = {
			mobile: false,
		}
	}

	componentWillMount() {
		this.setState({
			mobile: isMobile()
		})
	}

	componentDidUpdate() {
		if (isMobile() !== this.state.mobile) {
			console.log('mobile changed....')
			this.setState({
				mobile: isMobile(),
			})
		}
	}

	render() {
		if (this.state.mobile) {
			return (
				<div id='RegisterPage' style={comStyles().container}>
	        <div style={{ width: '100vw' }}>
					    <TenantRegistrationDialog width='100vw' />
	        </div>
				</div>
			)
		} else {
			return (
				<div id='RegisterPage' style={comStyles().container}>
	        <div style={{ width: '40vw' }}>
					    <TenantRegistrationDialog width='40vw' />
	        </div>
	        <div style={{ width: '60vw' }}>
						<HeatMap />
	        </div>
				</div>
			)
		}

	}
}

// defines the types of variables in this.props
RegisterPage.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
RegisterPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(RegisterPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

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
      flexDirection: 'row',
		}
	}
}
