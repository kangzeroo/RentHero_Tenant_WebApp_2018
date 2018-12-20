// Compt for copying as a HeatMapHunting
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import Ionicon from 'react-ionicons'
import {
  Icon,
} from 'antd-mobile'
import PolarGraph from './PolarGraph'
import { calculateNearbyStats } from '../../api/analytics/analytics_api'
import { triggerDrawerNav } from '../../actions/app/app_actions'
import { getHeatMapDist } from '../../api/analytics/analytics_api'
import { pinAlreadyPlaced } from '../../api/map/map_api'
import { setCurrentListing } from '../../actions/listings/listings_actions'

class HeatMapHunting extends Component {


  constructor() {
    super()
    this.state = {
      deletablePolygon: false,
      ads: [],
      heat_points: [],
      clicked_point: null,
      nearby_stats: {
        matches: [],
        avg_price_per_bed: 0,
      },
      show_filter: true,
    }
    this.map = null
    this.heatMap = null
    this.current_polygon = null


    this.pins = []
    this.indicatorPin = null
    this.bufferPin = null
    this.flagPin = null

    this.red_map_pin = 'https://s3.amazonaws.com/rentburrow-static-assets/Icons/red-dot.png'
		this.blue_map_pin = 'https://s3.amazonaws.com/rentburrow-static-assets/Icons/blue-dot.png'
    this.flag_map_pin = 'https://s3.amazonaws.com/rentburrow-static-assets/Icons/flag-green-icon2.png'

    this.refreshPins.bind(this)
  }

  componentWillMount() {
    console.log(this.props.prefs.LOCATION.DESTINATION_GEOPOINT.split(','))

    console.log(this.pins)

    getHeatMapDist({
      // max_beds: this.props.prefs.max_beds,
      // max_budget: this.props.prefs.max_budget,
      destination: {
        address: this.props.prefs.LOCATION.DESTINATION_ADDRESS,
        // place_id: this.props.prefs.destination.place_id,
        // commute_mode: this.props.prefs.destination.commute_mode,
        gps: { lat: this.props.prefs.LOCATION.DESTINATION_GEOPOINT.split(',')[0], lng: this.props.prefs.LOCATION.DESTINATION_GEOPOINT.split(',')[1] }
      }
    }).then((data) => {
      console.log(data)
      this.setState({
        ads: data,
        heat_points: data.map((d) => {
          return new google.maps.LatLng(d.GPS.lat, d.GPS.lng)
        })
      }, () => this.loadHeatMap())
    }).catch((err) => {
      console.log(err)
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.listings !== this.props.listings) {
      this.refreshPins(prevProps, this.props)
    }
    // if (prevProps.current_listing !== this.props.current_listing) {
    //   this.initializeCurrentListing(this.props.current_listing)
    // }
    // this.prevCenterCoords = this.props.current_gps_center
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.current_listing !== nextProps.current_listing) {
      this.initializeCurrentListing(nextProps.current_listing)
    }
  }

  initializeCurrentListing(current_listing) {
    console.log('NEW LISTING BRUHHH')
    console.log(this.bufferPin)
    if (this.bufferPin) {
      this.destroyBlueIndicatorPin()
      this.addBackBufferPin()
    } else {
      for (let i = 0; i < this.pins.length; i++) {
        if (this.pins[i].pin_id === current_listing.REFERENCE_ID) {
          console.log(this.pins[i])
          this.bufferPin = this.pins[i]
          this.createBlueIndicatorPin(this.pins[i])
        }
      }
    }
  }


  refreshPins(prevProps, { listings }) {
    console.log(listings)
    let bounds = new google.maps.LatLngBounds()
    let self = this
    if (listings && listings.length > 0) {
      listings.forEach((n, i) => {
        if (!pinAlreadyPlaced(n, self.pins)) {
          let marker
          marker = new google.maps.Marker({
                  position: new google.maps.LatLng(n.GPS.lat, n.GPS.lng),
                  pin_type: 'listing',
                  icon: this.red_map_pin,
                  zIndex: 50,
              })
          bounds.extend(marker.position)
          marker.pin_id = n.REFERENCE_ID
          marker.label = n.TITLE

          marker.addListener('click', (event) => {
            if (self.bufferPin) {
              this.addBackBufferPin()
            }

            self.props.setListing(n, `/matches/${n.REFERENCE_ID}`)
            self.bufferPin = marker
            this.createBlueIndicatorPin(marker)
          })

  				// save the pins
          // console.log(marker)
  				if (marker) {
  					marker.setMap(self.map)
  					self.pins.push(marker)
            console.log(self.pins)
  				}
        }
      })

      self.map.fitBounds(bounds)

      if (self.props.current_listing && self.props.current_listing.REFERENCE_ID) {
        self.initializeCurrentListing(self.props.current_listing)
      }

      if (this.props.showFlagPin) {
        const flagDest = {
          lat: this.props.prefs.LOCATION.DESTINATION_GEOPOINT.split(',')[0],
          lng: this.props.prefs.LOCATION.DESTINATION_GEOPOINT.split(',')[1],
        }
        this.createFlagPin(flagDest)
      }
    }
  }

