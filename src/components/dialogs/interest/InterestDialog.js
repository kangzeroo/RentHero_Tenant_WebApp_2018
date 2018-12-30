// Compt for copying as a InterestDialog
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import {

} from 'antd-mobile'
import { Spin } from 'antd'
import { getCurrentListingByReference } from '../../../api/listings/listings_api'
import { setCurrentListing } from '../../../actions/listings/listings_actions'
import InterestDialog1Waterloo from './existing_user_first_inquiry/InterestDialog1Waterloo'
import InterestDialog1 from './existing_user_first_inquiry/InterestDialog1'
import InterestDialog0 from './new_user_first_inquiry/InterestDialog0'


class InterestDialog extends Component {

  componentWillMount() {
    console.log(this.props.location)
    const id = this.props.location.pathname.slice('/p/'.length)
    let obj = {}
    if (id.length > 9) {
      obj.ref_id = id
    } else {
      obj.short_id = id
    }
    getCurrentListingByReference(obj)
				.then((data) => {
					this.props.setCurrentListing(data)
          this.setState({
            lastUpdated: moment().unix(),
          })
				})
				.catch((err) => {
					console.log(err)
				})
  }

  renderCorrectInterestDialog() {
    if (this.props.tenant_id) {
      console.log(this.props.prefs)
      if (this.props.prefs.LOCATION.DESTINATION_ADDRESS.toLowerCase().indexOf('waterloo') > -1 && this.props.prefs.FINANCIALS.EMPLOYED_AS.toLowerCase().indexOf('student') > -1) {
        return (<InterestDialog1Waterloo />)
      } else {
        return (<InterestDialog1 />)
      }
    } else {
      return (<InterestDialog0 />)
    }
  }

	render() {
    if (this.props.auth.authentication_loaded && this.props.current_listing) {
  		return (
  			<div id='InterestDialog' style={comStyles().container}>
  				{this.renderCorrectInterestDialog()}
  			</div>
  		)
    } else {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Spin />
        </div>
      )
    }
	}
}

// defines the types of variables in this.props
InterestDialog.propTypes = {
	history: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  tenant_id: PropTypes.string.isRequired,
  setCurrentListing: PropTypes.func.isRequired,
  current_listing: PropTypes.object.isRequired,
  prefs: PropTypes.object.isRequired,
}

// for all optional props, define a default value
InterestDialog.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(InterestDialog)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    tenant_id: redux.auth.tenant_profile.tenant_id,
    prefs: redux.prefs,
    auth: redux.auth,
    current_listing: redux.listings.current_listing,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    setCurrentListing,
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
