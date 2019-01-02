// Compt for copying as a AdsHome
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'antd'
import AdsPage from './AdsPage'
import AdPage from './AdPage'
import HeatMap from '../hunting/HeatMapHunting'
import { isMobile } from '../../api/general/general_api'
import { getCurrentListingByReference } from '../../api/listings/listings_api'
import { nextListing, incrementLikes, decrementLikes, changeShownSectionCards, setCurrentListing } from '../../actions/listings/listings_actions'
import DesktopHeader from '../format/desktop/DesktopHeader'

class AdsHome extends Component {

	constructor() {
		super()
		this.state = {
			mobile: false,

      show_listing: false,
      current_listing: {},

      loading: true,

			ref_id: '',
		}
	}

	componentWillMount() {
		this.setState({
			mobile: isMobile()
		})
    console.log(this.props.location)
    if (this.props.location.pathname.indexOf('/matches/') > -1) {
      console.log(this.props.location)
      const ref_id = this.props.location.pathname.slice(this.props.location.search.indexOf('/matches/') + '/matches/'.length + 1)
      console.log('ref_id:')
			console.log(ref_id)
      if (ref_id) {
        this.setState({
          show_listing: true,
					ref_id,
        })
      } else {
        this.setState({
          show_listing: false,
					ref_id,
        })
      }

			console.log(ref_id)
			getCurrentListingByReference({ ref_id })
				.then((data) => {
					if (data) {
						console.log('CURRENT LISTING: ', data)
						this.props.setCurrentListing(data)
						this.setState({
							loading: false,
							current_listing: data,
						})
					}
				})
				.catch((err) => {
					console.log(err)
				})
    }
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.current_listing !== nextProps.current_listing) {
			this.setState({
				current_listing: nextProps.current_listing,
			})
		}
		// if (this.props.loading_complete !== nextProps.loading_complete) {
		// 	this.refreshCurrentListing(this.state.ref_id)
		// }
	}

	refreshCurrentListing(ref_id) {
		console.log('getCurrentListingByReference FAILED, filtering through all listings...')
		const foundListing = this.props.all_listings.filter(li => li.REFERENCE_ID === ref_id)
		if (foundListing && foundListing.length > 0) {
			const cListing = foundListing[0]
			console.log('CURRENT LISTING: ', cListing)
			this.props.setCurrentListing(cListing)
			this.setState({
				loading: false,
				current_listing: cListing,
			})
		}
	}

  setListing(listing, url) {
    this.setState({
      current_listing: listing,
      // show_listing: url && listing && listing.REFERENCE_ID,
      loading: false,
    })
    this.props.setCurrentListing(listing)
		if (url) {
    	// history.pushState(null, null, url)
			const win = window.open(`${window.location.protocol}//${window.location.host}${url}`, '_blank');
  		win.focus();
		}
  }


	componentDidUpdate(prevProps, prevState) {
		if (isMobile() !== this.state.mobile) {
			console.log('mobile changed....')
			this.setState({
				mobile: isMobile(),
			})
		}
		if (this.props.current_listing && prevProps.current_listing !== this.props.current_listing) {
      this.setState({
				current_listing: this.props.current_listing
			})
		}
	}

	render() {
		if (this.state.mobile) {
			return (
				<div id='AdsHome' style={comStyles().container}>
          <DesktopHeader />
	        <div style={{ width: '100vw', height: '93vh' }}>
            {
              this.state.show_listing
              ?
              <AdPage
                width='100vw'
                current_listing={this.state.current_listing}
                loading={this.state.loading}
                setListing={(listing, url) => this.setListing(listing, url)}
              />
              :
              <AdsPage
                width='100vw'
                setListing={(listing, url) => this.setListing(listing, url)}
              />
            }
	        </div>
				</div>
			)
		} else {
			return (
				<div id='AdsHome' style={comStyles().container}>
          <DesktopHeader />
          <div style={comStyles().rowContainer}>
  	        <div style={{ width: '40vw', overflowY: 'scroll', height: '93vh', }}>
              {
                this.state.show_listing
                ?
                <AdPage
                  width='40vw'
                  current_listing={this.state.current_listing}
                  loading={this.state.loading}
                  setListing={(listing, url) => this.setListing(listing, url)}
                />
                :
                <AdsPage
                  width='40vw'
                  setListing={(listing, url) => this.setListing(listing, url)}
                />
              }

  	        </div>
  	        <div style={{ width: '60vw', height: '93vh' }}>
							{
								this.props.all_listings && this.props.all_listings.length > 0
								?
								<HeatMap
									listings={this.props.all_listings}
									setListing={(listing, url) => this.setListing(listing, url)}
									current_listing={this.state.current_listing}
									showFlagPin={true}
									previewEnterable={!this.state.show_listing}
									preview={!this.state.show_listing}
								/>
								:
								null
							}

  	        </div>
          </div>
				</div>
			)
		}

	}
}

// defines the types of variables in this.props
AdsHome.propTypes = {
	history: PropTypes.object.isRequired,
  all_listings: PropTypes.array.isRequired,
	current_listing: PropTypes.object,
  setCurrentListing: PropTypes.func.isRequired,
  loading_complete: PropTypes.bool.isRequired,
	prefs: PropTypes.object.isRequired,
}

// for all optional props, define a default value
AdsHome.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AdsHome)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    all_listings: redux.listings.all_listings,
    loading_complete: redux.app.loading_complete,
		current_listing: redux.listings.current_listing,
		prefs: redux.prefs,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    setCurrentListing,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
		},
    rowContainer: {
      display: 'flex',
      flexDirection: 'row',
      maxHeight: '93vh',
		}
	}
}
