// Compt for copying as a AdCoverSection
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import {
  Badge,
  Carousel,
  Icon,
  Modal,
} from 'antd-mobile'
import {
  Button,
} from 'antd'
import LikeableImage from './LikeableImage'


class AdCoverSection extends Component {

  constructor() {
    super()
    this.state = {
      directions: null,
			imageCarouselSelectedIndex: 0,
    }
  }

  turnImageCarousel(e, amount) {
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
    return (
      <div key='cover_image' style={coverStyles().container}>
        {/*<LikeableImage img={this.props.cover_image} />*/}
        <div style={{ position: 'relative' }}>
          <div onClick={(e) => this.turnImageCarousel(e, -1)} style={{ height: '100%', position: 'absolute', left: '10px', top: '45%', zIndex: '3', borderRadius: '0% 30% 30% 0%', cursor: 'pointer' }}>
            <i className='ion-chevron-left' style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'white' }}></i>
          </div>
          <Carousel
              autoplay={true}
              infinite
              swipeSpeed={3}
              dots={false}
              selectedIndex={this.state.imageCarouselSelectedIndex}
              style={{ overflow: 'hidden' }}
            >
            {
              this.props.current_listing && this.props.current_listing.IMAGES && this.props.current_listing.IMAGES.length
              ?
              this.props.current_listing.IMAGES.map((img, index) => (
                <a
                  key={img.url}
                  style={{ display: 'inline-block', width: '100%' }}
                  onClick={() => {
                    this.props.onShowAll()
                    // this.props.scrollDownToImages()
                    // history.pushState(null, null, `${this.props.location.pathname}?show=images`)
                  }}
                >
                  <img
                    id="img_carousel"
                    src={img.url}
                    alt=""
                    style={{ width: '100%', verticalAlign: 'top', borderRadius: '0px', overflow: 'hidden' }}
                    onLoad={() => {
                      // fire window resize event to change height
                      window.dispatchEvent(new Event('resize'));
                      // this.setState({ imgHeight: '50vh' });
                      // this.renderPriceTag()
                    }}
                  />
                </a>
              ))
              :
              <img
                id="img_carousel_modal"
                onClick={() => this.clickedImage()}
                src={'https://education.microsoft.com/Assets/images/workspace/placeholder-camera-760x370.png'}
                alt=""
                style={{ width: '100%', height: '100%', verticalAlign: 'top', borderRadius: '10px', overflow: 'hidden' }}
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
          <Button type='default' style={{ position: 'absolute', bottom: '20px', right: '10px', }} onClick={() => this.props.onShowAll()} icon='appstore'>
            Tour this Home
          </Button>
        </div>
      </div>
    )
  }

  renderDescription() {
    return (
      <div key='description' style={descriptionStyles().container}>
        <div style={descriptionStyles().left}>
          <div style={descriptionStyles().title}>{`${this.props.title}`}</div>
          <div style={descriptionStyles().beds_baths}>{`${this.props.beds} BEDS • ${this.props.baths} BATHS`}</div>
          <div style={descriptionStyles().price_by}>{`By ${this.props.seller}`.toUpperCase()}</div>
          <br/>
          <div style={{ fontSize: '0.7rem' }}><i className='ion-ios-box' style={{ fontSize: '1rem', margin: '0px 10px 0px 0px' }} />
            {
              moment(this.props.current_listing.MOVEIN).diff(moment()) > 0
              ?
              `MOVE IN ${moment(this.props.current_listing.MOVEIN).format('MMM DD').toUpperCase()}`
              :
              'MOVE IN ASAP'
            }
          </div>
          <div style={{ fontSize: '0.7rem' }}><i className='ion-calendar' style={{ margin: '0px 10px 0px 0px' }} />{this.props.current_listing.LEASE_LENGTH} MONTHS</div>
          {
            this.props.current_listing.SQFT
            ?
            <div style={{ fontSize: '0.7rem' }}><i className='ion-cube' style={{ margin: '0px 10px 0px 0px' }} />{this.props.current_listing.SQFT} SQFT</div>
            :
            null
          }
          {
            this.props.current_listing.PET_FRIENDLY
            ?
            <div style={{ fontSize: '0.7rem' }}><i className='ion-ios-paw' style={{ margin: '0px 10px 0px 0px' }} />{this.props.current_listing.SQFT} SQFT</div>
            :
            null
          }
          {
            this.props.current_listing.FURNISHED
            ?
            <div style={{ fontSize: '0.7rem' }}><i className='ion-ios-home' style={{ margin: '0px 10px 0px 0px' }} />FURNISHED</div>
            :
            <div style={{ fontSize: '0.7rem' }}><i className='ion-close-round' style={{ margin: '0px 10px 0px 0px' }} />NOT FURNISHED</div>
          }
          {
            this.props.current_listing.UTILITIES
            ?
            <div style={{ fontSize: '0.7rem' }}><i className='ion-outlet' style={{ margin: '0px 10px 0px 0px' }} />UTILITIES INCLUDED</div>
            :
            <div style={{ fontSize: '0.7rem' }}><i className='ion-close-round' style={{ margin: '0px 10px 0px 0px' }} />UTILITIES SEPERATE</div>
          }
          {
            this.props.current_listing.PARKING
            ?
            <div style={{ fontSize: '0.7rem' }}><i className='ion-model-s' style={{ margin: '0px 10px 0px 0px' }} />PARKING INCLUDED</div>
            :
            null
          }
        </div>
        <div style={descriptionStyles().right}>
          <div style={descriptionStyles().price}>{`$${this.props.current_listing.PRICE}`}</div>
          <div style={descriptionStyles().commute}>{`${(this.props.commute_time/60).toFixed(0)} MINS`}</div>
          {/*<div onClick={() => window.open(this.props.current_listing.URL, '_blank')} style={descriptionStyles().original}>VIEW ORIGINAL</div>*/}
        </div>
      </div>
    )
  }

	render() {
		return (
			<div id='AdCoverSection' style={comStyles().container}>
        {this.renderCoverImage()}
        {this.renderDescription()}
			</div>
		)
	}
}

