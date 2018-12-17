// Compt for copying as a AdMapSection
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Carousel,
  Tabs,
} from 'antd-mobile'
import CommuteMap from '../../modules/CommuteMap/CommuteMap'
import NearbyLocations from '../../modules/NearbyLocations/NearbyLocations'
import StreetView from '../../modules/StreetView/StreetView'
import { changeShownSectionCards } from '../../../actions/listings/listings_actions'


class AdMapSection extends Component {

  constructor() {
    super()
    this.state = {
      location_tab_index: 0,
			commute_state: {
				commute_time: 0,
				commute_distance: 0,
			},
			nearby_state: {
				count: 0,
			},
			streetview_state: {

			},
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

  setCommute(commute_state) {
    this.setState({ commute_state: commute_state })
    this.props.setCommuteState(commute_state)
  }

	render() {
    const location_tabs = [
      {
        title: 'COMMUTE',
        section: 'commute',
      },
      {
        title: `NEARBY`,
        section: 'nearby',
      },
      {
        title: `STREET VIEW`,
        section: 'streetview',
      }
    ]
		return (
			<div id='AdMapSection' style={comStyles().container}>
        <Tabs
          tabs={location_tabs}
          swipeable={false}
          initialPage={this.state.location_tab_index}
          onChange={(tab, index) => { console.log('onChange', index, tab); }}
          onTabClick={(tab, index) => {
            this.setState({ location_tab_index: index })
            this.props.changeShownSectionCards(location_tabs[index].section)
            // document.getElementById('location_info').scrollIntoView()
          }}
        >
          <CommuteMap
            current_listing={this.props.current_listing}
            commute_mode={this.props.commute_mode}
            destination={this.props.main_destination}
            card_section_shown={this.props.card_section_shown}
            setCommuteState={(commute_state) => this.setCommute(commute_state)}
          />
          <NearbyLocations
            current_listing={this.props.current_listing}
            card_section_shown={this.props.card_section_shown}
            setNearbyState={(nearby_state) => this.setState({ nearby_state: nearby_state })}
          />
          <StreetView
            current_listing={this.props.current_listing}
            card_section_shown={this.props.card_section_shown}
          />
        </Tabs>
			</div>
		)
	}
}

// defines the types of variables in this.props
AdMapSection.propTypes = {
	history: PropTypes.object.isRequired,
  setCommuteState: PropTypes.func.isRequired,       // passed in
  main_destination: PropTypes.string.isRequired,     // passed in
  arrival_time: PropTypes.string.isRequired,     // passed in
  current_listing: PropTypes.object.isRequired,     // passed in
	card_section_shown: PropTypes.string.isRequired,
  changeShownSectionCards: PropTypes.string.isRequired,
  commute_mode: PropTypes.string.isRequired,
}

// for all optional props, define a default value
AdMapSection.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AdMapSection)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    card_section_shown: redux.tenant.card_section_shown,
    commute_mode: redux.tenant.commute_mode,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    changeShownSectionCards,
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
