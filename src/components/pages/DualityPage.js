// Compt for copying as a DualityPage
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'antd-mobile'
import OnboardingDialog from '../dialogs/onboarding/OnboardingDialog'
import HeatMap from '../hunting/HeatMapHunting'


class DualityPage extends Component {

	render() {
		return (
			<div id='DualityPage' style={comStyles().container}>
        <div style={{ width: '40vw' }}>
				    <OnboardingDialog width='40vw' />
        </div>
        <div style={{ width: '60vw' }}>
          <HeatMap />
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
DualityPage.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
DualityPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(DualityPage)

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
