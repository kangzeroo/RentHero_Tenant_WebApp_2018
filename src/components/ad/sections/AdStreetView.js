// Compt for copying as a AdStreetView
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Button,
} from 'antd'


class AdStreetView extends Component {

  constructor() {
    super()
    this.state = {
      begin: false,
    }
  }

  componentDidMount() {
    this.renderStreetview()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.current_listing !== this.props.current_listing) {
      this.renderStreetview()
    }
    if (prevState.begin !== this.state.begin) {
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
		return (
			<div id='AdStreetView' style={comStyles().container}>
        <h2>Street View</h2>
        {
          this.state.begin
          ?
          <div id='pano' style={comStyles().pano}>
          </div>
          :
          <div style={comStyles().sub}>
            <Button type='primary' style={comStyles().button} onClick={() => this.setState({ begin: true, })} size='large' icon='caret-right'>
              Start View
            </Button>
          </div>
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
AdStreetView.propTypes = {
	history: PropTypes.object.isRequired,
	current_listing: PropTypes.object.isRequired,       // passed in
}

// for all optional props, define a default value
AdStreetView.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AdStreetView)

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
      padding: '30px',
      textAlign: 'left',
		},
		pano: {
			height: '500px',
      width: '100%',
		},
    sub: {
      backgroundImage: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
      height: '500px',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '10px',
    },
    button: {
      background: 'none',
      color: 'white',
      borderColor: 'white',
      fontWeight: 'bold',
      ":hover": {
        background: 'lightgray'
      }
    }
	}
}
