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


class ListingActions extends Component {

  constructor() {
    super()
    this.state = {

    }
  }

  onClose() {
    history.pushState(null, null, `${this.props.location.pathname}/${this.props.current_listing.REFERENCE_ID}`)
    this.props.onClose()
  }

  renderStickyHeader() {
    return (
      <Card style={{ width: '100%', position: 'absolute', top: 0, left: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
        <Icon
          type="left"
          size='large'
          style={{
            cursor: 'pointer'
          }}
          onClick={() => this.onClose()}
        />
        <div />
      </Card>
    )
  }

	render() {
		return (
			<div id='ListingActions' style={comStyles().container}>
        {
          this.renderStickyHeader()
        }
        <div style={{ height: '60px' }} />
			</div>
		)
	}
}

// defines the types of variables in this.props
ListingActions.propTypes = {
	history: PropTypes.object.isRequired,
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