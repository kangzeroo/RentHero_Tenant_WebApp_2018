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
  Carousel,
  Button,
} from 'antd-mobile'
import {
  Select,
} from 'antd'


class NearbyLocations extends Component {

  constructor() {
    super()
    this.state = {
      nearbys: [],
      current_location: null,
      nearbys_string: 'all',
    }
    this.map = null
  }

  componentDidMount() {
    this.getNearby()
      .then((nearbys) => {
        this.setState({
          nearbys: nearbys,
          current_location: null,
        })
        if (this.props.card_section_shown === 'nearby') {
          this.renderNearby()
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevProps.card_section_shown !== this.props.card_section_shown && this.props.card_section_shown === 'nearby') || (prevProps.current_listing !== this.props.current_listing)) {
      this.renderNearby()
    }
    if ((prevState.nearbys_string !== this.state.nearbys_string) || (prevProps.current_listing !== this.props.current_listing)) {
      this.getNearby()
        .then((nearbys) => {
          this.setState({
            nearbys: nearbys,
            current_location: null,
          })
          if (this.props.card_section_shown === 'nearby') {
            this.renderNearby()
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

	getNearby() {
    const p =  new Promise((res, rej) => {
  		const self = this
  		const location = { lat: this.props.current_listing.GPS.lat, lng: this.props.current_listing.GPS.lng }
  		const map = new google.maps.Map(document.getElementById('map'), {
  			center: location,
  			zoom: 16,
  			disableDefaultUI: true,
  		})
  		const marker = new google.maps.Marker({position: location, map: map, icon: BLUE_PIN});
  		const placeService = new google.maps.places.PlacesService(map)
      let params = {
  			location: location,
  			radius: 2000,
  			rankby: 'distance'
  		}
      if (this.state.nearbys_string !== 'all' && this.state.nearbys_string) {
        params.keyword = this.state.nearbys_string
      }
  		placeService.nearbySearch(params, (results, status) => {
  			if (status === 'OK') {
  				console.log('-------> Got nearby stuff')
  				console.log(results)
          this.props.setNearbyState({
            count: results.length
          })
          res(results)
  			} else {
  				console.log(results)
  				console.log(status)
          rej(status)
  			}
  		})
    })
    return p
	}

  renderNearby() {
    if (this.props.card_section_shown === 'nearby') {
      const self = this
      const location = { lat: this.props.current_listing.GPS.lat, lng: this.props.current_listing.GPS.lng }
      const map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 15,
        disableDefaultUI: true,
      })
      const marker = new google.maps.Marker({position: location, map: map, icon: BLUE_PIN});
      this.state.nearbys.forEach((n, i) => {
        const loc = n.geometry.location
        const marker = new google.maps.Marker({
          position: {lat: loc.lat(), lng: loc.lng()},
          map: map,
          icon: RED_PIN,
          // title: n.formatted_address,
          // zIndex: 1,
        })
        marker.addListener('click', (event) => {
          this.setState({
            current_location: n,
          }, () => console.log(this.state))
        })
      })
    }
  }

  selectedNearby(string) {
    this.setState({
      nearbys_string: string
    })
  }

	render() {
    if (this.props.card_section_shown === 'nearby') {
  		return (
  			<div id='NearbyLocations' style={comStyles().container}>
          {
            // <div id='controls' style={comStyles().controls}>
            //   <Button onClick={() => this.selectedNearby('cafes')} type={this.state.nearbys_string === 'cafes' ? 'primary' : 'ghost'} inline size="small" style={{ margin: '3px' }}>Cafés</Button>
            //   <Button onClick={() => this.selectedNearby('groceries')} type={this.state.nearbys_string === 'groceries' ? 'primary' : 'ghost'} inline size="small" style={{ margin: '3px' }}>Groceries</Button>
            //   <Button onClick={() => this.selectedNearby('stores')} type={this.state.nearbys_string === 'stores' ? 'primary' : 'ghost'} inline size="small" style={{ margin: '3px' }}>Stores</Button>
            //   <Button onClick={() => this.selectedNearby('resturants')} type={this.state.nearbys_string === 'resturants' ? 'primary' : 'ghost'} inline size="small" style={{ margin: '3px' }}>Resturants</Button>
            //   <Button onClick={() => this.selectedNearby('bars')} type={this.state.nearbys_string === 'bars' ? 'primary' : 'ghost'} inline size="small" style={{ margin: '3px' }}>Bars</Button>
            //   <Button onClick={() => this.selectedNearby('banks')} type={this.state.nearbys_string === 'banks' ? 'primary' : 'ghost'} inline size="small" style={{ margin: '3px' }}>Banks</Button>
            //   <Button onClick={() => this.selectedNearby('bus')} type={this.state.nearbys_string === 'bus' ? 'primary' : 'ghost'} inline size="small" style={{ margin: '3px' }}>Bus Stops</Button>
            //   <Button onClick={() => this.selectedNearby('subway')} type={this.state.nearbys_string === 'subway' ? 'primary' : 'ghost'} inline size="small" style={{ margin: '3px' }}>Subway</Button>
            //   <Button onClick={() => this.selectedNearby('parks')} type={this.state.nearbys_string === 'parks' ? 'primary' : 'ghost'} inline size="small" style={{ margin: '3px' }}>Parking</Button>
            //   <Button onClick={() => this.selectedNearby('daycare')} type={this.state.nearbys_string === 'daycare' ? 'primary' : 'ghost'} inline size="small" style={{ margin: '3px' }}>Daycare</Button>
            //   <Button onClick={() => this.selectedNearby('parks')} type={this.state.nearbys_string === 'parks' ? 'primary' : 'ghost'} inline size="small" style={{ margin: '3px' }}>Parks</Button>
            // </div>
          }
          <div id='controls' style={{ width: '100%', padding: '10px' }}>
            <p style={{ fontWeight: 'bold' }}>Show Nearby...</p>
            <Select
              size='large'
              style={{ width: '100%', }}
              onChange={(a) => this.selectedNearby(a)}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Select.Option key='cafes' value='cafes'>Cafes</Select.Option>
              <Select.Option key='groceries' value='groceries'>Groceries</Select.Option>
              <Select.Option key='stores' value='stores'>Stores</Select.Option>
              <Select.Option key='restaurants' value='restaurants'>Restaurants</Select.Option>
              <Select.Option key='bars' value='bars'>Bars</Select.Option>
              <Select.Option key='banks' value='banks'>Banks</Select.Option>
              <Select.Option key='bus' value='bus'>Bus Station</Select.Option>
              <Select.Option key='subway' value='subway'>Subway Station</Select.Option>
              <Select.Option key='parking' value='parking'>Parking Lots</Select.Option>
              <Select.Option key='daycare' value='daycare'>Day Care</Select.Option>
              <Select.Option key='parks' value='parks'>Parks</Select.Option>
            </Select>
          </div>
  				<div id='map' style={comStyles().map}></div>
          {
            this.state.current_location && this.state.current_location.reference
            ?
            <div style={comStyles().mapDetails}>
              <div style={{ display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
                {
                  this.state.current_location.photos && this.state.current_location.photos.length > 0
                  ?
                  <Carousel
  					          autoplay={true}
  					          infinite
                      style={{ width: '50%' }}
  					        >
  				          {this.state.current_location.photos.map((pic) => (
  				            <a
  				              key={pic.getUrl()}
  				              style={{ display: 'inline-block', width: 'auto', height: '150px' }}
  				            >
  				              <img
  												id="img_carousel"
  				                src={pic.getUrl()}
  				                alt=""
  				                style={{ width: 'auto', height: '150px', verticalAlign: 'top' }}
  				                onLoad={() => {
                            // do something when image loads
  				                }}
  				              />
  				            </a>
  				          ))}
  				        </Carousel>
                  :
                  null
                }
                <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '20px', width: '50%' }}>
                  <p style={{ color: 'white' }}>{ this.state.current_location.name }</p>
                  <p>{ this.state.current_location.formatted_address }</p>
                  <p>{ this.state.current_location.rating } Stars</p>
                  <p>{ this.state.current_location.opening_hours && this.state.current_location.opening_hours.open_now ? 'Open Now' : '' }</p>
                  {/*<Rate value={this.state.current_location.rating} />*/}
                </div>
              </div>
            </div>
            :
            null
          }
  			</div>
  		)
    } else {
      return null
    }
	}
}

// defines the types of variables in this.props
NearbyLocations.propTypes = {
	history: PropTypes.object.isRequired,
  setNearbyState: PropTypes.func.isRequired,          // passed in
	current_listing: PropTypes.object.isRequired,       // passed in
  card_section_shown: PropTypes.string.isRequired,    // passed in
}

// for all optional props, define a default value
NearbyLocations.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(NearbyLocations)

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
      position: 'relative',
      backgroundColor: 'white',
		},
		map: {
			height: '400px',
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
      maxHeight: '180px',
    },
    controls: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
    },
	}
}
