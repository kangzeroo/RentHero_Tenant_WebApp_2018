// Compt for copying as a OnlyMapHunting
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import HeatMap from './HeatMapHunting'
import {

} from 'antd-mobile'


class OnlyMapHunting extends Component {

	render() {
		return (
			<div id='OnlyMapHunting' style={comStyles().container}>
        <HeatMap
          preview={true}
          fullscreenSearch={true}
          listings={this.props.all_listings}
					current_listing={this.props.current_listing}
        />
			</div>
		)
	}
}

// defines the types of variables in this.props
OnlyMapHunting.propTypes = {
	history: PropTypes.object.isRequired,
  all_listings: PropTypes.array.isRequired,
	current_listing: PropTypes.object.isRequired,
}

// for all optional props, define a default value
OnlyMapHunting.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(OnlyMapHunting)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    all_listings: redux.listings.all_listings,
		current_listing: redux.listings.current_listing,
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
		}
	}
}
