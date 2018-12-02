// Compt for copying as a HeatMapHunting
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Icon,
} from 'antd-mobile'
import { triggerDrawerNav } from '../../actions/app/app_actions'
import { getHeatMapDist } from '../../api/analytics/analytics_api'

class HeatMapHunting extends Component {

  constructor() {
    super()
    this.state = {
      heat_points: [],
      clicked_point: null
    }
    this.map = null
    this.heatMap = null
  }

  componentWillMount() {
    getHeatMapDist({
      max_beds: this.props.prefs.max_beds,
      max_budget: this.props.prefs.max_budget,
      destination: {
        address: this.props.prefs.destination.address,
        place_id: this.props.prefs.destination.place_id,
        commute_mode: this.props.prefs.destination.commute_mode,
        gps: { lat: this.props.prefs.destination.gps.lat, lng: this.props.prefs.destination.gps.lng }
      }
    }).then((data) => {
      console.log(data)
      this.setState({
        heat_points: data.map((d) => {
          return new google.maps.LatLng(d.GPS.lat, d.GPS.lng)
        })
      }, () => this.loadHeatMap())
    }).catch((err) => {
      console.log(err)
    })
  }

  loadHeatMap() {
    const self = this
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: { lat: parseFloat(this.props.prefs.destination.gps.lat), lng: parseFloat(this.props.prefs.destination.gps.lng) },
      styles: mapStyles,
      disableDefaultUI: true,
    });
    this.heatmap = new google.maps.visualization.HeatmapLayer({
      data: this.state.heat_points,
      map: this.map
    });
    this.map.addListener('click', function(e) {
      console.log('---- map clicked!')
      console.log(e)
      console.log(e.latLng.lat(), e.latLng.lng())
      // self.setState({
      //   clicked_point: true
      // })
    });
  }

	render() {
		return (
			<div id='HeatMapHunting' style={comStyles().container}>
        <div onClick={() => this.props.triggerDrawerNav(true)} style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 4, color: 'white' }}>
          <Icon type='ellipsis' size='lg' />
        </div>
        <div id="map" style={comStyles().map}></div>
        {
          this.state.clicked_point
          ?
          <div style={comStyles().popup}>
            <span onClick={() => this.setState({ clicked_point: false })}>exit</span>
          </div>
          :
          null
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
HeatMapHunting.propTypes = {
	history: PropTypes.object.isRequired,
	triggerDrawerNav: PropTypes.func.isRequired,
  prefs: PropTypes.object.isRequired,
}

// for all optional props, define a default value
HeatMapHunting.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(HeatMapHunting)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    prefs: redux.tenant.prefs
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    triggerDrawerNav,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
			backgroundColor: '#f5f5f9',
      height: '100vh',
      position: 'relative',
		},
    map: {
      width: '100vw',
      height: '100vh'
    },
    popup: {
      width: '100vw',
      height: '25vh',
      backgroundColor: 'black',
      position: 'absolute',
      bottom: '0px',
    }
	}
}

const mapStyles = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
]
