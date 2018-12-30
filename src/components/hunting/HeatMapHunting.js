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
  Button,
} from 'antd'
import {  } from 'antd'
import PolarGraph from './PolarGraph'
import FilterPopup from '../filter/FilterPopup'
import { calculateNearbyStats } from '../../api/analytics/analytics_api'
import { triggerDrawerNav } from '../../actions/app/app_actions'
import { getHeatMapDist } from '../../api/analytics/analytics_api'
import { pinAlreadyPlaced } from '../../api/map/map_api'
import { setCurrentListing } from '../../actions/listings/listings_actions'
import { setCurrentMapLocationToRedux, setMapLoadedToRedux, setMainMapToRedux, } from '../../actions/map/map_actions'
import { BLUE_PIN, RED_PIN, GREY_PIN, FLAG_PIN } from '../../assets/map_pins'

class HeatMapHunting extends Component {


  constructor() {
    super()
    this.state = {
      preview_visible: false,
      deletablePolygon: false,
      ads: [],
      heat_points: [],
      clicked_point: null,
      nearby_stats: {
        matches: [],
        avg_price_per_bed: 0,
      },
      show_filter: false,
    }
    this.map = null
    this.heatMap = null
    this.current_polygon = null


    this.pins = []
    this.indicatorPin = null
    this.bufferPin = null
    this.flagPin = null

    this.red_map_pin = RED_PIN
		this.blue_map_pin = BLUE_PIN
    this.flag_map_pin = FLAG_PIN

    // this.refreshPins.bind(this)
  }

  componentWillMount() {
    console.log(this.props.prefs)


  }

