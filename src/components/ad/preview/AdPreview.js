// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Button,
  Divider,
  Icon,
} from 'antd'
import {
  Carousel,
} from 'antd-mobile'
import { setCurrentListing } from '../../../actions/listings/listings_actions'
import { setCurrentClickedLocation, setCurrentMapLocationToRedux } from '../../../actions/map/map_actions'


class AdPreview extends Component {

  constructor() {
    super()
    this.state = {
      directions: null,
      imageCarouselSelectedIndex: 0,
    }
  }

  clickedPreview(e, current_listing) {
    if (e) {
      e.stopPropagation()
    }
    if (this.props.fullscreenSearch || this.props.previewEnterable) {
      // go to the listing
      // this.props.history.push(`/matches/${current_listing.REFERENCE_ID}`)
      // this.props.setListing(current_listing, `/matches/${current_listing.REFERENCE_ID}`)
    }
    console.log(window.location)
    window.open(`${window.location.pathname}/${current_listing.REFERENCE_ID}`)
  }

  closeListing() {
    // this.props.setCurrentClickedLocation('remove', this.props.current_listing, this.props.map_listings)
    this.props.setCurrentListing()
    this.props.map_current_location.setAnimation(null)
    this.props.setCurrentMapLocationToRedux()
  }

  turnImageCarousel(e, amount) {
    console.log('NEXT IMAGE')
    if (e) {
      e.stopPropagation()
    }
    let nextIndex = this.state.imageCarouselSelectedIndex
    if (this.state.imageCarouselSelectedIndex + amount < 0) {
      nextIndex = this.props.current_listing.IMAGES.length - 1
    } else if (this.state.imageCarouselSelectedIndex + amount > this.props.current_listing.IMAGES.length - 1) {
      nextIndex = 0
    } else {
      nextIndex = this.state.imageCarouselSelectedIndex + amount
    }
    this.setState({
      imageCarouselSelectedIndex: nextIndex
    })
  }

  renderCoverImage() {
    console.log('RENDER COVER IMAGES')
    return (
      <div key='cover_image' style={coverStyles().container}>
        <div style={{ position: 'relative' }}>
          <div onClick={(e) => this.turnImageCarousel(e, -1)} style={{ height: '100%', position: 'absolute', left: '10px', top: '45%', zIndex: '3', borderRadius: '0% 30% 30% 0%', cursor: 'pointer' }}>
            <i className='ion-chevron-left' style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'white' }}></i>
          </div>
          <Carousel
              autoplay={true}
              autoplayInterval={5000}
              infinite
              swipeSpeed={2000}
              swipeable
              dots={false}
              selectedIndex={this.state.imageCarouselSelectedIndex}
              style={{ width: '250px', }}
            >
            {
              this.props.current_listing && this.props.current_listing.IMAGES && this.props.current_listing.IMAGES.length > 0
              ?
              this.props.current_listing.IMAGES.map((img, index) => (
                  <img
                    id="img_carousel"
                    src={img.url}
                    alt=""
                    style={{ width: '100%', borderRadius: '5px', height: '100%', }}
                    onLoad={() => {
                      // fire window resize event to change height
                      // window.dispatchEvent(new Event('resize'));
                      // this.setState({ imgHeight: '50vh' });
                      // this.renderPriceTag()
                    }}
                  />
              ))
              :
              <img
                id="img_carousel_modal"
                onClick={() => this.clickedImage()}
                src={'https://education.microsoft.com/Assets/images/workspace/placeholder-camera-760x370.png'}
                alt=""
                style={{ width: '100%', borderRadius: '5px', height: '100%', }}
                onLoad={() => {
                  // fire window resize event to change height
                  window.dispatchEvent(new Event('resize'));
                  // this.setState({ imgHeight: '50vh' });
                  // this.renderPriceTag()
                }}
              />
            }
          </Carousel>
          <div onClick={(e) => this.turnImageCarousel(e, 1)} style={{ height: '100%', position: 'absolute', right: '10px', top: '45%', zIndex: '3', borderRadius: '30% 0% 0% 30%', cursor: 'pointer' }}>
            <i className='ion-chevron-right' style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'white' }}></i>
          </div>
        </div>
      </div>
    )
  }

  // <img src={this.props.current_listing.IMAGES[0].url} style={{ width: '100%', height: 'auto'  }} />

	render() {
		return (
			<div id='AdPreview' style={comStyles().popup}>
        <div style={comStyles().pop_container}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', maxHeight: '100%', width: '250px', maxWidth: '250px', overflow: 'hidden' }}>
            {
              this.props.current_listing && this.props.current_listing.IMAGES && this.props.current_listing.IMAGES.length > 0
              ?
              <img src={this.props.current_listing.IMAGES[0].url} style={{ width: '100%', height: 'auto'  }} />
              :
              <img
                id="img_carousel_modal"
                onClick={() => this.clickedImage()}
                src={'https://education.microsoft.com/Assets/images/workspace/placeholder-camera-760x370.png'}
                alt=""
                style={{ width: '100%', borderRadius: '5px', height: '100%', }}
                onLoad={() => {
                  // fire window resize event to change height
                  window.dispatchEvent(new Event('resize'));
                  // this.setState({ imgHeight: '50vh' });
                  // this.renderPriceTag()
                }}
              />
            }
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'flex-start', height: '100%', flexGrow: 1, color: 'black', padding: '5px 10px 5px 10px', textAlign: 'left' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ fontSize: '1.0rem' }}>{this.props.current_listing.TITLE}</div>
              <Icon type='close' style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => this.closeListing()} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <h3>${this.props.current_listing.PRICE}</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem' }}>{`${this.props.current_listing.BEDS} Beds, ${this.props.current_listing.BATHS} Baths`}</div>
              <Divider type="vertical" />
              <Button type='primary' onClick={(e) => this.clickedPreview(e, this.props.current_listing)} style={{ borderRadius: '25px' }}>
                View Listing
              </Button>
            </div>
          </div>
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
AdPreview.propTypes = {
	history: PropTypes.object.isRequired,
  current_listing: PropTypes.object.isRequired,     // passed in
  setCurrentMapLocationToRedux: PropTypes.func.isRequired,
  setCurrentListing: PropTypes.func.isRequired,
  setCurrentClickedLocation: PropTypes.func.isRequired,
  map_listings: PropTypes.array.isRequired,
  map_current_location: PropTypes.object.isRequired,
}

// for all optional props, define a default value
AdPreview.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AdPreview)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    map_listings: redux.map.listings,
    map_current_location: redux.map.current_location,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    setCurrentListing,
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
		},
    popup: {
      width: '100%',
      height: '20vh',
      maxHeight: '250px',
      backgroundColor: 'rgba(256,256,256,0.8)',
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

const coverStyles = () => {
  return {
    container: {
      overflow: 'hidden',
      // padding: '10px',
      // borderRadius: '10px',
    },
  }
}