  temporaryRemoveRedPin(pin) {
    pin.setMap(null)
    this.bufferPin = pin
  }

  addBackBufferPin() {
    this.bufferPin.setMap(this.map)
    this.bufferPin = null
  }

	createBlueIndicatorPin(pin) {
    this.temporaryRemoveRedPin(pin)
		this.destroyBlueIndicatorPin()
		let indicatorPin = new google.maps.Marker({
				position: pin.position,
				pin_type: pin.pin_type,
				icon: this.blue_map_pin,
				zIndex: 12,
				pin_id: pin.pin_id,
		})
		indicatorPin.setAnimation(google.maps.Animation.BOUNCE)
		indicatorPin.addListener('click', (event) => {
			// marker.infowindow.open(self.state.mapTarget, marker)
			// this.props.selectPinToRedux(indicatorPin.pin_id)
			// const b = locallyFindBuildingById(indicatorPin.pin_id, this.props.listOfResults)
			// this.props.selectPopupBuilding(b)
			// setTimeout(() => {
			// 	marker.infowindow.close()
			// }, 2000)

		})
    this.indicatorPin = indicatorPin
    this.indicatorPin.setMap(this.map)

		// this.setState({
		// 	indicatorPin: indicatorPin
		// }, () => this.state.indicatorPin.setMap(this.map))
	}

	destroyBlueIndicatorPin() {
		if (this.indicatorPin) {
			// get rid of any old bouncing blue pins
			this.indicatorPin.setMap(null)
      this.indicatorPin = null
			// this.setState({
			// 	indicatorPin: null
			// })
		}
	}

  createFlagPin(coords) {
    console.log('FLAG PIN: ', coords)
    let flagPin = new google.maps.Marker({
				position: new google.maps.LatLng(coords.lat, coords.lng),
				pin_type: 'listing',
				icon: this.flag_map_pin,
				zIndex: 55,
				pin_id: 'flag',
		})

    console.log(flagPin)

		flagPin.addListener('click', (event) => {
			// marker.infowindow.open(self.state.mapTarget, marker)
			// this.props.selectPinToRedux(indicatorPin.pin_id)
			// const b = locallyFindBuildingById(indicatorPin.pin_id, this.props.listOfResults)
			// this.props.selectPopupBuilding(b)
			// setTimeout(() => {
			// 	marker.infowindow.close()
			// }, 2000)

		})
    this.flagPin = flagPin
    this.flagPin.setMap(this.map)
  }

