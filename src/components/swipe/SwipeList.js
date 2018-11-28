// Compt for copying as a SwipeList
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import uuid from 'uuid'
import PropTypes from 'prop-types'
import moment from 'moment'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Carousel,
	Tag,
	Card,
	Badge,
	Button,
	Icon,
	Tabs,
	SegmentedControl,
	Modal,
} from 'antd-mobile'
import { triggerDrawerNav } from '../../actions/app/app_actions'
import { getCurrentListingByReference } from '../../api/listings/listings_api'
import { nextListing, incrementLikes, decrementLikes, changeShownSectionCards, setCurrentListing } from '../../actions/listings/listings_actions'
import CommuteMap from '../modules/CommuteMap/CommuteMap'
import NearbyLocations from '../modules/NearbyLocations/NearbyLocations'
import StreetView from '../modules/StreetView/StreetView'


class SwipeList extends Component {

	constructor() {
		super()
		this.state = {
			imgHeight: '40vh',
			priceHeight: 0,
			segment_index: 0,
			property_tab_index: 0,
			location_tab_index: 0,
			show_images_modal: false,
			imageCarouselSelectedIndex: 0,
			commute_state: {
				commute_time: 0,
				commute_distance: 0,
			},
			nearby_state: {
				count: 0,
			},
			streetview_state: {

			},
			amenities_state: {
				greatness: 0,
			}
		}
	}

