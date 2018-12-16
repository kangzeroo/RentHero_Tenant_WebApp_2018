// Compt for copying as a AdCoverSection
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'antd-mobile'
import LikeableImage from './LikeableImage'


class AdCoverSection extends Component {

  constructor() {
    super()
    this.state = {
      directions: null,
      commute_time: 0,
      commute_distance: 0,
    }
  }

  componentDidMount() {
    this.grabDirections('transit')
      .then((directions) => {
        this.setState({
          directions: directions
        }, () => this.renderDirections())
      })
      .catch((err) => {
        console.log(err)
      })
  }

  renderCoverImage() {
    return (
      <div key='cover_image' style={coverStyles().container}>
        <LikeableImage img={this.props.cover_image} />
      </div>
    )
  }

  renderDescription() {
    return (
      <div key='description' style={descriptionStyles().container}>
        <h2>{`${this.props.beds} Beds ${this.props.baths} Baths for rent by ${this.props.seller}`}</h2>
      </div>
    )
  }

  grabDirections(commute_mode) {
    const self = this
    const p = new Promise((res, rej) => {
  		const directionsService = new google.maps.DirectionsService
  		directionsService.route({
  			origin: this.props.current_listing.ADDRESS,
  			destination: this.props.main_destination,
  			travelMode: commute_mode.toUpperCase()
  		}, function(response, status) {
  			if (status === 'OK') {
          self.setState({
  					commute_time: response.routes[0].legs.reduce((acc, curr) => acc + curr.duration.value, 0),
  					commute_distance: response.routes[0].legs.reduce((acc, curr) => acc + curr.distance.value, 0),
          })
          res(response)
  			} else {
          rej(status)
  				window.alert('Directions request failed due to ' + status);
  			}
  	 })
    })
    return p
  }

  renderDirections() {
    if (document.getElementById('map')) {
  		const self = this
  		const location = { lat: this.props.current_listing.GPS.lat, lng: this.props.current_listing.GPS.lng }
  		const map = new google.maps.Map(document.getElementById('map'), {
  			center: location,
  			zoom: 13,
  			disableDefaultUI: true,
  		})
  		const marker = new google.maps.Marker({
        position: location,
        map: map,
        // icon: BLUE_PIN
      })
  		const directionsDisplay = new google.maps.DirectionsRenderer;
  		directionsDisplay.setMap(map);
      if (this.state.directions) {
        directionsDisplay.setDirections(this.state.directions);
      }
    }
  }

  renderMap() {
    return (
      <div key='map' style={mapStyles().container}>
        <h3>{`${(this.state.commute_time/60).toFixed(0)} minutes commute to ${this.props.main_destination}. Arrival time by ${this.props.arrival_time}`}</h3>
        <div id='map' style={mapStyles().map}></div>
      </div>
    )
  }

	render() {
		return (
			<div id='AdCoverSection' style={comStyles().container}>
        {this.renderCoverImage()}
        {this.renderDescription()}
        {this.renderMap()}
			</div>
		)
	}
}

// defines the types of variables in this.props
AdCoverSection.propTypes = {
	history: PropTypes.object.isRequired,
  cover_image: PropTypes.string.isRequired,     // passed in
  beds: PropTypes.number.isRequired,     // passed in
  baths: PropTypes.number.isRequired,     // passed in
  seller: PropTypes.string.isRequired,     // passed in
  main_destination: PropTypes.string.isRequired,     // passed in
  arrival_time: PropTypes.string.isRequired,     // passed in
  current_listing: PropTypes.object.isRequired,     // passed in
}

// for all optional props, define a default value
AdCoverSection.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AdCoverSection)

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

const coverStyles = () => {
  return {
    container: {}
  }
}

const descriptionStyles = () => {
  return {
    container: {}
  }
}

const mapStyles = () => {
  return {
    container: {
      padding: '30px'
    },
    map: {
			height: '400px',
    }
  }
}