  loadHeatMap() {
    console.log(this.props.prefs.LOCATION.DESTINATION_GEOPOINT.split(','))
    const self = this
    // INITIATE GOOGLE MAPS
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: { lat: parseFloat(this.props.prefs.LOCATION.DESTINATION_GEOPOINT.split(',')[0]), lng: parseFloat(this.props.prefs.LOCATION.DESTINATION_GEOPOINT.split(',')[1]) },
      styles: mapStyles,
      disableDefaultUI: true,
      clickableIcons: false,
      mapTypeControl: true,
      mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_CENTER
      },
      streetViewControl: true,
      streetViewControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT
      }
    });
    // SETUP POLYGON DRAWING
    var drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP,
        drawingModes: ['polygon']
      },
      polygonOptions: {
        fillColor: '#529FE2',
        strokeColor: '#117bc7',
      }
    })
    drawingManager.setMap(this.map)
    // POLYGON DRAWN
    google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
      drawingManager.setDrawingMode(null)
      console.log('POLYGON PATHS: ', polygon.getPaths())
      if (self.current_polygon) {
        self.current_polygon.setMap(null)
      }
      polygon.setOptions({ fillColor: '#F06767', strokeColor: '#F06767' })
      self.current_polygon = polygon
      self.setState({
        deletablePolygon: true,
        clicked_point: null,
        nearby_stats: {},
        show_filter: false,
      })
      // POLYGON CLICKED
      google.maps.event.addListener(polygon, 'click', function(e) {
        polygon.setOptions({ fillColor: '#F06767', strokeColor: '#F06767' })
        self.setState({
          deletablePolygon: true,
          clicked_point: null,
          nearby_stats: {},
          show_filter: false,
        })
      })
    });
    // OVERLAY A HEAT MAP
    this.heatmap = new google.maps.visualization.HeatmapLayer({
      data: this.state.heat_points,
      map: this.map
    });
    // HEAT MAP ONCLICK
    this.map.addListener('click', function(e) {
      const point = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      }
      if (self.current_polygon) {
        self.current_polygon.setOptions({ fillColor: '#529FE2', strokeColor: '#117bc7' })
      }
      const nearby_stats = calculateNearbyStats(point, self.state.ads, 1000)
      self.setState({
        clicked_point: point,
        nearby_stats: nearby_stats,
        deletablePolygon: false,
        show_filter: true,
      })

      self.refreshPins(self.props, self.props)
    })
  }

  deletePolygon(polygon) {
    polygon.setMap(null)
    this.current_polygon = null
    this.setState({
      deletablePolygon: false,
      show_filter: true,
    })
  }

  renderActionBar() {
    if (this.state.show_filter) {
      return (
        <div style={searchStyles().searchDiv}>
          <div onClick={() => this.props.history.push('/matches')} style={searchStyles().filterSearch}>
            &nbsp;
            <Ionicon icon="md-search" color='white' fontSize='2rem' />
            <div style={{ width: '100%', textAlign: 'center' }}>EXPLORE</div>
          </div>
          {/*<div style={searchStyles().playSearch}>
            <Ionicon icon="md-play" color='white' fontSize='2rem' />
          </div>*/}
        </div>
      )
    } else if (this.state.deletablePolygon && this.current_polygon) {
      return (
        <div style={searchStyles().searchDiv}>
          <div style={searchStyles().applyFilter}>
            <div style={{ width: '100%', textAlign: 'center' }}>APPLY FILTER</div>
          </div>
          <div onClick={() => this.deletePolygon(this.current_polygon)} style={searchStyles().deleteFilter}>
            <Ionicon icon="md-trash" color='white' fontSize='2rem' />
          </div>
        </div>
      )
    } else {
      return null
    }
  }

	render() {
		return (
			<div id='HeatMapHunting' style={comStyles().container}>
        {/*<div onClick={() => this.props.triggerDrawerNav(true)} style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 4, color: 'white', cursor: 'pointer' }}>
          <Ionicon icon="md-menu" color='#117bc7b3' fontSize='2rem' />
        </div>*/}
        <div id="map" style={comStyles().map}></div>
        {
          this.state.nearby_stats.matches && this.state.nearby_stats.matches.length
          ?
          <div style={statStyles().popup}>
            <div style={statStyles().pop_container}>
              <div onClick={() => this.setState({ nearby_stats: {} })} style={comStyles().exit}>X</div>
              <PolarGraph
                ads={this.state.nearby_stats.matches}
                style={{ width: '400px', height: 'auto' }}
              />
              <span style={{ fontSize: '1rem', color: 'black' }}>
                Average
                <span style={{ fontSize: '2rem', color: 'black' }}> ${this.state.nearby_stats.avg_price_per_bed} </span>
                per Room
              </span>
              <span style={{ fontSize: '1rem', color: 'black' }}>
                From {this.state.nearby_stats.matches.length} recent rentals
              </span>
            </div>
          </div>
          :
          null //this.renderActionBar()
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
  listings: PropTypes.array,            // passed in
  current_listing: PropTypes.object,    // passed in
  setCurrentListing: PropTypes.func.isRequired,
  setListing: PropTypes.func,           // passed in
  showFlagPin: PropTypes.bool,            // passed in
}

// for all optional props, define a default value
HeatMapHunting.defaultProps = {
  listings: [],
  current_listing: {},
  setListing: () => {},
  showFlagPin: false,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(HeatMapHunting)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    prefs: redux.prefs
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    triggerDrawerNav,
    setCurrentListing,
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
      height: '100%',
      position: 'relative',
		},
    map: {
      width: '100%',
      height: '100%'
    },
    exit: {
      position: 'absolute',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      top: '-10px',
      right: '0px',
      width: '30px',
      height: '30px',
      backgroundColor: 'black',
      color: 'white',
      borderRadius: '50%'
    }
	}
}

const statStyles = () => {
  return {
    popup: {
      width: '95%',
      height: '40vh',
      minHeight: '300px',
      backgroundColor: 'white',
      position: 'absolute',
      bottom: '0px',
      left: '2.5%',
      borderRadius: '20px 20px 0px 0px',
    },
    pop_container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      color: 'white',
      position: 'relative',
      width: '100%',
      height: '100%'
    }
  }
}

