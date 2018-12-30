// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import Ionicon from 'react-ionicons'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import {
  List,
  Card,
  Input,
  Divider,
  Icon,
  Tooltip,
  Button,
} from 'antd'
import {
  Modal,
} from 'antd-mobile'
import EditSearch from '../edits/EditSearch'
import FavoritesSection from './sections/FavoritesSection'
import { setCurrentListing } from '../../actions/listings/listings_actions'
import { isMobile } from '../../api/general/general_api'
import { setCurrentFlagPin, setCurrentClickedLocation, setCurrentMapLocationToRedux } from '../../actions/map/map_actions'
import { BLUE_PIN, RED_PIN, GREY_PIN, FLAG_PIN, } from '../../assets/map_pins'
import FilterPopup from '../filter/FilterPopup'

class AdsPage extends Component {

  constructor() {
    super()
    this.state = {
      search_string: '',
      show_filter: false,
      mobile: false,

      toggle_modal: false,
      modal_name: '',
      context: {},

    }
  }

  componentWillMount() {
    this.setState({
			mobile: isMobile()
		}, () => console.log(this.state))
    if (this.props.all_listings && this.props.all_listings.length > 0 && this.props.map_loaded && !isMobile()) {
      this.refreshPins(this.props.all_listings)
    }
  }

	componentDidUpdate(prevProps, prevState) {
    console.log(this.props.auth.authentication_loaded, this.props.auth.authenticated)
		if (!this.props.auth.authentication_loaded) {
			this.props.history.push('/')
		}
    // if (this.props.all_listings && this.props.all_listings.length > 0 && this.props.map_loaded) {
    //   this.refreshPins(this.props.all_listings)
    // }
	}

  componentWillReceiveProps(nextProps) {
    if (this.props.all_listings !== nextProps.all_listings && this.props.map_loaded && !isMobile()) {
      this.refreshPins(nextProps.all_listings)
    }
    if (this.props.map_loaded !== nextProps.map_loaded && !isMobile()) {
      this.refreshPins(nextProps.all_listings)
    }
  }