	componentDidMount() {
    window.onpopstate = () => {
      history.pushState(null, null, `${this.props.location.pathname}`)
      this.setState({ show_images_modal: false })
    }
		console.log(this.props.location)
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
		} else {
			if (this.props.current_listing && this.props.current_listing.listing) {
				history.pushState(null, null, `${this.props.location.pathname}?ref=${this.props.current_listing.listing.REFERENCE_ID}`)
			}
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.current_listing.listing && prevProps.current_listing !== this.props.current_listing) {
			console.log('LOADED UP MAP')
			history.pushState(null, null, `${this.props.location.pathname}?ref=${this.props.current_listing.listing.REFERENCE_ID}`)
		}
	}

	renderPriceTag() {
		if (document.getElementById('img_carousel')) {
			this.state.priceHeight = document.getElementById('img_carousel').clientHeight
		}
	}

	clickedJudgement(judgement) {
		this.props.nextListing(judgement)
		if (judgement === 'likes') {
			this.props.incrementLikes('likes', this.props.current_listing.listing.REFERENCE_ID)
			this.props.decrementLikes('dislikes', this.props.current_listing.listing.REFERENCE_ID)
		} else if (judgement === 'dislikes') {
			this.props.incrementLikes('dislikes', this.props.current_listing.listing.REFERENCE_ID)
			this.props.decrementLikes('likes', this.props.current_listing.listing.REFERENCE_ID)
		}
		if (this.props.likes.length === 3) {
			this.props.history.push('/dialog/moveinprefs/me')
		}
		if (this.props.likes.length === 6) {
			this.props.history.push('/dialog/credit_report/me')
		}
		if (this.props.likes.length > 8 && this.props.likes.concat(this.props.dislikes).length > 18) {
			if (1 - Math.random() <= 0.1) {
				window.open('https://renthero-ai.typeform.com/to/Wrmvfe', '_blank')
			}
		}
		window.scrollTo(0,0)
	}

	clickedSegment(e) {
		console.log(e.nativeEvent)
		this.setState({
			segment_index: e.nativeEvent.selectedSegmentIndex
		})
		if (e.nativeEvent.selectedSegmentIndex === 0) {
			document.getElementById("location_info").scrollIntoView()
		} else if (e.nativeEvent.selectedSegmentIndex === 1) {
			document.getElementById("property_info").scrollIntoView()
		} else if (e.nativeEvent.selectedSegmentIndex === 2) {
			document.getElementById("availability_info").scrollIntoView()
		}
	}

	turnImageCarousel(amount) {
		let nextIndex = this.state.imageCarouselSelectedIndex
		if (this.state.imageCarouselSelectedIndex + amount < 0) {
			nextIndex = this.props.current_listing.listing.IMAGES.length - 1
		} else if (this.state.imageCarouselSelectedIndex + amount > this.props.current_listing.listing.IMAGES.length - 1) {
			nextIndex = 0
		} else {
			nextIndex = this.state.imageCarouselSelectedIndex + amount
		}
		this.setState({
			imageCarouselSelectedIndex: nextIndex
		})
	}

	render() {
		if (this.props.current_listing) {
			const location_tabs = []
			if (this.state.commute_state.commute_time) {
				location_tabs.push({
					title: 'COMMUTE',
					section: 'commute',
				})
			}
			if (this.state.nearby_state) {
				location_tabs.push({
					title: `NEARBY`,
					section: 'nearby',
				})
			}
			if (this.state.streetview_state) {
				location_tabs.push({
					title: `STREET VIEW`,
					section: 'streetview',
				})
			}
			return (
				<div id='SwipeList' style={comStyles().container}>
					{/*<div onClick={() => this.props.triggerDrawerNav(true)} style={{ position: 'fixed', top: '20px', left: '20px', zIndex: '4' }}>
						<Icon type='ellipsis' size='lg' />
					</div>*/}
					<Modal
						visible={this.state.show_images_modal}
						transparent
						maskClosable={true}
						onClose={() => this.setState({ show_images_modal: false })}
						style={{ maxWidth: '90vw', maxHeight: '90vh', width: '80vw', height: '80vh', overflowX: 'scroll', position: 'relative' }}
					>
						<div onClick={() => this.turnImageCarousel(-1)} style={{ position: 'absolute', left: '0px', top: '50%', zIndex: '3', backgroundColor: 'rgba(256,256,256,1)', borderRadius: '0% 30% 30% 0%' }}>
							<Icon type='left' size='lg' />
						</div>
						<Carousel
									autoplay={true}
									infinite
									swipeSpeed={3}
									selectedIndex={this.state.imageCarouselSelectedIndex}
								>
								{this.props.current_listing.listing.IMAGES.map((url, index) => (
									<a
										key={url}
										style={{ display: 'inline-block', width: '100%', height: '100%' }}
									>
										<img
											id="img_carousel"
											src={url}
											alt=""
											style={{ width: '100%', height: '100%', verticalAlign: 'top' }}
											onLoad={() => {
												// fire window resize event to change height
												// window.dispatchEvent(new Event('resize'));
												// this.setState({ imgHeight: 'auto' });
												// this.renderPriceTag()
											}}
										/>
									</a>
								))}
							</Carousel>
							<div onClick={() => this.turnImageCarousel(1)} style={{ position: 'absolute', right: '0px', top: '50%', zIndex: '3', backgroundColor: 'rgba(256,256,256,1)', borderRadius: '30% 0% 0% 30%' }}>
								<Icon type='right' size='lg' />
							</div>
					</Modal>
					<div style={comStyles().inner_container}>
							{
								this.props.current_listing.listing.IMAGES.length > 0
								?
								<div style={{ position: 'relative' }}>
									<div onClick={() => this.turnImageCarousel(-1)} style={{ position: 'absolute', left: '0px', top: '37%', zIndex: '3', backgroundColor: 'rgba(256,256,256,0.5)', borderRadius: '0% 30% 30% 0%' }}>
										<Icon type='left' size='lg' />
									</div>
									<Carousel
						          autoplay={true}
						          infinite
											swipeSpeed={3}
											selectedIndex={this.state.imageCarouselSelectedIndex}
						        >
					          {this.props.current_listing.listing.IMAGES.map((url, index) => (
					            <a
					              key={url}
					              style={{ display: 'inline-block', width: '100%', height: '40vh' }}
												onClick={() => {
													this.setState({ show_images_modal: true })
													history.pushState(null, null, `${this.props.location.pathname}?show=images`)
												}}
					            >
					              <img
													id="img_carousel"
					                src={url}
					                alt=""
					                style={{ width: '100%', verticalAlign: 'top' }}
					                onLoad={() => {
					                  // fire window resize event to change height
					                  window.dispatchEvent(new Event('resize'));
					                  this.setState({ imgHeight: '40vh' });
														// this.renderPriceTag()
					                }}
					              />
					            </a>
					          ))}
					        </Carousel>
									<div onClick={() => this.turnImageCarousel(1)} style={{ position: 'absolute', right: '0px', top: '37%', zIndex: '3', backgroundColor: 'rgba(256,256,256,0.5)', borderRadius: '30% 0% 0% 30%' }}>
										<Icon type='right' size='lg' />
									</div>
								</div>
								:
								<div style={{ position: 'relative' }}>
								<Carousel
					          autoplay={true}
					          infinite
										id='img_carousel'
					        >
									{['https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/rSpYilaDliykdxju6/videoblocks-smoke-in-corner-of-black-screen-perfect-for-smoke-detector-advert-recorded-against-a-black-background-and-intended-as-a-stand-alone-shot-or-for-compositing-with-graphics-or-using-a-blending-mode-looping-clip_bgvjbtv9e_thumbnail-full01.png'].map(url => (
				            <a
				              key={url}
				              style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
				            >
				              <img
												id="img_carousel"
				                src={url}
				                alt=""
				                style={{ width: '100%', verticalAlign: 'top' }}
				                onLoad={() => {
				                  // fire window resize event to change height
				                  window.dispatchEvent(new Event('resize'));
				                  this.setState({ imgHeight: '40vh' });
													// this.renderPriceTag()
				                }}
				              />
				            </a>
				          ))}
				        </Carousel>
								</div>
							}
							<div style={priceStyle(this.state.priceHeight).priceDiv}>
								<Badge text={
									this.props.current_listing.listing.PRICE === 0
									?
									'contact'
									:
									`$${this.props.current_listing.listing.PRICE}`
								} size='large' style={priceStyle().price} />
							</div>
							<div style={comStyles().titleDiv}>
								<div style={comStyles().title}>
									{this.props.current_listing.listing.TITLE}
								</div>
								<div style={comStyles().bednbath}>
									{this.props.current_listing.listing.BEDS} BED • {this.props.current_listing.listing.BATHS} BATH
								</div>
							</div>

						<div style={comStyles().inner_padded_container}>
							<div id='quick_stats' style={comStyles().quick_stats_white}>
								{
									this.state.commute_state.commute_time
									?
									<div onClick={() => document.getElementById("location_info").scrollIntoView()} style={pStats(1-(this.state.commute_state.commute_time/60/70)).pStats_container}>
										<div style={pStats().pStats_top}>
											<div style={pStats().pStats_val}>{(this.state.commute_state.commute_time/60).toFixed(0)}</div>
											<div style={pStats().pStats_unit}>min</div>
										</div>
										<div style={pStats().pStats_label}>{this.props.prefs.destination.commute_mode.toUpperCase()}</div>
									</div>
									:
									null
								}
								{
									this.state.commute_state.commute_time
									?
									<div onClick={() => document.getElementById("property_info").scrollIntoView()} style={pStats(this.props.current_listing.listing.UTILITIES.length/7).pStats_container}>
										<div style={pStats().pStats_top}>
											<div style={pStats().pStats_val}>{(this.props.current_listing.listing.UTILITIES.length/7*100).toFixed(0)}</div>
											<div style={pStats().pStats_unit}>%</div>
										</div>
										<div style={pStats().pStats_label}>INCLUSIVE</div>
									</div>
									:
									null
								}
								{
									this.state.commute_state.commute_time
									?
									<div onClick={() => document.getElementById("availability_info").scrollIntoView()} style={pStats(1-(moment(this.props.current_listing.listing.DATE_POSTED).diff(moment(), 'hours')/120)).pStats_container}>
										<div style={pStats().pStats_top}>
											<div style={pStats().pStats_val}>{moment(this.props.current_listing.listing.DATE_POSTED).fromNow().split(' ')[0]}</div>
											<div style={pStats().pStats_unit}>{moment(this.props.current_listing.listing.DATE_POSTED).fromNow().split(' ')[1]}</div>
										</div>
										<div style={pStats().pStats_label}>AGO</div>
									</div>
									:
									null
								}
							</div>

							<SegmentedControl
								selectedIndex={this.state.segment_index}
			          values={[
									'Location Info',
									'Property Info',
									'Availability Info'
								]}
			          onChange={(e) => this.clickedSegment(e)}
								style={{ margin: '40px 10px 10px 10px' }}
			        />


							<div id='location_info' style={{ margin: '10px 0px 20px 0px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'self' }}>
								{/*<h3 style={{ margin: '50px auto', fontWeight: 'bold', color: 'rgb(158, 158, 158)' }}>LOCATION INFO</h3>*/}
								<Card>
									{
										location_tabs && location_tabs.length > 0
										?
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
												current_listing={this.props.current_listing.listing}
												commute_mode={this.props.prefs.destination.commute_mode}
												destination={this.props.destination}
												card_section_shown={this.props.card_section_shown}
												setCommuteState={(commute_state) => this.setState({ commute_state: commute_state })}
											/>
											<NearbyLocations
												current_listing={this.props.current_listing.listing}
												card_section_shown={this.props.card_section_shown}
												setNearbyState={(nearby_state) => this.setState({ nearby_state: nearby_state })}
											/>
											<StreetView
												current_listing={this.props.current_listing.listing}
												card_section_shown={this.props.card_section_shown}
											/>
			    					</Tabs>
										:
										null
									}
								</Card>
							</div>

							<div id='property_info' style={{ margin: '20px 0px 20px 0px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'self' }}>
								{/*<h3 style={{ margin: '50px auto', fontWeight: 'bold', color: 'rgb(158, 158, 158)' }}>PROPERTY INFO</h3>*/}
								<Card>
									<Tabs
										tabs={[
											{ title: 'ABOUT' },
											{ title: 'UTILITIES' },
											{ title: 'DESCRIPTION' },
										]}
										swipeable={false}
										initialPage={this.state.property_tab_index}
										onChange={(tab, index) => { console.log('onChange', index, tab); }}
										onTabClick={(tab, index) => {
											this.setState({ property_tab_index: index })
											// document.getElementById('property_info').scrollIntoView()
										}}
									>
										<div id='price_rooms' style={comStyles().about_stats}>
											{
												this.props.current_listing.listing.ADDRESS
												?
												<Button type="ghost" inline size="small" style={{ margin: '3px', width: '100%' }}>{this.props.current_listing.listing.ADDRESS.split(',').slice(0,3).join(',')}</Button>
												:
												null
											}
											{
												this.props.current_listing.listing.SELLER
												?
												<Button type="ghost" inline size="small" style={{ margin: '3px', width: '100%' }}>By Seller: {this.props.current_listing.listing.SELLER}</Button>
												:
												null
											}
											{
												this.props.current_listing.listing.MOVEIN == {}
												?
												null
												:
												<Button type="ghost" inline size="small" style={{ margin: '3px', width: '100%' }}>{`Move In ${moment(this.props.current_listing.listing.MOVEIN).format('MMM DD')}`.toUpperCase()}</Button>
											}
											{
												this.props.current_listing.listing.PRICE === 0
												?
												<Button type="ghost" inline size="small" style={{ margin: '3px', width: '100%' }}>CONTACT FOR PRICE</Button>
												:

												<Button type="ghost" inline size="small" style={{ margin: '3px', width: '100%' }}>{`$${this.props.current_listing.listing.PRICE}`}</Button>
											}
											<Button type="ghost" inline size="small" style={{ margin: '3px', width: '100%' }}>{this.props.current_listing.listing.BEDS} BEDS</Button>
											<Button type="ghost" inline size="small" style={{ margin: '3px', width: '100%' }}>{this.props.current_listing.listing.BATHS} BATHS</Button>
											{
												this.props.current_listing.listing.SQFT === 0
												?
												null
												:
												<Button type="ghost" inline size="small" style={{ margin: '3px', width: '100%' }}>{this.props.current_listing.listing.SQFT} SQFT</Button>
											}
										</div>
										<div id='amenities' style={comStyles().about_stats}>
												{
													this.props.current_listing.listing.UTILITIES.filter(ut => ut.indexOf('electricity') > -1).length > 0
													?
													<Button type="ghost" inline size="small" style={{ margin: '3px', width: '100%' }}>Electric Incl.</Button>
													:
													<Button type="ghost" disabled inline size="small" style={{ margin: '3px', width: '100%' }}>Electric Extra</Button>
												}
												{
													this.props.current_listing.listing.UTILITIES.filter(ut => ut.indexOf('water') > -1).length > 0
													?
													<Button type="ghost" inline size="small" style={{ margin: '3px', width: '100%' }}>Water Incl.</Button>
													:
													<Button type="ghost" disabled inline size="small" style={{ margin: '3px', width: '100%' }}>Water Extra</Button>
												}
												{
													this.props.current_listing.listing.UTILITIES.filter(ut => ut.indexOf('heating') > -1).length > 0
													?
													<Button type="ghost" inline size="small" style={{ margin: '3px', width: '100%' }}>Heating Incl.</Button>
													:
													<Button type="ghost" disabled inline size="small" style={{ margin: '3px', width: '100%' }}>Heating Extra</Button>
												}
												{
													this.props.current_listing.listing.UTILITIES.filter(ut => ut.indexOf('internet') > -1).length > 0
													?
													<Button type="ghost" inline size="small" style={{ margin: '3px', width: '100%' }}>Internet Incl.</Button>
													:
													<Button type="ghost" disabled inline size="small" style={{ margin: '3px', width: '100%' }}>Internet Extra</Button>
												}
												{
													this.props.current_listing.listing.UTILITIES.filter(ut => ut.indexOf('ac') > -1).length > 0
													?
													<Button type="ghost" inline size="small" style={{ margin: '3px', width: '100%' }}>A/C</Button>
													:
													<Button type="ghost" disabled inline size="small" style={{ margin: '3px', width: '100%' }}>A/C Unknown</Button>
												}
												{
													this.props.current_listing.listing.UTILITIES.filter(ut => ut.indexOf('insurance') > -1).length > 0
													?
													<Button type="ghost" inline size="small" style={{ margin: '3px', width: '100%' }}>Insurance Incl.</Button>
													:
													<Button type="ghost" disabled inline size="small" style={{ margin: '3px', width: '100%' }}>Insurance Extra</Button>
												}
												{
													this.props.current_listing.listing.PARKING
													?
													<Button type="ghost" inline size="small" style={{ margin: '3px', width: '100%' }}>Parking Available</Button>
													:
													<Button type="ghost" disabled inline size="small" style={{ margin: '3px', width: '100%' }}>Parking Unknown</Button>
												}
												{
													this.props.current_listing.listing.FURNISHED
													?
													<Button type="ghost" inline size="small" style={{ margin: '3px', width: '100%' }}>Furnished Unit</Button>
													:
													<Button type="ghost" disabled inline size="small" style={{ margin: '3px', width: '100%' }}>Furnishing Unknown</Button>
												}
										</div>
										<div id='restrictions' style={comStyles().about_stats}>
											<div>
												<div>{this.props.current_listing.listing.DESCRIPTION}</div>
												<br/>
												<a href={this.props.current_listing.listing.URL} target='_blank'><Button type="ghost" size="large" style={{ margin: '3px', width: '100%' }}>See Original</Button></a>
											</div>
										</div>
									</Tabs>
								</Card>
							</div>

							</div>

							<div id='availability_info' style={{ margin: '20px 0px 0px 0px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'self' }}>
								{/*<h3 style={{ margin: '50px auto', fontWeight: 'bold', color: 'rgb(158, 158, 158)' }}>AVAILABILITY INFO</h3>*/}
								<div style={comStyles().interactive}>
									<h2 style={{ color: '#eff8f8', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: '50px' }}>Tell RentHero to ...</h2>
									<div onClick={() => alert('Tell us your availability and we will schedule tours for you. Is this necessary? Any flaws? Feedback?')} style={comStyles().interactive_button}>Book A Visit</div>
									<div onClick={() => alert('RentHero can ask the rent seller custom questions. Just tell us what you want to know. Is this necessary? any flaws? feedback?')} style={comStyles().interactive_button}>Ask Seller Questions</div>
									<div onClick={() => alert('RentHero can fill out the rental application on your behalf. Is this necessary? Any flaws? Feedback?')} style={comStyles().interactive_button}>Send My Application</div>
									<div onClick={() => alert('RentHero can send you the sellers contact info for you to speak to directly.')} style={comStyles().interactive_button}>Connect Me To Seller</div>
								</div>
							</div>


							<div style={comStyles().judgementIcons}>
								<div onClick={() => this.clickedJudgement('dislikes')} style={likeOrNotStyles().dislike}>
											<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
			 width="60" height="60"
			 viewBox="0 0 252 252"
			 style="fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,252v-252h252v252z" fill="none"></path><path d="M126,211.68c-47.31976,0 -85.68,-38.36024 -85.68,-85.68v0c0,-47.31976 38.36024,-85.68 85.68,-85.68v0c47.31976,0 85.68,38.36024 85.68,85.68v0c0,47.31976 -38.36024,85.68 -85.68,85.68z" fill="#ffffff"></path><g fill="#e74c3c"><path d="M126,33.264c-51.13382,0 -92.736,41.59814 -92.736,92.736c0,51.13786 41.60218,92.736 92.736,92.736c51.13382,0 92.736,-41.59814 92.736,-92.736c0,-51.13786 -41.60218,-92.736 -92.736,-92.736zM174.384,123.51629c0,6.55603 -6.55603,8.74138 -6.55603,8.74138c0,0 0.72979,4.7376 0.72979,7.6487c0,3.64493 -3.7417,6.2496 -10.29773,6.2496c-9.47117,0 -11.71699,0 -23.81299,0c-9.53568,0 -9.83405,6.92294 -6.55603,14.20877c4.00781,8.3785 7.90272,16.70054 3.16512,24.71616c-2.91514,5.10048 -12.02342,9.10829 -13.1161,0c-2.18534,-22.95014 -18.9625,-26.95795 -26.97408,-36.42912c-6.05606,-7.33018 -9.24134,-16.08768 -14.82163,-18.16416c-1.62086,-0.60077 -2.56032,-2.29421 -2.56032,-4.01587v-36.88877c0,-2.14099 1.69344,-3.88282 3.8304,-4.0199c15.45869,-0.97978 14.59987,-7.94707 57.26246,-7.94707c34.60666,0 34.24378,8.3785 34.24378,12.02342c0,4.00781 -2.18534,6.92294 -2.18534,6.92294c0,0 7.6487,2.9111 7.6487,9.46714c0,6.19315 -5.83027,8.3785 -5.83027,8.3785c0,0 5.83027,2.91514 5.83027,9.10829z"></path></g><path d="M126,252c-69.58788,0 -126,-56.41212 -126,-126v0c0,-69.58788 56.41212,-126 126,-126v0c69.58788,0 126,56.41212 126,126v0c0,69.58788 -56.41212,126 -126,126z" fill="none"></path><path d="M126,246.96c-66.80436,0 -120.96,-54.15564 -120.96,-120.96v0c0,-66.80436 54.15564,-120.96 120.96,-120.96h0c66.80436,0 120.96,54.15564 120.96,120.96v0c0,66.80436 -54.15564,120.96 -120.96,120.96z" fill="none"></path></g></svg>
								</div>
								<div onClick={() => this.clickedJudgement('likes')} style={likeOrNotStyles().like}>
											<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
			 width="60" height="60"
			 viewBox="0 0 252 252"
			 style="fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,252v-252h252v252z" fill="none"></path><path d="M126,191.52c-36.1857,0 -65.52,-29.3343 -65.52,-65.52v0c0,-36.1857 29.3343,-65.52 65.52,-65.52h0c36.1857,0 65.52,29.3343 65.52,65.52v0c0,36.1857 -29.3343,65.52 -65.52,65.52z" fill="#ffffff"></path><g fill="#1abc9c"><path d="M218.736,126c0,-51.13786 -41.60218,-92.736 -92.736,-92.736c-51.13382,0 -92.736,41.59814 -92.736,92.736c0,51.13786 41.60218,92.736 92.736,92.736c51.13382,0 92.736,-41.59814 92.736,-92.736zM168.55373,137.592c0,0 5.83027,2.18534 5.83027,8.3785c0,6.55603 -7.6487,9.47117 -7.6487,9.47117c0,0 2.18534,2.91514 2.18534,6.92294c0,3.64493 0.36288,12.02342 -34.24378,12.02342c-42.66259,0 -41.80378,-6.9673 -57.26246,-7.9511c-2.13696,-0.13709 -3.8304,-1.87891 -3.8304,-4.0199v-36.88877c0,-1.72166 0.93946,-3.41914 2.55629,-4.01587c5.58029,-2.07648 8.76557,-10.83398 14.82163,-18.16416c8.01562,-9.47117 24.78874,-13.47898 26.97408,-36.42912c1.09267,-9.10829 10.20096,-5.10048 13.1161,0c4.7376,8.01562 0.84269,16.33766 -3.16512,24.71616c-3.28205,7.28179 -2.97965,14.20474 6.55603,14.20474c12.096,0 14.34182,0 23.81299,0c6.55603,0 10.29773,2.6087 10.29773,6.2496c0,2.91514 -0.72979,7.6487 -0.72979,7.6487c0,0 6.56006,2.18938 6.56006,8.74541c0,6.19315 -5.83027,9.10829 -5.83027,9.10829z"></path></g></g></svg>
								</div>
							</div>
						</div>
				</div>
			)
		} else {
			return (
				<div>loading</div>
			)
		}
	}
}

// defines the types of variables in this.props
SwipeList.propTypes = {
	history: PropTypes.object.isRequired,
  listings: PropTypes.array.isRequired,
	current_listing: PropTypes.object,
	nextListing: PropTypes.func.isRequired,
	destination: PropTypes.string,
	prefs: PropTypes.object.isRequired,
	incrementLikes: PropTypes.func.isRequired,
	decrementLikes: PropTypes.func.isRequired,
	likes: PropTypes.array.isRequired,
	dislikes: PropTypes.array.isRequired,
	card_section_shown: PropTypes.string.isRequired,
	triggerDrawerNav: PropTypes.func.isRequired,
	setCurrentListing: PropTypes.func.isRequired,
}

// for all optional props, define a default value
SwipeList.defaultProps = {
	current_listing: {}
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SwipeList)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    listings: redux.listings.listings,
		current_listing: redux.listings.current_listing,
		destination: redux.tenant.prefs.destination.address,
		prefs: redux.tenant.prefs,
		likes: redux.tenant.likes,
		dislikes: redux.tenant.dislikes,
		card_section_shown: redux.tenant.card_section_shown,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		nextListing,
		incrementLikes,
		decrementLikes,
		changeShownSectionCards,
		triggerDrawerNav,
		setCurrentListing,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			background: 'white',
			position: 'relative',
			// background: '#00c6ff', /* fallback for old browsers */
		  // background: '-webkit-linear-gradient(to right, #00c6ff, #0072ff)', /* Chrome 10-25, Safari 5.1-6 */
		  // background: 'linear-gradient(to right, #00c6ff, #0072ff)' /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
		},
		inner_container: {
      display: 'flex',
      flexDirection: 'column',
			overflow: 'hidden',
			maxWidth: '500px',
			backgroundColor: '#f5f5f9',
		},
		inner_padded_container: {
      display: 'flex',
      flexDirection: 'column',
			overflow: 'hidden',
			maxWidth: '500px',
			backgroundColor: '#f5f5f9',
			padding: '10px',
		},
		quick_stats: {
      display: 'flex',
      flexDirection: 'row',
			justifyContent: 'space-around',
			padding: '20px',
			zIndex: 1,
			background: '#00c6ff', /* fallback for old browsers */
		  background: '-webkit-linear-gradient(to right, #00c6ff, #0072ff)', /* Chrome 10-25, Safari 5.1-6 */
		  background: 'linear-gradient(to right, #00c6ff, #0072ff)' /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
		},
		quick_stats_section_value: {
			fontSize: '2rem',
			alignSelf: 'center',
		},
		quick_stats_section_label: {
			fontSize: '0.8rem',
			alignSelf: 'center',
		},
		quick_stats_section_value_price: {
			fontSize: '1.7rem',
			alignSelf: 'center',
		},
		quick_stats_white: {
      display: 'flex',
      flexDirection: 'row',
			justifyContent: 'space-around',
			padding: '20px',
			backgroundColor: 'rgb(245, 245, 249)',
		},
		quick_stats_section_value_white: {
			fontSize: '2rem',
			alignSelf: 'center',
		},
		quick_stats_section_label_white: {
			fontSize: '0.8rem',
			alignSelf: 'center',
		},
		quick_stats_section_value_price_white: {
			fontSize: '1.7rem',
			alignSelf: 'center',
		},
		stats_section: {
      display: 'flex',
      flexDirection: 'column',
			justifyContent: 'center',
			color: 'black',
		},
		stats_blue_back: {
      display: 'flex',
      flexDirection: 'column',
			justifyContent: 'center',
			padding: '20px 30px 20px 30px',
			borderRadius: '15px',
			color: 'rgb(0, 155, 255)',
		},
		titleDiv: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: '70% 70% 0% 0%',
			height: '170px',
			width: '140%',
			background: 'rgb(245, 245, 249)',
			marginTop: '-10%',
			marginLeft: '-20%',
			zIndex: 1,
		},
		title: {
			fontSize: '1rem',
			maxWidth: '60vw',
			textAlign: 'center',
			fontWeight: 'bold',
			color: 'rgb(158, 158, 158)'
		},
		bednbath: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			fontSize: '0.8rem',
			// fontWeight: 'bold',
			color: '#9e9e9e',
			marginTop: '10px',
		},
		stats_section: {
      display: 'flex',
      flexDirection: 'column',
			justifyContent: 'center',
			color: 'white',
		},
		stats_section_value: {
			fontSize: '2rem',
			alignSelf: 'center',
		},
		stats_section_label: {
			fontSize: '0.8rem',
			alignSelf: 'center',
		},
		about_stats: {
      display: 'flex',
      flexDirection: 'column',
			justifyContent: 'flex-start',
			alignItems: 'center',
			padding: '20px',
			color: '#6a6a76',
			height: '400px',
		},
		interactive: {
      flexDirection: 'column',
			justifyContent: 'center',
			padding: '120px 20px 120px 20px',
			color: '#eff8f8',
			background: '#00c6ff', /* fallback for old browsers */
		  background: '-webkit-linear-gradient(to right, #00c6ff, #0072ff)', /* Chrome 10-25, Safari 5.1-6 */
		  background: 'linear-gradient(to right, #00c6ff, #0072ff)' /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
		},
		interactive_button: {
			margin: '3px',
			color: '#eff8f8',
			border: '1px solid #eff8f8',
			borderRadius: '10px',
			padding: '10px',
			width: 'auto',
			height: 'auto',
			fontSize: '1.2rem',
			fontWeight: 'bold',
			margin: '10px',
			display: 'flex',
			flexDirection: 'center',
			justifyContent: 'center'
		},
		bottom_area: {
			height: '15vh',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-around',
			alignItems: 'center',
			width: '100vw'
		},
		judgementIcons: {
			height: '15vh',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			width: '100vw',
			maxWidth: '500px',
			position: 'fixed',
			bottom: '0px',
			zIndex: 2,
			padding: '20px'
		}
	}
}

