// Compt for copying as a AdCoverSection
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Badge,
  Carousel,
  Icon,
  Modal,
} from 'antd-mobile'
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
            <i className='ion-chevron-left' style={{ fontSize: '1.3rem' }}></i>
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
                    history.pushState(null, null, `${this.props.location.pathname}?show=images`)
                  }}
                >
                  <img
                    id="img_carousel"
                    src={img.url}
                    alt=""
                    style={{ width: '100%', verticalAlign: 'top', borderRadius: '10px', overflow: 'hidden' }}
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
            <i className='ion-chevron-right' style={{ fontSize: '1.3rem' }}></i>
          </div>
        </div>
      </div>
    )
  }

  renderDescription() {
    return (
      <div key='description' style={descriptionStyles().container}>
        <div style={descriptionStyles().left}>
          <div style={descriptionStyles().beds_baths}>{`${this.props.beds} BEDS • ${this.props.baths} BATHS`}</div>
          <div style={descriptionStyles().price_by}>{`By ${this.props.seller}`.toUpperCase()}</div>
        </div>
        <div style={descriptionStyles().right}>
          <div style={descriptionStyles().price}>{`$${this.props.current_listing.PRICE}`}</div>
          <div style={descriptionStyles().commute}>{`${(this.props.commute_time/60).toFixed(0)} mins`}</div>
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
  beds: PropTypes.number.isRequired,     // passed in
  baths: PropTypes.number.isRequired,     // passed in
  seller: PropTypes.string.isRequired,     // passed in
  commute_time: PropTypes.number.isRequired,     // passed in
  current_listing: PropTypes.object.isRequired,     // passed in
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
      padding: '10px',
      borderRadius: '10px',
    }
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
      width: '100%',
      backgroundColor: 'green',
      color: 'white',
      borderRadius: '5px',
      display: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      fontSize: '0.8rem',
      fontWeight: 'normal',
      padding: '2px',
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
