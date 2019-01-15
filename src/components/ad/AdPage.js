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
  Icon,
  Card,
  Spin,
  message,
} from 'antd'
import {
  Modal,
} from 'antd-mobile'
import { triggerDrawerNav } from '../../actions/app/app_actions'
import { saveTenantFavoritesToRedux } from '../../actions/tenant/tenant_actions'
import { removeFavoriteForTenant, addToFavoritesToSQL } from '../../api/tenant/tenant_api'
import AdCoverSection from './sections/AdCoverSection'
import AdFurnishSection from './sections/AdFurnishSection'
import AdBuildingSection from './sections/AdBuildingSection'
import AdFinePrintSection from './sections/AdFinePrintSection'
import AdNearbySection from './sections/AdNearbySection'
import AdStreetView from './sections/AdStreetView'
import AdMapSection from './sections/AdMapSection'
import AdImagesSection from './sections/AdImagesSection'
import AdImages from './tabs/AdImages'
import ListingActions from './tabs/ListingActions'
import { isMobile } from '../../api/general/general_api'
import AuthenticatePopup from '../auth/AuthenticatePopup'
import NearbyLocations from './sections/NearbyLocations'
import { saveNearbyLocationsToRedux } from '../../actions/map/map_actions'

class AdPage extends Component {

  constructor() {
    super()
    this.state = {
      orderedImages: [],
      show_header: true,

      photos: {
        outside: [],
        bedroom: [],
        living_room: [],
        kitchen: [],
        bathroom: [],
        img_count: 0,
      },

      // commute data
      commute_state: {
        commute_time: 0,
        commute_distance: 0,
      },


      toggle_modal: false,
      modal_name: '',
      context: {},

      loading: false,

      listing_is_favorited: false,

      loading_fav: false,
    }
    this.lastScrollTop = 0
  }

  componentWillMount() {
    // console.log(this.props.location)
    // if (this.props.location.pathname.indexOf('/matches/') > -1) {
    //   console.log(this.props.location)
		// 	const ref_id = this.props.location.pathname.slice(this.props.location.search.indexOf('/matches/') + '/matches/'.length + 1)
		// 	console.log('ref_id: ', ref_id)
		// 	getCurrentListingByReference({ ref_id })
		// 		.then((data) => {
		// 			this.props.setCurrentListing(data)
    //       this.setState({
    //         loading: false,
    //       })
		// 		})
		// 		.catch((err) => {
		// 			console.log(err)
		// 		})
		// }
    this.refreshFavorites(this.props.tenant_favorites, this.props.current_listing)
  }