// defines the types of variables in this.props
AdCoverSection.propTypes = {
	history: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,    // passed in
  beds: PropTypes.number.isRequired,     // passed in
  baths: PropTypes.number.isRequired,     // passed in
  seller: PropTypes.string.isRequired,     // passed in
  commute_time: PropTypes.number.isRequired,     // passed in
  current_listing: PropTypes.object.isRequired,     // passed in
  scrollDownToImages: PropTypes.func.isRequired,    // passed in
  onShowAll: PropTypes.func.isRequired,             // passed in
}

// for all optional props, define a default value
AdCoverSection.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AdCoverSection)

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
      margin: '0px 0px 50px 0px'
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

const descriptionStyles = () => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      padding: '20px',
    },
    left: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      width: '70%',
    },
    right: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '30%',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'black',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'rgb(54, 69, 79)',
    },
    beds_baths: {
      fontSize: '1rem',
      fontWeight: 'bold',
      color: 'rgb(54, 69, 79)',
    },
    price_by: {
      fontSize: '0.7rem',
      color: 'rgb(126, 136, 142)',
      width: '80%',
      textAlign: 'left',
    },
		price: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'black',
      margin: '0px 0px 5px 0px',
		},
    commute: {
      width: '100px',
      backgroundColor: '#0ca20c',
      color: 'white',
      borderRadius: '5px',
      display: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      fontSize: '0.8rem',
      fontWeight: 'normal',
      padding: '2px',
    },
    original: {
      width: '100px',
      height: '50px',
      border: '1px solid #2faded',
      color: '#2faded',
      borderRadius: '5px',
      display: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      fontSize: '0.8rem',
      fontWeight: 'normal',
      padding: '5px',
      margin: '5px 0px 0px 0px',
      cursor: 'pointer',
    },
  }
}


const mapStyles = () => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      margin: '50px 0px 0px 0px',
    },
    map: {
			height: '250px',
      overflow: 'hidden',
    }
  }
}

const modalStyles = () => {
  return {
    zIndex: 15,
    position: 'fixed',
    top: '0px',
    left: '0px',
    height: '100vh',
    width: '100vw',
  }
}
