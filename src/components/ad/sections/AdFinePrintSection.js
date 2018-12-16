// Compt for copying as a AdFinePrintSection
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import moment from 'moment'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'antd-mobile'


class AdFinePrintSection extends Component {

  renderFinePrintTitle() {
    return (
      <h3>The Fine Print</h3>
    )
  }

  renderQuickDetails() {
    return (
      <div>
        <div>MOVEIN {moment(this.props.current_listing.MOVEIN).format('MM dd')}</div>
        <div>{this.props.current_listing.LEASE_LENGTH} month lease</div>
        <div>{this.props.current_listing.UTILITIES}</div>
      </div>
    )
  }

  renderDetails() {
    return (
      <div>{`For rent available to a young professional. Requires a credit check and proof of employment.`}</div>
    )
  }

	render() {
		return (
			<div id='AdFinePrintSection' style={comStyles().container}>
				{this.renderFinePrintTitle()}
        {this.renderQuickDetails()}
        {this.renderDetails()}
			</div>
		)
	}
}

// defines the types of variables in this.props
AdFinePrintSection.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
AdFinePrintSection.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AdFinePrintSection)

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
      flexDirection: 'column',
		}
	}
}