  toggleModal(bool, attr, context) {
    if (attr) {
      history.pushState(null, null, `/matches?tab=${attr}`)
    } else {
      history.pushState(null, null, `/matches`)
    }
    this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context,
    })
  }

  renderAppropriateModal(modal_name, context) {
    if (modal_name === 'filter') {
      return (
        <Modal
          visible={this.state.toggle_modal}
          transparent
          maskClosable
          popup
          animationType='slide-up'
          onClose={() => this.toggleModal(false)}
          style={
            isMobile()
            ?
            {
              height: '100vh',
              width: '100vw',
              position: 'absolute',
              left: 0,
              top: 0,
              borderRadius: '0px !important',
            }
            :
            {
              height: '100vh',
              width: '40vw',
              position: 'absolute',
              left: 0,
              top: 0,
              borderRadius: '0px !important',
            }
          }
        >
          <FilterPopup
            onBack={() => this.setState({ show_filter: false }, () => { this.toggleModal(false) })}
            onComplete={() => this.setState({ show_filter: false }, () => { this.toggleModal(false) })}
          />
        </Modal>
      )
    }
  }


  refreshPins(listings) {
    console.log(listings)
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      disableDefaultUI: true,
      clickableIcons: false,
    })
    let bounds = new google.maps.LatLngBounds()
    let self = this
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
            self.props.setCurrentListing(n)
            self.props.setListing(n, `/matches/${n.REFERENCE_ID}`)
            // self.setState({
            //   preview_visible: true
            // })
            // self.bufferPin = marker
            self.props.setCurrentMapLocationToRedux(marker)
          })

  				// save the pins
          // console.log(marker)
  				if (marker) {
  					marker.setMap(map)
  				}

      })

      if (map) {
        map.fitBounds(bounds)
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

  renderTitle() {
    return (
      <div>
        <div style={{ textAlign: 'left' }}>
          <h2>{`Relevant Listings for you`}</h2>
          <p>{`Here are the most relevant listings we've found for you, based on the information you've provided for us. If you'd like for your search to be even more specific, please `}<a href='/app/profile' target='_blank'>Click Here</a></p>
        </div>
        <Button type='primary' icon='caret-right' onClick={() => this.props.history.push('/slideshow')} style={{ borderRadius: '25px', width: '50%' }} size='large'>
          Start Slideshow
        </Button>
      </div>
    )
  }

  renderSearchAndFilter(prefs) {
    // if (this.state.show_filter) {
    //   return (
    //     <EditSearch
    //       onBack={() => this.setState({ show_filter: false })}
    //       onComplete={() => this.setState({ show_filter: false })}
    //     />
    //   )
    // } else {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Input size='large' value={this.state.search_string} onChange={(e) => this.setState({ search_string: e.target.value })} placeholder={`Search homes near ${prefs.LOCATION.DESTINATION_ADDRESS.split(',')[0]}`} style={{ maxWidth: '60%', borderRadius: '25px', paddingLeft: '20px', }} />
          &nbsp;
          <Tooltip title='Filter'>
            <Icon type='filter' theme="twoTone" onClick={() => this.setState({ show_filter: true }, () => this.toggleModal(true, 'filter'))} size='large' style={{ fontSize: '1.5rem' }} />
          </Tooltip>
        </div>
      )
    // }
  }

  renderProperties(listings) {
    return (
      <div id='Listings'>
        <br />
        <List
           grid={{ gutter: 16, column: 2 }}
           loading={!this.props.loading_complete}
           pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 10,
            }}
           dataSource={listings.filter(li => li.IMAGES.length > 0).filter(li => li.ADDRESS.toLowerCase().indexOf(this.state.search_string.toLowerCase()) > -1)}
           renderItem={item => (
             <List.Item key={item.REFERENCE_ID}>
               <Card
                cover={<img src={item.IMAGES[0].url} style={{ maxHeight: '150px', borderRadius: '5px', }} />}
                bordered={false}
                bodyStyle={{
                  margin: '10px 0px',
                  padding: 0,
                }}
                style={{ padding: '10px', cursor: 'pointer' }}
                onClick={() => this.props.setListing(item, `/matches/${item.REFERENCE_ID}`)}
               >
                  <Card.Meta
                    title={item.TITLE}
                    description={
                      <div>
                        <div>{`${item.BEDS} Beds ${item.BATHS} Baths`}</div>
                        <div>{`$${item.PRICE} Per month`}</div>
                        <div>{`Posted ${moment(item.DATE_POSTED).fromNow()}`}</div>
                      </div>
                    }
                    style={{
                      textAlign: 'left',
                    }}
                  />
               </Card>
             </List.Item>
           )}
        />
      </div>
    )
  }

  renderFavoritesSection() {
    return (
      <div id='MyList'>
        <Divider />
        <FavoritesSection

        />
      </div>
    )
  }

  renderMobileMapButton() {
    return (
      <Button type='primary' style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        padding: '0px 20px',
        borderRadius: '25px',
        border: 'none',
        transform: 'translate(-50%, -50%)',
        background: '#56CCF2',  /* fallback for old browsers */
        background: '-webkit-linear-gradient(to right, #2F80ED, #56CCF2)',  /* Chrome 10-25, Safari 5.1-6 */
        background: 'linear-gradient(to right, #2F80ED, #56CCF2)', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
      }}
      onClick={() => this.props.history.push('/map')}
      size='large'
      >
        <Ionicon
          icon="md-pin"
          fontSize="1.5rem"
          color='white'
        />
        <div style={{ marginLeft: '10px', color: 'white' }}>MAP</div>
      </Button>
    )
  }


	render() {
		return (
			<div id='AdsPage' style={comStyles().container}>
				{
          this.renderTitle()
        }
        <Divider />
        {
          this.renderSearchAndFilter(this.props.prefs)
        }
        {
          this.renderProperties(this.props.listings.all_listings)
        }
        {
          this.renderFavoritesSection()
        }
        {
          isMobile()
          ?
          this.renderMobileMapButton()
          :
          null
        }
        {
          this.renderAppropriateModal(this.state.modal_name, this.state.context)
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
AdsPage.propTypes = {
	history: PropTypes.object.isRequired,
  prefs: PropTypes.object.isRequired,
  listings: PropTypes.object.isRequired,
  all_listings: PropTypes.array.isRequired,
  setCurrentListing: PropTypes.func.isRequired,
  loading_complete: PropTypes.bool.isRequired,
  setListing: PropTypes.func.isRequired,          // passed in
  auth: PropTypes.object.isRequired,
  setCurrentFlagPin: PropTypes.func.isRequired,
  setCurrentClickedLocation: PropTypes.func.isRequired,
  map_loaded: PropTypes.bool.isRequired,
  setCurrentMapLocationToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
AdsPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AdsPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    prefs: redux.prefs,
    listings: redux.listings,
    loading_complete: redux.app.loading_complete,
    auth: redux.auth,
    all_listings: redux.listings.all_listings,
    map_loaded: redux.map.map_loaded,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    setCurrentListing,
    setCurrentFlagPin,
    setCurrentClickedLocation,
    setCurrentMapLocationToRedux,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      padding: '20px'
		}
	}
}
