// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Card,
  Icon,
} from 'antd'
import InterestDialog1 from '../../dialogs/interest/existing_user_first_inquiry/InterestDialog1'
import InterestDialog2 from '../../dialogs/interest/new_user_first_inquiry/InterestDialog2'

class ListingActions extends Component {

  constructor() {
    super()
    this.state = {

    }
  }

  renderAppropriateDialog() {
    if (this.props.tenant_id) {
      return (
        <InterestDialog1
          scrollStyles={{
            scroll_styles: { width: '60vw' }
          }}
        />
      )
    } else {
      return (<InterestDialog2
        scrollStyles={{
          scroll_styles: { width: '60vw' }
        }}
      />)
    }
  }

	render() {
		return (
			<div id='ListingActions' style={comStyles().container}>
        {
          this.renderAppropriateDialog()
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
ListingActions.propTypes = {
	history: PropTypes.object.isRequired,
  tenant_id: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,             // passed in
  current_listing: PropTypes.object.isRequired,   // passed in
}

// for all optional props, define a default value
ListingActions.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ListingActions)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    tenant_id: redux.auth.tenant_profile.tenant_id,
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
