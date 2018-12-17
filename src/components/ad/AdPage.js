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

} from 'antd-mobile'
import { triggerDrawerNav } from '../../actions/app/app_actions'
import AdCoverSection from './sections/AdCoverSection'
import AdFurnishSection from './sections/AdFurnishSection'
import AdBuildingSection from './sections/AdBuildingSection'
import AdFinePrintSection from './sections/AdFinePrintSection'
import AdNearbySection from './sections/AdNearbySection'
import AdStreetView from './sections/AdStreetView'
import AdMapSection from './sections/AdMapSection'



class AdPage extends Component {

  constructor() {
    super()
    this.state = {
      orderedImages: [],
      show_header: true,
      commute_state: {
				commute_time: 0,
				commute_distance: 0,
      }
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
      orderedImages: orderedImages
    })
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

	render() {
    if (this.props.current_listing) {
  		return (
  			<div id='AdPage' style={comStyles().container}>
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
          />
          <AdMapSection
            setCommuteState={(commute_state) => this.setState({ commute_state: commute_state })}
            main_destination={this.props.main_destination}
            arrival_time={123}
            current_listing={this.props.current_listing}
          />
          <div style={{ width: '100%', height: '70px' }}></div>
          <div id='all_images' style={{ height: 'auto', display: 'flex', flexDirection: 'column' }}>
              {
                this.props.current_listing.IMAGES.map((img, index) => {
                    return (
                      <img
                        id="img_carousel_modal"
                        src={img.url}
                        alt=""
                        style={{ width: '100%', height: 'auto', margin: '5px 0px 5px 0px' }}
                        onLoad={() => {
                          // fire window resize event to change height
                          // window.dispatchEvent(new Event('resize'));
                          // this.setState({ imgHeight: '50vh' });
                          // this.renderPriceTag()
                        }}
                      />
                  )
                })
              }
          </div>
          <div style={{ width: '100%', height: '70px' }}></div>
          <div style={actionStyles().container}>
            <div onClick={() => this.props.nextListing()} style={actionStyles().dislike}>
              <i className='ion-thumbsdown' style={{ fontSize: '2rem', color: '#f23939' }} />
            </div>
            <div onClick={() => window.open(this.props.current_listing.URL, '_blank')} style={actionStyles().contact}>
              VIEW ORIGINAL
            </div>
            <div onClick={() => this.props.nextListing()} style={actionStyles().like}>
              <i className='ion-thumbsup' style={{ fontSize: '2rem', color: '#0ca20c' }} />
            </div>
          </div>
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
      backgroundColor: 'rgba(0,0,0,0)',
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
    }
  }
}

const actionStyles = () => {
  return {
    container: {
      position: 'fixed',
      width: '100%',
      height: '70px',
      bottom: '0px',
      left: '0px',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      borderRadius: '0px 0px 0px 0px',
      zIndex: 5,
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
      width: '30%',
      border: '1px solid #2faded',
      borderRadius: '10px',
      color: '#2faded',
      fontWeight: 'regular',
    },
  }
}