const priceStyle = (priceHeight) => {
	return {
		priceDiv: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			alignSelf: 'center',
			position: 'absolute',
			// marginTop: `${priceHeight-60}px`
			marginTop: '32vh'
		},
		price: {
			background: 'rgb(0, 155, 255)',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			color: 'white',
			padding: '20px',
			fontSize: '1.5rem',
			width: 'auto',
		},
	}
}

const pStats = (percentage) => {
	let backgroundColor = 'black'
	let color = 'white'
	if (percentage < 0) {
		backgroundColor = 'black'
		color = 'white'
	} else if (percentage < 0.1) {
		backgroundColor = '#ff0000'
		color = 'white'
	} else if (percentage < 0.2) {
		backgroundColor = '#ff6500'
		color = 'white'
	} else if (percentage < 0.3) {
		backgroundColor = '#ff9600'
		color = 'white'
	} else if (percentage < 0.4) {
		backgroundColor = '#ffc200'
		color = 'black'
	} else if (percentage < 0.5) {
		backgroundColor = '#ffeb00'
		color = 'black'
	} else if (percentage < 0.6) {
		backgroundColor = '#ecfa0e'
		color = 'black'
	} else if (percentage < 0.7) {
		backgroundColor = '#c7ef1d'
		color = 'white'
	} else if (percentage < 0.8) {
		backgroundColor = '#9fe427'
		color = 'white'
	} else if (percentage < 0.9) {
		backgroundColor = '#72d92d'
		color = 'white'
	} else if (percentage <= 1) {
		backgroundColor = '#32cd32'
		color = 'white'
	} else if (percentage > 1) {
		backgroundColor = 'black'
		color = 'white'
	}
	return {
		pStats_container: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			color: color,
			backgroundColor: backgroundColor,
			width: '80px',
			height: '80px',
			borderRadius: '20%',
		},
		pStats_top: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
		},
		pStats_val: {
			fontSize: '1.3rem',
			fontWeight: 'bold'
		},
		pStats_unit: {
			fontSize: '0.5rem',
			marginLeft: '5px'
		},
		pStats_label: {
			fontSize: '0.8rem',
		}
	}
}

const mapStyles = () => {
	return {
		mapControls: {
			display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap',
			justifyContent: 'center',
			padding: '5px 5px 15px 5px'
		}
	}
}

const likeOrNotStyles = () => {
	return  {
		container: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			position: 'fixed',
			bottom: '0px',
			left: '0px',
			width: '100vw',
			maxWidth: '500px',
		},
		inner_container: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-around',
			alignItems: 'center',
			background: 'white',
			borderRadius: '20px 20px 0px 0px',
			width: '100%',
			padding: '20px 10px 5px 10px'
		},
		dislike: {
			cursor: 'pointer',
			zIndex: 2,
		},
		love: {
			cursor: 'pointer',
			zIndex: 2,
		},
		like: {
			cursor: 'pointer',
			zIndex: 2,
		}
	}
}
