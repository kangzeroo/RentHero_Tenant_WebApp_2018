// Compt for copying as a TenantDuality
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'antd-mobile'
import TenantInfoDialog from '../dialogs/onboarding/TenantInfoDialog'
import HeatMap from '../hunting/HeatMapHunting'
import DesktopHeader from '../format/desktop/DesktopHeader'
import { isMobile } from '../../api/general/general_api'


class TenantDuality extends Component {

	constructor() {
		super()
		this.state = {
			mobile: false,
		}
	}

	componentWillMount() {
		if (this.props.authenticated) {
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
				<div id='TenantDuality' style={comStyles().container}>
	        <div style={{ width: '100vw' }}>
					    <TenantInfoDialog width='100vw' />
	        </div>
				</div>
			)
		} else {
			return (
				<div id='TenantDuality' style={comStyles().container}>
	        <div style={{ width: '40vw' }}>
					    <TenantInfoDialog width='40vw' />
	        </div>
	        <div style={{ width: '60vw' }}>
						<HeatMap
							preview={true}
							listings={this.props.all_listings}
							current_listing={this.props.current_listing}
						/>
	        </div>
				</div>
			)
		}

	}
}

// defines the types of variables in this.props
TenantDuality.propTypes = {
	history: PropTypes.object.isRequired,
  all_listings: PropTypes.array.isRequired,
	current_listing: PropTypes.object,
	authenticated: PropTypes.bool.isRequired,
}

// for all optional props, define a default value
TenantDuality.defaultProps = {
	authenticated: false,
	current_listing: null,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(TenantDuality)

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
      flexDirection: 'row',
		}
	}
}
