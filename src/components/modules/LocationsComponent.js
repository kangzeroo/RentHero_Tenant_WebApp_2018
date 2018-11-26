// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Rate,
  Icon,
} from 'antd'

class LocationsComponent extends Component {

  constructor() {
    super()
    this.state = {
      visible: false,
      current_location: {},
    }
    this.grey_map_pin = 'https://s3.amazonaws.com/rentburrow-static-assets/Icons/gray-dot.png'
    this.red_map_pin = 'https://s3.amazonaws.com/rentburrow-static-assets/Icons/red-dot.png'
    this.blue_map_pin = 'https://s3.amazonaws.com/rentburrow-static-assets/Icons/blue-dot.png'
    // this.refreshPins.bind(this)
  }

  componentDidMount() {
    console.log('====MOUNTED LOCATIONS====')
    this.mountGoogleMap()
  }

  mountGoogleMap() {
    const mapOptions = {
      center: {
        lat: parseFloat(this.props.map_center),
        lng: parseFloat(this.props.map_center),
      },
      zoom: 15,
      zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
      },
      streetViewControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
      },
    }
    const mapTarget = new google.maps.Map(document.getElementById(this.props.id), mapOptions)

    // this.refreshPins()
    // marker.setMap(mapTarget)
    this.setMarkers(mapTarget)
	}

  setMarkers(map) {
    const ad_marker = new google.maps.Marker({
          position: new google.maps.LatLng(this.props.map_center.lat, this.props.map_center.lng),
          map: map,
          icon: this.blue_map_pin,
          zIndex: 1,
      })
    this.props.listOfResults.forEach((n, i) => {
      const location = n.geometry.location
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(location.lat, location.lng),
        map: map,
        icon: this.red_map_pin,
        title: n.formatted_address,
        zIndex: 1,
      })
      marker.addListener('click', (event) => {
        this.setState({
          current_location: n,
        }, () => console.log(this.state.current_location))
        // if (marker.getAnimation() !== null) {
        //   marker.setAnimation(null)
        // } else {
        //   marker.setAnimation(google.maps.Animation.BOUNCE)
        // }
      })
      // marker.label = n.formatted_address
    })
  }

	render() {
		return (
			<div id='LocationsComponent' style={comStyles().container}>
        <div id={this.props.id} style={comStyles().map}></div>
        {
          this.state.current_location && this.state.current_location.reference
          ?
          <div style={comStyles().mapDetails}>
            <div style={{ display: 'flex', flexDirection: 'row', }}>
              {
                this.state.current_location.photos && this.state.current_location.photos.length > 0
                ?
                <img src={`https://maps.googleapis.com/maps/api/place/photo?maxheight=100&maxwidth=100&photoreference=${this.state.current_location.photos[0].photo_reference}&key=AIzaSyBwZVKnj0MNklGasO8_e0IgusCWLt9ksFM`} style={{ borderRadius: '0px 0px 0px 20px' }} />
                :
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }} >
                  <Icon type="minus-circle-o" style={{ fontSize: '3rem', color: 'white' }} />
                  <div>No Image</div>
                </div>
              }
              <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '20px' }}>
                <p style={{ color: 'white' }}>{ this.state.current_location.name }</p>
                <p>{ this.state.current_location.formatted_address }</p>
                <Rate value={this.state.current_location.rating} />
              </div>
            </div>
          </div>
          :
          null
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
LocationsComponent.propTypes = {
	history: PropTypes.object.isRequired,
  map_center: PropTypes.object.isRequired,    // passed in
  listOfResults: PropTypes.array.isRequired,  // passed in
  id: PropTypes.string.isRequired,            // passed in
}

// for all optional props, define a default value
LocationsComponent.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(LocationsComponent)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    // current_ad: redux.advertisements.current_ad,
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
      // display: 'flex',
      // flexDirection: 'row',
      height: '350px',
      width: '80vw',
      borderRadius: '20px',
      position: 'relative',
		},
    map: {
      height: '100%',
      width: '100%',
      zIndex: 20,
      borderRadius: '20px',
    },
    mapDetails: {
      position: 'absolute',
      bottom: '0px',
      left: '0px',
      background: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      height: 'auto',
      width: '100%',
      padding: '10px',
      zIndex: 23,
      borderRadius: '0px 0px 20px 20px',
    }
	}
}
