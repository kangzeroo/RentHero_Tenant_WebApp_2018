// Compt for copying as a AdPage
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import _ from 'lodash'
import $ from 'jquery'
import { withRouter } from 'react-router-dom'
import { rankOrderPics } from '../../api/ad/ad_api'
import { getCurrentListingByReference } from '../../api/listings/listings_api'
import { nextListing, incrementLikes, decrementLikes, changeShownSectionCards, setCurrentListing } from '../../actions/listings/listings_actions'
import {
  Divider,
  Button,
} from 'antd'
import {
  Modal,
} from 'antd-mobile'
import { triggerDrawerNav } from '../../actions/app/app_actions'
import AdCoverSection from './sections/AdCoverSection'
import AdFurnishSection from './sections/AdFurnishSection'
import AdBuildingSection from './sections/AdBuildingSection'
import AdFinePrintSection from './sections/AdFinePrintSection'
import AdNearbySection from './sections/AdNearbySection'
import AdStreetView from './sections/AdStreetView'
import AdMapSection from './sections/AdMapSection'
import AdImagesSection from './sections/AdImagesSection'
import AdImages from './tabs/AdImages'
import { isMobile } from '../../api/general/general_api'

class AdPage extends Component {

  constructor() {
    super()
    this.state = {
      orderedImages: [],
      show_header: true,
      commute_state: {
				commute_time: 0,
				commute_distance: 0,
      },

      photos: {
        outside: [],
        bedroom: [],
        living_room: [],
        kitchen: [],
        bathroom: [],
        img_count: 0,
      },

      toggle_modal: false,
      modal_name: '',
      context: {},

    }
    this.lastScrollTop = 0
  }

  componentDidMount() {
    if (this.props.current_listing) {
      this.organizePhotos()
    }
    if (this.props.location.search.indexOf('ref=') > -1) {
			const ref_id = this.props.location.search.slice(this.props.location.search.indexOf('ref=') + 'ref='.length)
			console.log('ref_id: ', ref_id)
			getCurrentListingByReference(ref_id)
				.then((data) => {
					this.props.setCurrentListing(data)
				})
				.catch((err) => {
					console.log(err)
				})
		}
    const scrollable = document.getElementById('AdPage')
    if (scrollable) {
      scrollable.addEventListener("scroll", () => { // or window.addEventListener("scroll"....
         const st = scrollable.scrollTop
         if (st > this.lastScrollTop){
            this.setState({
              show_header: false
            })
         } else {
            this.setState({
              show_header: true
            })
         }
         this.lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
      }, false);
    }
  }

  componentDidUpdate(prevProps, prevState) {
		if (this.props.current_listing && prevProps.current_listing !== this.props.current_listing) {
			console.log('LOADED UP MAP')
			history.pushState(null, null, `${this.props.location.pathname}?ref=${this.props.current_listing.REFERENCE_ID}`)
      this.organizePhotos()
		}
	}

