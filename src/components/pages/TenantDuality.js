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


class TenantDuality extends Component {

	render() {
		return (
			<div id='TenantDuality' style={comStyles().container}>
        <div style={{ width: '40vw' }}>
				    <TenantInfoDialog width='40vw' />
        </div>
        <div style={{ width: '60vw' }}>
          <HeatMap />
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
TenantDuality.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
TenantDuality.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(TenantDuality)

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
