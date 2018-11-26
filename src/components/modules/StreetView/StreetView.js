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


class StreetView extends Component {

  componentDidMount() {
    if (this.props.card_section_shown === 'streetview') {
      this.renderStreetview()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevProps.card_section_shown !== this.props.card_section_shown && this.props.card_section_shown === 'streetview') || (prevProps.current_listing !== this.props.current_listing)) {
      this.renderStreetview()
    }
  }

  renderStreetview() {
    const location = { lat: this.props.current_listing.GPS.lat, lng: this.props.current_listing.GPS.lng }
    const panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), {
        position: location,
        pov: {heading: 165, pitch: 0},
        motionTracking: false,
        zoomControl: false,
        addressControl: false,
      }
    )
  }

	render() {
    if (this.props.card_section_shown === 'streetview') {
  		return (
  			<div id='StreetView' style={comStyles().container}>
  				<div id='pano' style={comStyles().pano}>
          </div>
  			</div>
  		)
    } else {
      return null
    }
	}
}

// defines the types of variables in this.props
StreetView.propTypes = {
	history: PropTypes.object.isRequired,
	current_listing: PropTypes.object.isRequired,       // passed in
  card_section_shown: PropTypes.string.isRequired,    // passed in
}

// for all optional props, define a default value
StreetView.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(StreetView)

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
		},
		pano: {
			height: '500px',
      width: '100%',
		},
	}
}
