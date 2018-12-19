// Compt for copying as a MapModule
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import { isMobile } from '../../api/general/general_api'
import {
  Toast,
  Icon,
} from 'antd-mobile'


class MapModule extends Component {

  constructor() {
    super()
    this.state = {
      initial_address_lat: 0,
      initial_address_lng: 0,
      data: {
        address_components: [],
        address_lat: 0,
        address_lng: 0,
        address_place_id: '',
        address: '',
      }
    }
    this.mobile = false
  }

  componentWillMount() {
    if (this.props.initialData) {
      this.setState({
        initial_address_lat: this.props.initialData.address_lat,
        initial_address_lng: this.props.initialData.address_lng,
        data: {
          ...this.state.data,
          ...this.props.initialData
        }
      })
    }
  }

  componentDidMount() {
    this.startAutocomplete()
    this.mobile = isMobile()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.initialData !== this.props.initialData) {
      this.setState({
        initial_address_lat: this.props.initialData.address_lat,
        initial_address_lng: this.props.initialData.address_lng,
        data: {
          ...this.state.data,
          ...this.props.initialData
        }
      })
    }
  }

  startAutocomplete() {
    this.autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById(`address--module`)),
            {
              // types: ['address', 'establishment'],
              // bounds: new google.maps.LatLngBounds(
              //   new google.maps.LatLng(-80.671519, 43.522913),
              //   new google.maps.LatLng(-80.344067, 43.436979)
              // )
							componentRestrictions: {country: "ca"},
            }
          );
    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    this.autocomplete.addListener('place_changed', () => this.fillInAddress())
    if (this.state.data.address_lat && this.state.data.address_lng) {
      this.renderMap(parseFloat(this.state.data.address_lat), parseFloat(this.state.data.address_lng))
    }
  }

  fillInAddress() {
    const place = this.autocomplete.getPlace()
    this.setState({
      data: {
        ...this.state.data,
        address_components: place.address_components,
        address_lat: place.geometry.location.lat().toFixed(7),
        address_lng: place.geometry.location.lng().toFixed(7),
        address_place_id: place.place_id,
        address: place.formatted_address,
      }
    }, () => {
			document.getElementById(`address--module`).blur()
			setTimeout(() => {
        this.renderMap(parseFloat(place.geometry.location.lat().toFixed(7)), parseFloat(place.geometry.location.lng().toFixed(7)))
			}, 500)
		})
  }

  renderMap(lat, lng) {
    document.getElementById(`map--module`).style.height = '250px'
    const coords = { lat, lng }
    const map = new google.maps.Map(document.getElementById(`map--module`), {
      center: coords,
      zoom: 13,
      disableDefaultUI: true,
    })
    const marker = new google.maps.Marker({position: coords, map: map})
    // document.getElementById(`map--${this.props.schema.id}`).scrollIntoView({ behavior: "smooth", block: "top" })
  }

  focusedInput(id) {
    if (this.mobile) {
      document.getElementById(id).scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  saveChanges(e) {
    this.props.onComplete(this.state.data)
  }

	render() {
		return (
			<div id='MapModule' style={comStyles().container}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <input
            id='address--module'
            value={this.state.data.address}
            onChange={(e) => {
              this.setState({ data: { ...this.state.data, address: e.target.value } })
            }}
            onFocus={() => this.focusedInput(`address--module`)}
            placeholder="Enter Location"
            style={comStyles().text}
          ></input>
          <div id={`map--module`} style={{ height: '10px', borderRadius: '10px', margin: '10px 0px 0px 0px' }}></div>
        </div>
        <div style={{ width: '100%', height: '50px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', position: 'relative', margin: '15px 0px 0px 0px' }}>
          {
            this.state.data.address_lat !== this.state.initial_address_lat && this.state.data.address_lng !== this.state.initial_address_lng
            ?
            <Icon onClick={(e) => this.saveChanges(e)} type='check-circle' size='lg' style={comStyles().check} />
            :
            <Icon type='check-circle-o' size='lg' style={{ ...comStyles().check, cursor: 'not-allowed', color: 'gray' }} />
          }
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
MapModule.propTypes = {
	history: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,        // passed in, function to call at very end
  initialData: PropTypes.object,            // passed in, allows us to configure inputs to whats already given
}

// for all optional props, define a default value
MapModule.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MapModule)

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
		},
    text: {
      background: 'rgba(0,0,0,0.1)',
      border: 'none',
      display: 'flex',
      outline: 'none',
      width: '100%',
      fontSize: '1.2rem',
      height: '30px',
      borderRadius: '10px',
      padding: '20px',
      color: 'black',
      webkitBoxShadow: '0 2px 10px 1px rgba(0,0,0,0)',
      boxShadow: '0 2px 10px 1px rgba(0,0,0,0)',
    },
		check: {
			color: 'black',
			fontWeight: 'bold',
			cursor: 'pointer',
			margin: '0px 0px 0px 0px',
			position: 'absolute',
			bottom: '20px',
			right: '0px',
		}
	}
}