  componentDidMount() {
    window.onpopstate = () => {
      this.toggleModal(false)
      history.pushState(null, null, `${this.props.location.pathname}`)
    }
    if (this.props.current_listing && this.props.current_listing.REFERENCE_ID) {
      this.organizePhotos()
    }
    console.log(this.props.location)
    // if (this.props.location.pathname.indexOf('/matches/') > -1) {
    //   console.log(this.props.location)
		// 	const ref_id = this.props.location.pathname.slice(this.props.location.pathname.indexOf('/matches/') + '/matches/'.length + 1)
		// 	console.log('ref_id: ', ref_id)
		// 	getCurrentListingByReference({ ref_id })
		// 		.then((data) => {
		// 			this.props.setCurrentListing(data)
		// 		})
		// 		.catch((err) => {
		// 			console.log(err)
		// 		})
		// }
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
      this.organizePhotos()
      console.log(this.props.location)
      history.pushState(null, null, `/matches/${this.props.current_listing.REFERENCE_ID}`)
		}
	}

  componentWillReceiveProps(nextProps) {
    if (this.props.tenant_favorites !== nextProps.tenant_favorites) {
      this.refreshFavorites(nextProps.tenant_favorites, nextProps.current_listing)
    }
    if (this.props.current_listing !== nextProps.current_listing) {
      this.refreshFavorites(nextProps.tenant_favorites, nextProps.current_listing)
    }
  }

  refreshFavorites(tenant_favorites, current_listing) {
    console.log('REFRESH FAVORITES ', tenant_favorites)
    console.log('CURRENT_LISTING: ', current_listing)
    if (tenant_favorites) {
      const listingFavorite = tenant_favorites.filter(fav => fav.property_id === current_listing.REFERENCE_ID)
      console.log(listingFavorite)
      if (listingFavorite.length > 0) {
        console.log('THIS IS A FAVORITE')
        this.setState({
          listing_is_favorited: true,
        })
      } else {
        this.setState({
          listing_is_favorited: false,
        })
      }
    }
  }

  favoriteListing() {
    if (this.props.tenant_profile && this.props.tenant_profile.tenant_id && this.props.authenticated && this.props.tenant_profile.authenticated) {
      if (this.state.listing_is_favorited) {
        console.log('REMOVE FROM FAVORITES')
        this.setState({
          loading_fav: true,
        })
        removeFavoriteForTenant({
          tenant_id: this.props.tenant_profile.tenant_id,
          property_id: this.props.current_listing.REFERENCE_ID,
        })
          .then((data) => {
            this.props.saveTenantFavoritesToRedux(data)
            console.log(data)
            this.setState({
              loading_fav: false,
            })
          })
          .catch((err) => {
            console.log(err)
            this.setState({
              loading_fav: false,
            })
          })
      } else {
        console.log('ADD TO FAVORITES')
        this.setState({
          loading_fav: true,
        })
        addToFavoritesToSQL({
          tenant_id: this.props.tenant_profile.tenant_id,
          property_id: this.props.current_listing.REFERENCE_ID,
          meta: '',
        })
          .then((data) => {
            console.log(data)
            message.success(data.message)
            this.props.saveTenantFavoritesToRedux(data.favorites)
            console.log(data)
            this.setState({
              loading_fav: false,
            })
          })
          .catch((err) => {
            console.log(err)
            this.setState({
              loading_fav: false,
            })
          })
      }
    } else {
      this.toggleModal(true, 'authenticate', this.props.current_listing)
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

  backToAllAds(listing, url) {

    this.props.setListing(listing, url)
  }

  toggleModal(bool, attr, context) {
    if (attr) {
      history.pushState(null, null, `/matches/${this.props.current_listing.REFERENCE_ID}?tab=${attr}`)
    } else {
      history.pushState(null, null, `/matches/${this.props.current_listing.REFERENCE_ID}`)
    }
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
          maskClosable
          onClose={() => this.toggleModal(false)}
          animationType='fade'
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
              width: '60vw',
              position: 'absolute',
              right: 0,
              top: 0,
              borderRadius: '0px !important',
            }
          }
        >
          <AdImages
            photos={this.state.photos}
            onClose={() => this.toggleModal(false)}
            current_listing={context}
          />
        </Modal>
      )
    } else if (modal_name === 'dialog') {
      return (
        <Modal
          visible={this.state.toggle_modal}
          transparent
          maskClosable
          onClose={() => this.toggleModal(false)}
          animationType='fade'
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
              height: '101vh',
              width: '60vw',
              position: 'absolute',
              right: 0,
              top: '-1vh',
              borderRadius: '0px !important',
            }
          }
        >
          <ListingActions
            onClose={() => this.toggleModal(false)}
            closeModal={() => this.toggleModal(false)}
            current_listing={context}
          />
        </Modal>
      )
    } else if (modal_name === 'authenticate') {
      return (
        <Modal
          visible={this.state.toggle_modal}
          transparent
          maskClosable
          onClose={() => this.toggleModal(false)}
          animationType='fade'
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
              width: '60vw',
              position: 'absolute',
              right: 0,
              top: 0,
              borderRadius: '0px !important',
            }
          }
        >
          <AuthenticatePopup
            title={'Save to list'}
            desc={'Save this listing using your phone number or email'}
            onClose={() => this.toggleModal(false)}
            current_listing={context}
          />
        </Modal>
      )
    }
  }

  renderStickyFooter() {
    return (
      <div style={actionStyles(isMobile()).container}>
        {
          this.state.listing_is_favorited
          ?
          <Icon
            type="heart"
            theme="twoTone"
            twoToneColor="#eb2f96"
            style={{
              // position: 'absolute',
              // top: '10px',
              // right: '10px',
              zIndex: 60,
              cursor: 'pointer',
              fontSize: '2rem',
              ":hover": {
                background: 'white',
                color: 'white',
              }
            }}
            onClick={() => this.favoriteListing()}
            disabled={this.state.loading_fav}
          />
          :
          <Icon
            type="heart"
            theme="outlined"
            size='large'
            style={{
              // position: 'absolute',
              // top: '10px',
              // right: '10px',
              zIndex: 60,
              color: '#2faded',
              cursor: 'pointer',
              fontSize: '2rem',
              ":hover": {
                background: '#eb2f96',
                color: 'red',
              }
            }}
            onClick={this.state.loading_fav ? () => {} : () => this.favoriteListing()}
            disabled={this.state.loading_fav}
          />
        }
        <Button onClick={(e) => this.clickedInquire(e)} type='primary' style={actionStyles().actionButton} size='large'>
          INQUIRE
        </Button>
        <Icon
          type="caret-left"
          size='large'
          style={{
            // position: 'absolute',
            // top: '10px',
            // right: '10px',
            zIndex: 60,
            color: '#2faded',
            cursor: 'pointer',
            fontSize: '2rem',
            ":hover": {
              background: '#eb2f96',
              color: 'red',
            }
          }}
          onClick={() => this.props.nextListing(-1)}
        />
        <Icon
          type="caret-right"
          size='large'
          style={{
            // position: 'absolute',
            // top: '10px',
            // right: '10px',
            zIndex: 60,
            color: '#2faded',
            cursor: 'pointer',
            fontSize: '2rem',
            ":hover": {
              background: '#eb2f96',
              color: 'red',
            }
          }}
          onClick={() => this.props.nextListing(1)}
        />
      </div>
    )
  }

  clickedInquire(e) {
    if (e) {
      e.stopPropagation()
    }
    // console.log(window.location.hostname)
    // const win = window.open(`/p/${this.props.current_listing.SHORT_ID || this.props.current_listing.REFERENCE_ID}`, '_blank');
    const win = window.open(this.props.current_listing.URL)
    win.focus();
    // this.toggleModal(true, 'dialog', this.props.current_listing)
  }

	render() {
    if (this.props.loading) {
      return (
        <div id='AdPage' style={comStyles().loadingContainer}>
          <div style={{ display: 'flex', height: '30%', justifyContent: 'center', alignItems: 'center', }}>
            <Spin />
          </div>
          <Card bordered={false} loading />

        </div>
      )
    } else if (this.props.current_listing) {
  		return (
  			<div id='AdPage' style={comStyles().container}>
          <AdCoverSection
            current_listing={this.props.current_listing}
            title={this.props.current_listing.TITLE}
            beds={this.props.current_listing.BEDS}
            baths={this.props.current_listing.BATHS}
            seller={this.props.current_listing.SELLER}
            commute_time={this.state.commute_state.commute_time}
            commute_distance={this.state.commute_state.commute_distance}
            arrival_time={'10am'}
            scrollDownToImages={() => this.scrollDownToImages()}
            onShowAll={() => this.toggleModal(true, 'images', this.props.current_listing)}
            setListing={(listing, url) => this.backToAllAds(listing, url)}
            listing_is_favorited={this.state.listing_is_favorited}
            favoriteListing={() => this.favoriteListing()}
            loading={this.state.loading_fav}
          />
          {/*
          <div style={{ margin: '20px' }}>
            <AdMapSection
              setCommuteState={(commute_state) => this.setState({ commute_state: commute_state })}
              main_destination={this.props.main_destination}
              arrival_time={123}
              current_listing={this.props.current_listing}
            />
          </div>
          <div style={{ width: '100%', height: '70px' }}></div>

          */}
          <div dangerouslySetInnerHTML={{ __html: this.props.current_listing.DESCRIPTION }} style={{ margin: '0px 10px 0px 10px' }}></div>

          <Divider />
          <AdImagesSection
            photos={this.state.photos}
            onShowAll={() => this.toggleModal(true, 'images', this.props.current_listing)}
          />

          <Divider />
          {
            this.props.map_loaded
            ?
            <NearbyLocations
              current_listing={this.props.current_listing}
              setCommuteState={(commute_state) => this.setState({ commute_state: commute_state })}
            />
            :
            null
          }
          <Divider />

          <AdStreetView
            current_listing={this.props.current_listing}
          />

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
	current_listing: PropTypes.object,         // passed in
	all_listings: PropTypes.array.isRequired,
	nextListing: PropTypes.func.isRequired,
	main_destination: PropTypes.string,
  setCurrentListing: PropTypes.func.isRequired,
  tenant_favorites: PropTypes.array.isRequired,
  saveTenantFavoritesToRedux: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,   // passed in
  setListing: PropTypes.func.isRequired,    // passed in
  tenant_profile: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  map_loaded: PropTypes.bool.isRequired,
  prefs: PropTypes.object.isRequired,
  nearby_locations: PropTypes.object,
  saveNearbyLocationsToRedux: PropTypes.func.isRequired,

}

// for all optional props, define a default value
AdPage.defaultProps = {
  nearby_locations: {},

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AdPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		// current_listing: redux.listings.current_listing,
    all_listings: redux.listings.all_listings,
		main_destination: redux.prefs.LOCATION.DESTINATION_ADDRESS,
  	triggerDrawerNav: PropTypes.func.isRequired,
    tenant_favorites: redux.tenant.favorites,
    tenant_profile: redux.auth.tenant_profile,
    authenticated: redux.auth.authenticated,
    map_loaded: redux.map.map_loaded,
    prefs: redux.prefs,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		nextListing,
    setCurrentListing,
    triggerDrawerNav,
    saveTenantFavoritesToRedux,
    saveNearbyLocationsToRedux,
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
		},
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '93vh',
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
      border: 'none',
      fontWeight: 'bold',
      width: '60%'
      // height: '90%',
    },
    header_container: {
      position: 'fixed',
      height: '70px',
      top: '0px',
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
  }
}