const searchStyles = () => {
  return {
    searchDiv: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-end',
      alignSelf: 'center',
      width: '80vw',
      maxWidth: '500px',
      position: 'absolute',
      bottom: '5vh',
    },
    filterSearch: {
        borderRadius: '10px',
        color: 'white',
        fontSize: '1.5rem',
        backgroundColor: 'rgb(17, 123, 199, 0.7)',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: '0px 5px',
        padding: '10px',
        width: '100%',
        cursor: 'pointer',
    },
    applyFilter: {
        borderRadius: '10px',
        color: 'white',
        fontSize: '1.5rem',
        backgroundColor: '#F06767',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: '0px 5px',
        padding: '10px',
        width: '100%',
        cursor: 'pointer',
    },
    playSearch: {
        borderRadius: '50%',
        color: 'white',
        fontSize: '2rem',
        backgroundColor: 'rgb(17, 123, 199, 0.7)',
        margin: '0px 5px',
        padding: '10px 10px 10px 12px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteFilter: {
        borderRadius: '50%',
        color: 'white',
        fontSize: '2rem',
        backgroundColor: '#F06767',
        margin: '0px 5px',
        padding: '10px 10px 10px 10px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
  }
}

const mapStyles = [
				{
					"stylers": [
							{
									"hue": "#33A3F4"
							},
							{
									"saturation": 0
							}
					]
				},
				{
					"featureType": "road",
					"elementType": "geometry",
					"stylers": [
							{
									"lightness": 100
							},
							{
									"visibility": "simplified"
							}
					]
				},

				]

// const mapStyles = [
//   {
//     "elementType": "geometry",
//     "stylers": [
//       {
//         "color": "#f5f5f5"
//       }
//     ]
//   },
//   {
//     "elementType": "labels.icon",
//     "stylers": [
//       {
//         "visibility": "off"
//       }
//     ]
//   },
//   {
//     "elementType": "labels.text.fill",
//     "stylers": [
//       {
//         "color": "#616161"
//       }
//     ]
//   },
//   {
//     "elementType": "labels.text.stroke",
//     "stylers": [
//       {
//         "color": "#f5f5f5"
//       }
//     ]
//   },
//   {
//     "featureType": "administrative.land_parcel",
//     "elementType": "labels.text.fill",
//     "stylers": [
//       {
//         "color": "#bdbdbd"
//       }
//     ]
//   },
//   {
//     "featureType": "poi",
//     "elementType": "geometry",
//     "stylers": [
//       {
//         "color": "#eeeeee"
//       }
//     ]
//   },
//   {
//     "featureType": "poi",
//     "elementType": "labels.text.fill",
//     "stylers": [
//       {
//         "color": "#757575"
//       }
//     ]
//   },
//   {
//     "featureType": "poi.park",
//     "elementType": "geometry",
//     "stylers": [
//       {
//         "color": "#e5e5e5"
//       }
//     ]
//   },
//   {
//     "featureType": "poi.park",
//     "elementType": "labels.text.fill",
//     "stylers": [
//       {
//         "color": "#9e9e9e"
//       }
//     ]
//   },
//   {
//     "featureType": "road",
//     "elementType": "geometry",
//     "stylers": [
//       {
//         "color": "#ffffff"
//       }
//     ]
//   },
//   {
//     "featureType": "road.arterial",
//     "elementType": "labels.text.fill",
//     "stylers": [
//       {
//         "color": "#757575"
//       }
//     ]
//   },
//   {
//     "featureType": "road.highway",
//     "elementType": "geometry",
//     "stylers": [
//       {
//         "color": "#dadada"
//       }
//     ]
//   },
//   {
//     "featureType": "road.highway",
//     "elementType": "labels.text.fill",
//     "stylers": [
//       {
//         "color": "#616161"
//       }
//     ]
//   },
//   {
//     "featureType": "road.local",
//     "elementType": "labels.text.fill",
//     "stylers": [
//       {
//         "color": "#9e9e9e"
//       }
//     ]
//   },
//   {
//     "featureType": "transit.line",
//     "elementType": "geometry",
//     "stylers": [
//       {
//         "color": "#e5e5e5"
//       }
//     ]
//   },
//   {
//     "featureType": "transit.station",
//     "elementType": "geometry",
//     "stylers": [
//       {
//         "color": "#eeeeee"
//       }
//     ]
//   },
//   {
//     "featureType": "water",
//     "elementType": "geometry",
//     "stylers": [
//       {
//         "color": "#c9c9c9"
//       }
//     ]
//   },
//   {
//     "featureType": "water",
//     "elementType": "labels.text.fill",
//     "stylers": [
//       {
//         "color": "#9e9e9e"
//       }
//     ]
//   }
// ]
