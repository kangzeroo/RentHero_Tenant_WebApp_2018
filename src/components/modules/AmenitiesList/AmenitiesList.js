// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'antd-mobile'


class AmenitiesList extends Component {

	render() {
		return (
			<div id='AmenitiesList' style={comStyles().container}>
        <div style={mapStyles().mapControls}>
          {
            this.props.current_listing.UTILITIES.filter(ut => ut.indexOf('electricity') > -1).length > 0
            ?
            <Button type="ghost" inline size="small" style={{ margin: '3px' }}>Electric Incl.</Button>
            :
            <Button type="ghost" disabled inline size="small" style={{ margin: '3px' }}>Electric Extra</Button>
          }
          {
            this.props.current_listing.UTILITIES.filter(ut => ut.indexOf('water') > -1).length > 0
            ?
            <Button type="ghost" inline size="small" style={{ margin: '3px' }}>Water Incl.</Button>
            :
            <Button type="ghost" disabled inline size="small" style={{ margin: '3px' }}>Water Extra</Button>
          }
          {
            this.props.current_listing.UTILITIES.filter(ut => ut.indexOf('heating') > -1).length > 0
            ?
            <Button type="ghost" inline size="small" style={{ margin: '3px' }}>Heating Incl.</Button>
            :
            <Button type="ghost" disabled inline size="small" style={{ margin: '3px' }}>Heating Extra</Button>
          }
          {
            this.props.current_listing.UTILITIES.filter(ut => ut.indexOf('internet') > -1).length > 0
            ?
            <Button type="ghost" inline size="small" style={{ margin: '3px' }}>Internet Incl.</Button>
            :
            <Button type="ghost" disabled inline size="small" style={{ margin: '3px' }}>Internet Extra</Button>
          }
          {
            this.props.current_listing.UTILITIES.filter(ut => ut.indexOf('ac') > -1).length > 0
            ?
            <Button type="ghost" inline size="small" style={{ margin: '3px' }}>A/C</Button>
            :
            <Button type="ghost" disabled inline size="small" style={{ margin: '3px' }}>A/C Unknown</Button>
          }
          {
            this.props.current_listing.UTILITIES.filter(ut => ut.indexOf('insurance') > -1).length > 0
            ?
            <Button type="ghost" inline size="small" style={{ margin: '3px' }}>Insurance Incl.</Button>
            :
            <Button type="ghost" disabled inline size="small" style={{ margin: '3px' }}>Insurance Extra</Button>
          }
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
AmenitiesList.propTypes = {
	history: PropTypes.object.isRequired,
	current_listing: PropTypes.object.isRequired,       // passed in
  card_section_shown: PropTypes.string.isRequired,    // passed in
}

// for all optional props, define a default value
AmenitiesList.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AmenitiesList)

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