  componentDidMount() {
    console.log(this.props.prefs.LOCATION.DESTINATION_GEOPOINT.split(','))

    console.log(this.pins, this.props)

    getHeatMapDist(this.props.prefs).then((data) => {
      console.log(data)
      this.setState({
        ads: data,
        heat_points: data.map((d) => {
          return new google.maps.LatLng(d.GPS.lat, d.GPS.lng)
        })
      }, () => {
        this.loadHeatMap()
        // this.refreshPins(this.props, this.props)
        this.props.setMapLoadedToRedux(true)
        console.log('----> MAP IS: ', this.map)
        // this.props.setMainMapToRedux(this.map)
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.listings !== this.props.listings) {
      // this.refreshPins(prevProps, this.props)
    }
    // if (prevProps.current_listing !== this.props.current_listing) {
    //   this.initializeCurrentListing(this.props.current_listing)
    // }
    // this.prevCenterCoords = this.props.current_gps_center
  }

  // componentWillReceiveProps(nextProps) {
  //   if (this.props.current_listing !== nextProps.current_listing) {
  //     this.initializeCurrentListing(nextProps.current_listing)
  //   }
  // }
  //
  // initializeCurrentListing(current_listing) {
  //   console.log('NEW LISTING BRUHHH')
  //   console.log(this.map)
  //   console.log(this.bufferPin)
  //   if (this.bufferPin) {
  //     this.destroyBlueIndicatorPin()
  //     this.addBackBufferPin()
  //   } else {
  //     for (let i = 0; i < this.pins.length; i++) {
  //       if (this.pins[i].pin_id === current_listing.REFERENCE_ID) {
  //         console.log(this.pins[i])
  //         this.bufferPin = this.pins[i]
  //         this.props.setCurrentMapLocationToRedux(this.pins[i])
  //
  //         this.createBlueIndicatorPin(this.pins[i])
  //       }
  //     }
  //   }
  // }


  refreshPins(prevProps, { listings }) {
    console.log(listings)
    let bounds = new google.maps.LatLngBounds()
    let self = this
    if (listings && listings.length > 0) {
      listings.forEach((n, i) => {
        if (!pinAlreadyPlaced(n, self.pins)) {
          console.log('new pin')
          let marker
          marker = new google.maps.Marker({
                  position: new google.maps.LatLng(n.GPS.lat, n.GPS.lng),
                  pin_type: 'listing',
                  icon: this.red_map_pin,
                  zIndex: 10,
              })
          bounds.extend(marker.position)
          marker.pin_id = n.REFERENCE_ID
          marker.label = n.TITLE

          marker.addListener('click', (event) => {
            if (self.bufferPin) {
              this.addBackBufferPin()
            }
            self.props.setCurrentListing(n)
            self.props.setListing(n, `/matches/${n.REFERENCE_ID}`)
            self.setState({
              preview_visible: true
            })
            self.bufferPin = marker
            self.props.setCurrentMapLocationToRedux(marker)

            // self.createBlueIndicatorPin(marker)
          })

  				// save the pins
          // console.log(marker)
  				if (marker) {
  					marker.setMap(self.map)
  					self.pins.push(marker)
  				}
        }
      })

      if (self.map) {
        self.map.fitBounds(bounds)
      }

      if (self.props.current_listing && self.props.current_listing.REFERENCE_ID) {
        self.initializeCurrentListing(self.props.current_listing)
      }

      if (this.props.showFlagPin) {
        const flagDest = {
          lat: this.props.prefs.LOCATION.DESTINATION_GEOPOINT.split(',')[0],
          lng: this.props.prefs.LOCATION.DESTINATION_GEOPOINT.split(',')[1],
        }
        // this.createFlagPin(flagDest)
      }
    }
  }

  // temporaryRemoveRedPin(pin) {
  //   console.log('TEMPORARY REMOVE RED PIN')
  //   pin.setMap(null)
  //   this.bufferPin = pin
  // }
  //
  // addBackBufferPin() {
  //   this.bufferPin.setMap(this.map)
  //   this.bufferPin = null
  // }
  //
	// createBlueIndicatorPin(pin) {
  //   console.log('CREATE BLUE INDICATOR: ', pin)
  //   this.temporaryRemoveRedPin(pin)
	// 	this.destroyBlueIndicatorPin()
	// 	let indicatorPin = new google.maps.Marker({
	// 			position: pin.position,
	// 			pin_type: pin.pin_type,
	// 			icon: this.blue_map_pin,
	// 			zIndex: 12,
	// 			pin_id: pin.pin_id,
	// 	})
	// 	indicatorPin.setAnimation(google.maps.Animation.BOUNCE)
	// 	indicatorPin.addListener('click', (event) => {
	// 		// marker.infowindow.open(self.state.mapTarget, marker)
	// 		// this.props.selectPinToRedux(indicatorPin.pin_id)
	// 		// const b = locallyFindBuildingById(indicatorPin.pin_id, this.props.listOfResults)
	// 		// this.props.selectPopupBuilding(b)
	// 		// setTimeout(() => {
	// 		// 	marker.infowindow.close()
	// 		// }, 2000)
  //
	// 	})
  //   this.indicatorPin = indicatorPin
  //   this.indicatorPin.setMap(this.map)
  //
	// 	// this.setState({
	// 	// 	indicatorPin: indicatorPin
	// 	// }, () => this.state.indicatorPin.setMap(this.map))
	// }
  //
	// destroyBlueIndicatorPin() {
	// 	if (this.indicatorPin) {
	// 		// get rid of any old bouncing blue pins
	// 		this.indicatorPin.setMap(null)
  //     this.indicatorPin = null
	// 		// this.setState({
	// 		// 	indicatorPin: null
	// 		// })
	// 	}
	// }

  // createFlagPin(coords) {
  //   console.log('FLAG PIN: ', coords)
  //   let flagPin = new google.maps.Marker({
	// 			position: new google.maps.LatLng(coords.lat, coords.lng),
	// 			pin_type: 'listing',
	// 			icon: this.flag_map_pin,
	// 			zIndex: 55,
	// 			pin_id: 'flag',
	// 	})
  //
  //   console.log(flagPin)
  //
	// 	flagPin.addListener('click', (event) => {
	// 		// marker.infowindow.open(self.state.mapTarget, marker)
	// 		// this.props.selectPinToRedux(indicatorPin.pin_id)
	// 		// const b = locallyFindBuildingById(indicatorPin.pin_id, this.props.listOfResults)
	// 		// this.props.selectPopupBuilding(b)
	// 		// setTimeout(() => {
	// 		// 	marker.infowindow.close()
	// 		// }, 2000)
  //
	// 	})
  //   this.flagPin = flagPin
  //   this.flagPin.setMap(this.map)
  // }

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
      mapTypeControl: this.props.fullscreenSearch ? false : true,
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
          preview_visible: false,
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
      self.setState({
        preview_visible: false,
      })
      const nearby_stats = calculateNearbyStats(point, self.state.ads, 1000)
      self.setState({
        clicked_point: point,
        nearby_stats: nearby_stats,
        deletablePolygon: false,
        show_filter: false,
      })
    })
    // self.refreshPins(self.props, self.props)
  }

  deletePolygon(polygon) {
    polygon.setMap(null)
    this.current_polygon = null
    this.setState({
      deletablePolygon: false,
      show_filter: false,
    })
  }

