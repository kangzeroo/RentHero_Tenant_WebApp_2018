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
    }
    this.directionsDisplay = null
  }

  componentDidMount() {
    this.grabDirections(this.props.commute_mode)
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
    if ((prevProps.card_section_shown !== this.props.card_section_shown && this.props.card_section_shown === 'commute') || (prevProps.current_listing !== this.props.current_listing)) {
      this.renderDirections()
    }
    if ((prevProps.commute_mode !== this.props.commute_mode) || (prevProps.current_listing !== this.props.current_listing)) {
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

  grabDirections(commute_mode) {
    const self = this
    const p = new Promise((res, rej) => {
  		const directionsService = new google.maps.DirectionsService
  		directionsService.route({
  			origin: this.props.current_listing.ADDRESS,
  			destination: this.props.destination,
  			travelMode: commute_mode.toUpperCase()
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

  setCommuteMode(mode) {
    this.props.changeCommuteMode(mode)
  }

	render() {
    if (this.props.card_section_shown === 'commute') {
  		return (
  			<div id='CommuteMap' style={comStyles().container}>
          <div id='controls' style={comStyles().controls}>
            <div id='options' style={comStyles().options}>
              <Button onClick={() => this.setCommuteMode('DRIVING')} type={this.props.commute_mode.toUpperCase() === 'DRIVING' ? 'primary' : 'default'} inline size="small" style={{ margin: '3px', padding: '0px 15px', borderRadius: '10px' }}>
                {
                  this.props.commute_mode.toUpperCase() === 'DRIVING'
                  ?
                  `${(this.state.commute_state.commute_time/60).toFixed(0)} MINS DRIVING`
                  :
                  'DRIVING'
                }
              </Button>
              <Button onClick={() => this.setCommuteMode('TRANSIT')} type={this.props.commute_mode.toUpperCase() === 'TRANSIT' ? 'primary' : 'default'} inline size="small" style={{ margin: '3px', padding: '0px 15px', borderRadius: '10px' }}>
                {
                  this.props.commute_mode.toUpperCase() === 'TRANSIT'
                  ?
                  `${(this.state.commute_state.commute_time/60).toFixed(0)} MINS TRANSIT`
                  :
                  'TRANSIT'
                }
              </Button>
              <Button onClick={() => this.setCommuteMode('WALKING')} type={this.props.commute_mode.toUpperCase() === 'WALKING' ? 'primary' : 'default'} inline size="small" style={{ margin: '3px', padding: '0px 15px', borderRadius: '10px' }}>
                {
                  this.props.commute_mode.toUpperCase() === 'WALKING'
                  ?
                  `${(this.state.commute_state.commute_time/60).toFixed(0)} MINS WALKING`
                  :
                  'WALKING'
                }
              </Button>
              <Button onClick={() => this.setCommuteMode('BICYCLING')} type={this.props.commute_mode.toUpperCase() === 'BICYCLING' ? 'primary' : 'default'} inline size="small" style={{ margin: '3px', padding: '0px 15px', borderRadius: '10px' }}>
                {
                  this.props.commute_mode.toUpperCase() === 'BICYCLING'
                  ?
                  `${(this.state.commute_state.commute_time/60).toFixed(0)} MINS BICYCLING`
                  :
                  'BICYCLING'
                }
              </Button>
            </div>
          </div>
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
	destination: PropTypes.string.isRequired,           // passed in
	commute_mode: PropTypes.string.isRequired,      // passed in
	current_listing: PropTypes.object.isRequired,       // passed in
  card_section_shown: PropTypes.string.isRequired,    // passed in
}

// for all optional props, define a default value
CommuteMap.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(CommuteMap)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

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
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: '100px',
      textAlign: 'center',
    },
		map: {
			height: '400px',
		},
	}
}
