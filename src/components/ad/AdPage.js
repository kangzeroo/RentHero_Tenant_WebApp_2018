// Compt for copying as a AdPage
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'
import { rankOrderPics } from '../../api/ad/ad_api'
import { nextListing, incrementLikes, decrementLikes, changeShownSectionCards, setCurrentListing } from '../../actions/listings/listings_actions'
import {

} from 'antd-mobile'
import AdCoverSection from './sections/AdCoverSection'
import AdFurnishSection from './sections/AdFurnishSection'
import AdBuildingSection from './sections/AdBuildingSection'
import AdFinePrintSection from './sections/AdFinePrintSection'
import AdNearbySection from './sections/AdNearbySection'


class AdPage extends Component {

  constructor() {
    super()
    this.state = {
      orderedImages: []
    }
  }

  componentDidMount() {
    if (this.props.current_listing) {
      this.organizePhotos()
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

	render() {
    if (this.props.current_listing) {
  		return (
  			<div id='AdPage' style={comStyles().container}>
          <h1>${this.props.current_listing.PRICE}</h1>
  				<h2>{this.props.current_listing.ADDRESS}</h2>
          <button onClick={() => this.props.nextListing()}>Next</button>
          {
            this.state.orderedImages[0]
            ?
            <AdCoverSection
              current_listing={this.props.current_listing}
              cover_image={this.state.orderedImages[0].url}
              beds={this.props.current_listing.BEDS}
              baths={this.props.current_listing.BATHS}
              seller={this.props.current_listing.SELLER}
              main_destination={this.props.main_destination.split(',')[0]}
              arrival_time={'10am'}
            />
            :
            null
          }
          {console.log(this.state.orderedImages)}
          {
            this.state.orderedImages[0]
            ?
            <AdFurnishSection
              current_listing={this.props.current_listing}
              images={this.state.orderedImages.slice(1, 4).map(img => img.url)}
            />
            :
            null
          }
          {
            this.state.orderedImages[0]
            ?
            <AdBuildingSection
              current_listing={this.props.current_listing}
              images={this.state.orderedImages.slice(4).map(img => img.url)}
            />
            :
            null
          }
          {
            this.state.orderedImages[0]
            ?
            <AdFinePrintSection
              current_listing={this.props.current_listing}
            />
            :
            null
          }
          {
            this.state.orderedImages[0]
            ?
            <AdNearbySection
              current_listing={this.props.current_listing}
            />
            :
            null
          }
          {/*
            this.props.current_listing
            ?
            <div>
              {
                this.state.orderedImages.map((img) => {
                  return (
                    <div>
                      <h6>{img.caption}</h6>
                      <img src={img.url} style={{ width: '100%', minWidth: '100%', height: 'auto' }} />
                    </div>
                  )
                })
              }
            </div>
            :
            null
          */}
          {/*<div style={{ display: 'flex', flexDirection: 'column' }}>
            {
              this.showCount()
            }
          </div>*/}
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
		main_destination: redux.tenant.prefs.destination.address,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		nextListing,
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