  // () => this.deletePolygon(this.current_polygon)

  clickedPreview(e, current_listing) {
    if (e) {
      e.stopPropagation()
    }
    if (this.props.fullscreenSearch || this.props.previewEnterable) {
      // go to the listing
      // this.props.history.push(`/matches/${current_listing.REFERENCE_ID}`)
      this.props.setListing(current_listing, `/matches/${current_listing.REFERENCE_ID}`)
    }
  }

	render() {
		return (
			<div id='HeatMapHunting' style={comStyles(this.props.style).container}>
        <div id="map" style={comStyles().map}></div>
        {
          this.props.fullscreenSearch
          ?
          <div style={searchStyles().quickbar}>
            <Button onClick={() => this.props.history.push('/matches')} size='small' type="ghost" style={searchStyles().list}>List</Button>
            <Button onClick={() => this.setState({ show_filter: true })} size='small' type="ghost" style={searchStyles().filter}>Filter</Button>
          </div>
          :
          null
        }
        {
          this.state.show_filter
          ?
          <div style={{ position: 'absolute', top: '0px', left: '0px', width: '100%', height: '100%', backgroundColor: 'white' }}>
            <FilterPopup
              onBack={() => this.setState({ show_filter: false })}
              onComplete={() => this.setState({ show_filter: false })}
            />
          </div>
          :
          null
        }
        {
          this.props.current_listing && this.props.current_listing.IMAGES && this.props.current_listing.IMAGES[0] && this.props.preview
          ?
          <div onClick={(e) => this.clickedPreview(e, this.props.current_listing)} style={previewStyles().popup}>
            <div style={previewStyles().pop_container}>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: '100%', width: '250px', maxWidth: '250px', overflow: 'hidden' }}>
                <img src={this.props.current_listing.IMAGES[0].url} style={{ width: '100%', height: 'auto'  }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '100%', flexGrow: 1, color: 'black', padding: '5px 10px 5px 10px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                  <h3>${this.props.current_listing.PRICE}</h3>
                  <i className='ion-ios-heart' style={{ fontSize: '1.3rem', color: 'red' }} />
                </div>
                <div style={{ fontSize: '0.7rem' }}>{this.props.current_listing.TITLE}</div>
                <div style={{ fontSize: '0.7rem' }}>{`${this.props.current_listing.BEDS} Beds, ${this.props.current_listing.BATHS} Baths`}</div>
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
HeatMapHunting.propTypes = {
	history: PropTypes.object.isRequired,
	triggerDrawerNav: PropTypes.func.isRequired,
  prefs: PropTypes.object.isRequired,
  listings: PropTypes.array,            // passed in
  current_listing: PropTypes.object,    // passed in
  setCurrentListing: PropTypes.func.isRequired,
  setListing: PropTypes.func,           // passed in
  showFlagPin: PropTypes.bool,            // passed in
  preview: PropTypes.bool,          // passed in
  fullscreenSearch: PropTypes.bool,
  previewEnterable: PropTypes.bool,   // passed in
  setCurrentMapLocationToRedux: PropTypes.func.isRequired,
  setMapLoadedToRedux: PropTypes.func.isRequired,
  setMainMapToRedux: PropTypes.func.isRequired,
  style: PropTypes.object,
}

// for all optional props, define a default value
HeatMapHunting.defaultProps = {
  listings: [],
  current_listing: {},
  setListing: () => {},
  showFlagPin: false,
  preview: false,
  previewEnterable: false,
  fullscreenSearch: false,
  style: {
    height: '100%',
  },
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
    setCurrentMapLocationToRedux,
    setMapLoadedToRedux,
    setMainMapToRedux,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = (style) => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
			backgroundColor: '#f5f5f9',
      position: 'relative',
      ...style,
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

const previewStyles = () => {
  return {
    popup: {
      width: '100%',
      height: '20vh',
      maxHeight: '250px',
      backgroundColor: 'white',
      position: 'absolute',
      bottom: '0px',
      left: '0px',
    },
    pop_container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
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
    quickbar: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      alignSelf: 'center',
      position: 'absolute',
      left: '20px',
      top: '10px',
    },
    list: {
      width: '70px',
      borderRadius: '5px 0px 0px 5px',
      margin: '0px 5px 0px 0px',
      backgroundColor: 'white',
    },
    filter: {
      width: '100px',
      borderRadius: '0px 5px 5px 0px',
      backgroundColor: 'white',
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