  addToFavorites() {
    if (this.props.tenant_profile && this.props.tenant_profile.tenant_id) {
      addToFavoritesToSQL({
        tenant_id: this.props.tenant_profile.tenant_id,
        property_id: this.props.current_listing.REFERENCE_ID,
        meta: JSON.stringify(this.props.current_listing)
      })
        .then((data) => {
          console.log(data)
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      alert('Sign In First!')
    }
  }

  organizePhotos() {
    const pics = rankOrderPics(this.props.current_listing.IMAGES)
    /*
      pics[0] = {
        url,
        categories: {
          category,
          count,
        }
      }
    */
    const orderedImages = []
    let hasOutside = false
    const outside = pics.filter(p => {
      return p.categories.map(c => c.category).join(', ').indexOf('outside') > -1
    }).filter(p => {
      let exists = false
      orderedImages.forEach((od) => {
        if (od.url === p.url) {
          exists = true
        }
      })
      return !exists
    })
    console.log('---- OUTSIDE', outside)
    if (outside.length > 0) {
      orderedImages.push({
        url: outside[0].url,
        caption: 'Welcome to 129 Jane Street'
      })
    }

    const bedroom = pics.filter(p => {
      return p.categories.map(c => c.category).join(', ').indexOf('bedroom') > -1
    }).filter(p => {
      let exists = false
      orderedImages.forEach((od) => {
        if (od.url === p.url) {
          exists = true
        }
      })
      return !exists
    })
    console.log('---- BED', bedroom)
    if (bedroom.length > 0) {
      orderedImages.push({
        url: bedroom[0].url,
        caption: '2 Bed 1 Bath'
      })
    }

    const livingRoom = pics.filter(p => {
      return p.categories.map(c => c.category).join(', ').indexOf('livingRoom') > -1
    }).filter(p => {
      let exists = false
      orderedImages.forEach((od) => {
        if (od.url === p.url) {
          exists = true
        }
      })
      return !exists
    })
    console.log('---- LIVING', livingRoom)
    if (livingRoom.length > 0) {
      orderedImages.push({
        url: livingRoom[0].url,
        caption: 'And the living room though! Beauty!'
      })
    }

    const kitchen = pics.filter(p => {
      return p.categories.map(c => c.category).join(', ').indexOf('kitchen') > -1
    }).filter(p => {
      let exists = false
      orderedImages.forEach((od) => {
        if (od.url === p.url) {
          exists = true
        }
      })
      return !exists
    })
    console.log('---- KITCHEN', kitchen)
    if (kitchen.length > 0) {
      orderedImages.push({
        url: kitchen[0].url,
        caption: 'Modern kitcehn'
      })
    }

    const bathroom = pics.filter(p => {
      return p.categories.map(c => c.category).join(', ').indexOf('bathroom') > -1
    }).filter(p => {
      let exists = false
      orderedImages.forEach((od) => {
        if (od.url === p.url) {
          exists = true
        }
      })
      return !exists
    })
    console.log('---- BATH', bathroom)
    if (bathroom.length > 0) {
      orderedImages.push({
        url: bathroom[0].url,
        caption: 'Great bathroom too'
      })
    }

    this.setState({
      orderedImages: orderedImages,
      photos: {
        outside,
        bedroom,
        living_room: livingRoom,
        kitchen,
        bathroom,
        img_count: this.props.current_listing.IMAGES.length,
      }
    }, () => console.log(this.state.photos))
  }

  showCount() {
    const x = []
    this.props.all_listings.forEach((listing) => {
      listing.IMAGES.forEach((img) => {
        img.caption.split(',').forEach((cap) => {
          x.push(cap.trim())
        })
      })
    })
    const uniques = _.countBy(x)
    var keys = Object.keys(uniques)
    return keys.sort((a, b) => {
      return uniques[b] - uniques[a]
    }).map(k => {
      return (<div>{`${k}: ${uniques[k]}`}</div>)}
    )
  }

  scrollDownToImages() {
    // console.log('scrollDownToImages')
    // $('#AdPage').animate({
    //     scrollTop: document.getElementById("AdPage").scrollHeight - $(`#all_images`).position().top
    // }, 1000);
    document.getElementById('all_images').scrollIntoView({ behavior: "smooth", block: "start" })
  }

  toggleModal(bool, attr, context) {
    history.pushState(null, null, `${this.props.location.pathname}?ref=${this.props.current_listing.REFERENCE_ID}/${attr}`)
    this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context,
    })
  }

  renderAppropriateModal(modal_name, context) {
    if (modal_name === 'images') {
      return (
        <Modal
          visible={this.state.toggle_modal}
          transparent
          maskClosable={false}
          style={
            isMobile()
            ?
            {
              height: '100vh',
              width: '100vw',
            }
            :
            {
              height: '100vh',
              width: '100vh',
            }
          }
        >
          <AdImages
            photos={this.state.photos}
            onClose={() => this.toggleModal(false)}
          />
        </Modal>
      )
    }
  }


  // <div onClick={() => this.props.nextListing()} style={actionStyles().dislike}>
  //   <i className='ion-thumbsdown' style={{ fontSize: '2rem', color: '#f23939' }} />
  // </div>
  // <div onClick={() => window.open(this.props.current_listing.URL, '_blank')} style={actionStyles().contact}>
  //   VIEW ORIGINAL
  // </div>
  // <div onClick={() => this.props.nextListing()} style={actionStyles().like}>
  //   <i className='ion-thumbsup' style={{ fontSize: '2rem', color: '#0ca20c' }} />
  // </div>

  renderStickyFooter() {
    return (
      <div style={actionStyles(isMobile()).container}>
        <div style={{ fontSize: '1.2REM', fontWeight: 'bold', color: 'black' }}>{`$ ${this.props.current_listing.PRICE}`}</div>
        <Button type='primary' style={actionStyles().actionButton} size='large'>
          Book Tour
        </Button>
      </div>
    )
  }


