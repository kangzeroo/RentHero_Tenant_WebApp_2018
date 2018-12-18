// Compt for copying as a InterestDialog
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'antd-mobile'
import InterestDialog1 from './existing_user_first_inquiry/InterestDialog1'
import InterestDialog2 from './new_user_first_inquiry/InterestDialog2'


class InterestDialog extends Component {

  renderCorrectInterestDialog() {
    if (this.props.tenant_id) {
      return (<InterestDialog1 />)
    } else {
      return (<InterestDialog2 />)
    }
  }

	render() {
		return (
			<div id='InterestDialog' style={comStyles().container}>
				{this.renderCorrectInterestDialog()}
			</div>
		)
	}
}

// defines the types of variables in this.props
InterestDialog.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
InterestDialog.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(InterestDialog)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    tenant_id: redux.auth.tenant_profile.tenant_id
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
