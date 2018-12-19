// Compt for copying as a AdsHome
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'antd'
import AdsPage from './AdsPage'
import HeatMap from '../hunting/HeatMapHunting'
import { isMobile } from '../../api/general/general_api'
import DesktopHeader from '../format/desktop/DesktopHeader'

class AdsHome extends Component {

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
				<div id='AdsHome' style={comStyles().container}>
          <DesktopHeader />
	        <div style={{ width: '100vw', height: '93vh' }}>
					    <AdsPage width='100vw' />
	        </div>
				</div>
			)
		} else {
			return (
				<div id='AdsHome' style={comStyles().container}>
          <DesktopHeader />
          <div style={comStyles().rowContainer}>
  	        <div style={{ width: '40vw', overflowY: 'scroll', maxHeight: '93vh', }}>
  					    <AdsPage width='40vw' />
  	        </div>
  	        <div style={{ width: '60vw' }}>
  	          <HeatMap />
  	        </div>
          </div>
				</div>
			)
		}

	}
}

// defines the types of variables in this.props
AdsHome.propTypes = {
	history: PropTypes.object.isRequired,
  all_listings: PropTypes.array.isRequired,
}

// for all optional props, define a default value
AdsHome.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AdsHome)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    all_listings: redux.listings.all_listings,
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
