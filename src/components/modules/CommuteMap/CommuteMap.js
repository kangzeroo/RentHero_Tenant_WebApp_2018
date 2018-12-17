// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import { BLUE_PIN, RED_PIN, GREY_PIN } from '../../../assets/map_pins'
import {
  changeCommuteMode,
} from '../../../actions/listings/listings_actions'
import {
  Button,
  Select,
} from 'antd'


class CommuteMap extends Component {

  constructor() {
    super()
    this.state = {
      directions: null,
			commute_state: {
				commute_time: 0,
				commute_distance: 0,
			},
      address_components: [],
      address_lat: 0,
      address_lng: 0,
      address_place_id: '',
      address: '',
      commute_mode: '',
      arrival_time: new Date(),
    }
    this.directionsDisplay = null
  }

  componentDidMount() {
    this.grabDirections()
      .then((directions) => {
        this.setState({
          directions: directions
        })
        if (this.props.card_section_shown === 'commute') {
          this.renderDirections()
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.props)
    if ((prevProps.current_listing !== this.props.current_listing || prevProps.card_section_shown !== this.props.card_section_shown) && this.props.card_section_shown === 'commute') {
      this.grabDirections(this.props.commute_mode)
        .then((directions) => {
  				this.setState({
            directions: directions
          })
          this.renderDirections(directions)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  grabDirections() {
    const self = this
    const p = new Promise((res, rej) => {
      this.setState({
        address: this.props.prefs.LOCATION.DESTINATION_ADDRESS,
        commute_mode: 'TRANSIT',
        arrival_time: this.props.prefs.LOCATION.DESTINATION_ARRIVAL,
      }, () => {
    		const directionsService = new google.maps.DirectionsService
    		directionsService.route({
    			origin: this.props.current_listing.ADDRESS,
    			destination: this.state.address,
    			travelMode: this.state.commute_mode
    		}, function(response, status) {
    			if (status === 'OK') {
    				self.props.setCommuteState({
    					commute_time: response.routes[0].legs.reduce((acc, curr) => acc + curr.duration.value, 0),
    					commute_distance: response.routes[0].legs.reduce((acc, curr) => acc + curr.distance.value, 0),
    				})
            self.setState({
              commute_state: {
      					commute_time: response.routes[0].legs.reduce((acc, curr) => acc + curr.duration.value, 0),
      					commute_distance: response.routes[0].legs.reduce((acc, curr) => acc + curr.distance.value, 0),
              }
            })
    				console.log('-------> Got directions')
    				console.log(response)
            res(response)
    			} else {
            rej(status)
    				window.alert('Directions request failed due to ' + status);
    			}
    	 })
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

  updateDestinationCommute() {

  }

	render() {
    if (this.props.card_section_shown === 'commute') {
  		return (
  			<div id='CommuteMap' style={comStyles().container}>
          {/*<div id='controls' style={comStyles().controls}>
            <Select
              size='large'
              style={{ width: '30%', }}
              onChange={(a) => this.setState({ commute_mode: mode })}
              value={this.state.commute_mode}
            >
              <Select.Option key='transit' value='TRANSIT'>Transit</Select.Option>
              <Select.Option key='driving' value='DRIVING'>Driving</Select.Option>
              <Select.Option key='walking' value='WALKING'>Walking</Select.Option>
              <Select.Option key='bicycling' value='BICYCLING'>Bicycling</Select.Option>
            </Select>
            <input
              id='destination_address'
              value={this.state.address}
              onChange={(e) => this.setState({ address: e.target.value })}
              style={comStyles().address_input}
            />
            <div style={{ width: '20%' }}>Arrive By</div>
            <i onClick={() => this.updateDestinationCommute()} className='ion-android-send' style={{ fontSize: '1.6rem' }} />
          </div>*/}
  				<div id='map' style={comStyles().map}></div>
  			</div>
  		)
    } else {
      return null
    }
	}
}

// defines the types of variables in this.props
CommuteMap.propTypes = {
	history: PropTypes.object.isRequired,
  setCommuteState: PropTypes.func.isRequired,       // passed in
	current_listing: PropTypes.object.isRequired,       // passed in
  card_section_shown: PropTypes.string.isRequired,    // passed in
  prefs: PropTypes.object.isRequired,
}

// for all optional props, define a default value
CommuteMap.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(CommuteMap)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    prefs: redux.prefs,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    changeCommuteMode,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
		},
    options: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    controls: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100px',
      textAlign: 'center',
    },
		map: {
			height: '250px',
		},
    address_input: {
      padding: '10px',
      backgroundColor: 'rgba(0,0,0,0.05)',
      border: '0px solid black',
      margin: '0px 10px 0px 10px',
    }
	}
}
