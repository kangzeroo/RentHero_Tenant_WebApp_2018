// Compt for copying as a AdNearbySection
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Carousel,
} from 'antd-mobile'


class AdNearbySection extends Component {

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
        }, () => this.renderNearby())
      })
      .catch((err) => {
        console.log(err)
      })
  }

  getNearby() {
    const p =  new Promise((res, rej) => {
  		const self = this
  		const location = { lat: this.props.current_listing.GPS.lat, lng: this.props.current_listing.GPS.lng }
  		const map = new google.maps.Map(document.getElementById('nearby_map'), {
  			center: location,
  			zoom: 16,
  			disableDefaultUI: true,
  		})
  		const marker = new google.maps.Marker({position: location, map: map});
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
    console.log(this.state)
    const self = this
    const location = { lat: this.props.current_listing.GPS.lat, lng: this.props.current_listing.GPS.lng }
    const map = new google.maps.Map(document.getElementById('nearby_map'), {
      center: location,
      zoom: 15,
      disableDefaultUI: true,
    })
    const marker = new google.maps.Marker({ position: location, map: map });
    this.state.nearbys.forEach((n, i) => {
      const loc = n.geometry.location
      const marker = new google.maps.Marker({
        position: {lat: loc.lat(), lng: loc.lng()},
        map: map,
        // icon: RED_PIN,
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

  selectedNearby(string) {
    this.setState({
      nearbys_string: string
    })
  }

	render() {
		return (
			<div id='AdNearbySection' style={comStyles().container}>

        <div id='nearby_map' style={mapStyles().map}></div>
        {
          this.state.current_location && this.state.current_location.reference
          ?
          <div style={mapStyles().mapDetails}>
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
	}
}

// defines the types of variables in this.props
AdNearbySection.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
AdNearbySection.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AdNearbySection)

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
		}
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