	render() {
    if (this.props.current_listing) {
  		return (
  			<div id='AdPage' style={comStyles().container}>
          <div style={{ width: '100%', height: '50px' }}></div>
          {
            this.state.show_header
            ?
            <div style={headerStyles().container}>
              <div onClick={() => this.props.triggerDrawerNav(true)} style={headerStyles().menu}><i className='ion-navicon-round' style={{ fontSize: '1.3rem' }}></i></div>
      				<div style={headerStyles().address}>{this.props.current_listing.ADDRESS.split(',')[0]}</div>
              {/*<div style={headerStyles().price}>${this.props.current_listing.PRICE}</div>*/}
              {/*<div onClick={() => this.props.nextListing()} style={headerStyles().more}><i className='ion-android-more-vertical' style={{ fontSize: '1.3rem' }}></i></div>*/}
            </div>
            :
            null
          }
          <AdCoverSection
            current_listing={this.props.current_listing}
            beds={this.props.current_listing.BEDS}
            baths={this.props.current_listing.BATHS}
            seller={this.props.current_listing.SELLER}
            commute_time={this.state.commute_state.commute_time}
            arrival_time={'10am'}
            scrollDownToImages={() => this.scrollDownToImages()}
            onShowAll={() => this.toggleModal(true, 'images')}
          />
          <div style={{ margin: '20px' }}>
            <AdMapSection
              setCommuteState={(commute_state) => this.setState({ commute_state: commute_state })}
              main_destination={this.props.main_destination}
              arrival_time={123}
              current_listing={this.props.current_listing}
            />
          </div>
          <div style={{ width: '100%', height: '70px' }}></div>

          <Divider />
          <AdImagesSection
            photos={this.state.photos}
            onShowAll={() => this.toggleModal(true, 'images')}
          />

          <Divider />

          <div style={{ width: '100%', height: '70px' }}></div>
          {
            this.renderStickyFooter()
          }
          {
            this.renderAppropriateModal(this.state.modal_name, this.state.context)
          }
  			</div>
  		)
    } else {
      return (<div></div>)
    }
	}
}

// defines the types of variables in this.props
AdPage.propTypes = {
	history: PropTypes.object.isRequired,
	current_listing: PropTypes.object,
	all_listings: PropTypes.array.isRequired,
	nextListing: PropTypes.func.isRequired,
	main_destination: PropTypes.string,
  setCurrentListing: PropTypes.func.isRequired,
}

// for all optional props, define a default value
AdPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AdPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		current_listing: redux.listings.current_listing,
    all_listings: redux.listings.all_listings,
		main_destination: redux.prefs.LOCATION.DESTINATION_ADDRESS,
  	triggerDrawerNav: PropTypes.func.isRequired,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		nextListing,
    setCurrentListing,
    triggerDrawerNav,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'scroll',
      // background: '#ECE9E6',  /* fallback for old browsers */
      // background: '-webkit-linear-gradient(to right, #FFFFFF, #ECE9E6)',  /* Chrome 10-25, Safari 5.1-6 */
      // background: 'linear-gradient(to right, #FFFFFF, #ECE9E6)', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
		}
	}
}

const headerStyles = () => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      color: '#36454f',
      position: 'fixed',
      zIndex: 5,
      top: '0px',
      left: '0px',
      width: '100%',
      backgroundColor: 'white',
      height: '50px',
    },
    menu: {
      display: 'flex',
      width: '10%',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '10px 10px 10px 10px',
    },
    price: {
      width: '25%',
      fontSize: '1.2rem',
      padding: '10px 10px 10px 10px',
    },
    address: {
      width: '90%',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '10px 10px 10px 10px',
    },
    more: {
      display: 'flex',
      width: '10%',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '10px 10px 10px 10px',
    },

  }
}

const actionStyles = (mobile) => {
  let attrs
  if (mobile) {
    attrs = {
      width: '100%',
    }
  } else {
    attrs = {
      width: '40%',
    }
  }
  return {
    container: {
      position: 'fixed',
      height: '70px',
      bottom: '0px',
      left: '0px',
      backgroundColor: 'rgba(256,256,256,0.9)',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: '0px 0px 0px 0px',
      zIndex: 5,
      padding: '0px 20px',
      borderTop: 'lightgray solid thin',
      ...attrs,
    },
    dislike: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '70%',
      width: '25%',
      border: '1px solid #f23939',
      borderRadius: '10px',
    },
    like: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '70%',
      width: '25%',
      border: '1px solid #0ca20c',
      borderRadius: '10px',
    },
    contact: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '70%',
      width: '35%',
      border: '1px solid #2faded',
      borderRadius: '10px',
      color: '#2faded',
      fontWeight: 'regular',
    },
    actionButton: {
      backgroundImage: 'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)',
      width: '45%',
      border: 'none',
      // height: '90%',
    }
  }
}
