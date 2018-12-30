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
import InterestDialog0 from '../../dialogs/interest/new_user_first_inquiry/InterestDialog0'
import InterestDialog1Waterloo from '../../dialogs/interest/existing_user_first_inquiry/InterestDialog1Waterloo'
import InterestDialog2Waterloo from '../../dialogs/interest/direct_subsequent_inquiries/InterestDialog2Waterloo'

class ListingActions extends Component {

  constructor() {
    super()
    this.state = {

    }
  }

  renderAppropriateDialog() {
    if (this.props.tenant_id) {
      if (this.props.prefs.LOCATION.DESTINATION_ADDRESS.toLowerCase().indexOf('waterloo') > -1 && this.props.prefs.FINANCIALS.EMPLOYED_AS.toLowerCase().indexOf('student') > -1) {
        if (this.props.prefs.FINANCIALS.STUDIED_AS.length === 0) {
          return (
            <InterestDialog1Waterloo
              closeModal={() => this.props.closeModal()}
              scrollStyles={{
                scroll_styles: { width: '60vw' }
              }} />
          )
        } else {
          return (
            <InterestDialog2Waterloo
              closeModal={() => this.props.closeModal()}
              scrollStyles={{
                scroll_styles: { width: '60vw' }
              }} />
          )
        }
      } else {
        return (
          <InterestDialog1
            closeModal={() => this.props.closeModal()}
            scrollStyles={{
              scroll_styles: { width: '60vw' }
            }} />
        )
      }
    } else {
      return (<InterestDialog0
        closeModal={() => this.props.closeModal()}
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
  prefs: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,          // passed in
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
    prefs: redux.prefs,
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
