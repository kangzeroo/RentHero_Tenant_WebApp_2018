// Compt for copying as a OnlyMapHunting
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import Ionicon from 'react-ionicons'
import { withRouter } from 'react-router-dom'
import HeatMap from './HeatMapHunting'
import {
	Card,
	Button,
	Divider,
} from 'antd'
import { setCurrentListing } from '../../actions/listings/listings_actions'
import { isMobile } from '../../api/general/general_api'
import { setCurrentFlagPin, setCurrentClickedLocation, setCurrentMapLocationToRedux, saveMapListingsToRedux } from '../../actions/map/map_actions'
import { BLUE_PIN, RED_PIN, GREY_PIN, FLAG_PIN, } from '../../assets/map_pins'

class OnlyMapHunting extends Component {

	constructor() {
		super()
		this.state = {
			prev_listing: {},
			current_listing: {},
			next_listing: {},

			show_filter: false,
		}
		this.pins = []
		this.map = null
	}

	componentWillMount() {
		if (this.props.all_listings && this.props.map_loaded) {
			this.refreshPins(this.props.all_listings)
		}
	}

	componentWillReceiveProps(nextProps) {
    if (this.props.all_listings !== nextProps.all_listings && this.props.map_loaded) {
      this.refreshPins(nextProps.all_listings)
    }
    if (this.props.map_loaded !== nextProps.map_loaded) {
      this.refreshPins(nextProps.all_listings)
    }
		// if (this.props.current_listing !== nextProps.current_listing) {
    //   this.refreshPins(nextProps.all_listings)
    // }
  }

  refreshPins(listings) {
    console.log(listings)
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      disableDefaultUI: true,
      clickableIcons: false,
    })
    let bounds = new google.maps.LatLngBounds()
    let self = this
		let markers = []
    if (listings && listings.length > 0) {
      listings.forEach((n, i) => {
          let marker
          marker = new google.maps.Marker({
                  position: new google.maps.LatLng(n.GPS.lat, n.GPS.lng),
                  pin_type: 'listing',
                  icon: RED_PIN,
                  zIndex: 10,
              })
          bounds.extend(marker.position)
          marker.pin_id = n.REFERENCE_ID
          marker.label = n.TITLE

          marker.addListener('click', (event) => {
						self.pins.forEach((pin) => {
							pin.setAnimation(null)
						})
						self.setState({
							prev_listing: self.state.current_listing,
						}, () => {
							self.setState({
								current_listing: n,
								next_listing: listings[i+1]
							})
						})
            self.props.setCurrentListing(n)
						marker.setAnimation(google.maps.Animation.BOUNCE)

            // self.setState({
            //   preview_visible: true
            // })
            // self.bufferPin = marker
            self.props.setCurrentMapLocationToRedux(marker)

						// let bounds = new google.maps.LatLngBounds()
						self.map.setCenter(marker.position)
						// bounds.extend(marker.position)
						// bounds.extend(new google.maps.LatLng(this.props.flag_location.lat, this.props.flag_location.lng))
						// self.map.fitBounds(bounds)
					})

  				// save the pins
          // console.log(marker)
  				if (marker) {
  					marker.setMap(map)
						markers.push(marker)
  				}

      })

			console.log('SAVING MARKERS: ', markers)
			this.pins = markers
			this.props.saveMapListingsToRedux(markers)

      if (map) {
        map.fitBounds(bounds)
				this.map = map
      }


      const dest = this.props.prefs.LOCATION.DESTINATION_GEOPOINT.split(',')
      this.props.setCurrentFlagPin({
        coords: {
          lat: dest[0],
          lng: dest[1],
        },
        map: map,
      })
    }
  }

	render() {
		return (
			<div id='OnlyMapHunting' style={comStyles().container}>
				<HeatMap
          preview={true}
          fullscreenSearch={true}
          listings={this.props.all_listings}
					current_listing={this.props.current_listing}
        />
			</div>
		)
	}
}

// defines the types of variables in this.props
OnlyMapHunting.propTypes = {
	history: PropTypes.object.isRequired,
  all_listings: PropTypes.array.isRequired,
	current_listing: PropTypes.object.isRequired,
	prefs: PropTypes.object,
	map_loaded: PropTypes.bool.isRequired,
	setCurrentFlagPin: PropTypes.func.isRequired,
	setCurrentClickedLocation: PropTypes.func.isRequired,
	setCurrentMapLocationToRedux: PropTypes.func.isRequired,
	setCurrentListing: PropTypes.func.isRequired,
	saveMapListingsToRedux: PropTypes.func.isRequired,
	map_listings: PropTypes.array.isRequired,
	flag_location: PropTypes.object.isRequired,
	current_location: PropTypes.object.isRequired,
}

// for all optional props, define a default value
OnlyMapHunting.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(OnlyMapHunting)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    all_listings: redux.listings.all_listings,
		prefs: redux.prefs,
		current_listing: redux.listings.current_listing,
		map_loaded: redux.map.map_loaded,
		map_listings: redux.map.listings,
		flag_location: redux.map.flag_location,
		current_location: redux.map.current_location,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		setCurrentFlagPin,
		setCurrentClickedLocation,
		setCurrentMapLocationToRedux,
		setCurrentListing,
		saveMapListingsToRedux,
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
