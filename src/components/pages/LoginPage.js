// Compt for copying as a LoginPage
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'antd'
import HeatMap from '../hunting/HeatMapHunting'
import AuthenticatePopup from '../auth/AuthenticatePopup'
import DesktopHeader from '../format/desktop/DesktopHeader'
import { isMobile } from '../../api/general/general_api'


class LoginPage extends Component {

	constructor() {
		super()
		this.state = {
			mobile: false,
		}
	}

	componentWillMount() {
		if (this.props.authenticated && this.props.tenant_profile && this.props.tenant_profile.authenticated) {
			this.props.history.push('/matches')
		}
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
				<div id='LoginPage' style={comStyles().container}>
					<DesktopHeader />
	        <div style={{ width: '100vw', height: '93vh', }}>
					    <AuthenticatePopup />
	        </div>
				</div>
			)
		} else {
			return (
				<div id='LoginPage' style={comStyles().container}>
					<DesktopHeader />
	        <div style={comStyles().rowContainer}>
						<div style={{ width: '40vw', height: '93vh' }}>
								<AuthenticatePopup />
						</div>
						<div style={{ width: '60vw', height: '93vh' }}>
							<HeatMap
								preview={true}
								listings={this.props.all_listings}
								current_listing={this.props.current_listing}
							/>
						</div>
					</div>
				</div>
			)
		}

	}
}

// defines the types of variables in this.props
LoginPage.propTypes = {
	history: PropTypes.object.isRequired,
  all_listings: PropTypes.array.isRequired,
	current_listing: PropTypes.object,
	authenticated: PropTypes.bool.isRequired,
}

// for all optional props, define a default value
LoginPage.defaultProps = {
	authenticated: false,
	current_listing: null,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(LoginPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    all_listings: redux.listings.all_listings,
		current_listing: redux.listings.current_listing,
		authenticated: redux.auth.authenticated,
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
			height: '100vh',
		},
		rowContainer: {
			display: 'flex',
			flexDirection: 'row',
			maxHeight: '93vh',
		}
	}
}
