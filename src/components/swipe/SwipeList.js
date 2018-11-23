// Compt for copying as a SwipeList
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
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
} from 'antd-mobile'
import { nextListing, incrementLikes, decrementLikes } from '../../actions/listings/listings_actions'


class SwipeList extends Component {

	constructor() {
		super()
		this.state = {
			imgHeight: 176,
			priceHeight: 0,
			commute_time: 0,
			commute_mode: 'driving'
		}
	}

	componentDidMount() {
		if (this.props.current_listing) {
			this.renderDirections()
		} else {
			// this.props.history.push('/')
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.current_listing.listing && prevProps.current_listing !== this.props.current_listing) {
			console.log('LOADED UP MAP')
			this.renderDirections()
		}
	}

	renderDirections() {
		const self = this
		const location = { lat: this.props.current_listing.listing.GPS.lat, lng: this.props.current_listing.listing.GPS.lng }
		const map = new google.maps.Map(document.getElementById('map'), {
			center: location,
			zoom: 13,
			disableDefaultUI: true,
		})
		const marker = new google.maps.Marker({position: location, map: map});
		var directionsService = new google.maps.DirectionsService;
		var directionsDisplay = new google.maps.DirectionsRenderer;
		directionsDisplay.setMap(map);
		// directionsDisplay.setDirections(this.props.current_listing.commute_score.data[0]);
		directionsService.route({
			origin: this.props.current_listing.listing.ADDRESS,
			destination: this.props.destination,
			travelMode: this.props.prefs.destination.commute_mode.toUpperCase()
		}, function(response, status) {
			if (status === 'OK') {
				console.log(response)
				self.setState({
					commute_time: response.routes[0].legs.reduce((acc, curr) => acc + curr.duration.value, 0),
					commute_distance: response.routes[0].legs.reduce((acc, curr) => acc + curr.distance.value, 0),
				})
				directionsDisplay.setDirections(response);
			} else {
				window.alert('Directions request failed due to ' + status);
			}
	 })
  }

	renderPriceTag() {
		if (document.getElementById('img_carousel')) {
			this.state.priceHeight = document.getElementById('img_carousel').clientHeight
		}
	}

	clickedJudgement(judgement) {
		this.props.nextListing(judgement)
		this.props.incrementLikes(judgement, this.props.current_listing.listing.ITEM_ID)
		// this.props.decrementLikes(judgement, this.props.current_listing.listing.ITEM_ID)
		if (Math.random() > 0.95) {
			window.open('https://renthero-ai.typeform.com/to/Wrmvfe', '_blank')
		}
		window.scrollTo(0,0)
	}

	render() {
		const commute_time = 47
		const match_perct = 0.76
		const walkscore = 0.89
		if (this.props.current_listing) {
			return (
				<div id='SwipeList' style={comStyles().container}>
					<div style={comStyles().inner_container}>
							{
								this.props.current_listing.listing.IMAGES.length > 0
								?
								<Carousel
					          autoplay={true}
					          infinite
					        >
				          {this.props.current_listing.listing.IMAGES.map((url, index) => (
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
				                  this.setState({ imgHeight: 'auto' });
													this.renderPriceTag()
				                }}
				              />
				            </a>
				          ))}
				        </Carousel>
								:
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
				                  this.setState({ imgHeight: 'auto' });
													this.renderPriceTag()
				                }}
				              />
				            </a>
				          ))}
				        </Carousel>
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
								{
									this.props.current_listing.listing.MOVEIN == {}
									?
									null
									:
									<div style={comStyles().bednbath}>
										{`Move ${moment(this.props.current_listing.listing.MOVEIN).format('MMM DD')}`.toUpperCase()}
									</div>
								}
							</div>
							<div style={comStyles().quick_stats_white}>
								{
									this.state.commute_time
									?
									<div style={pStats(1-(this.state.commute_time/60/70)).pStats_container}>
										<div style={pStats().pStats_top}>
											<div style={pStats().pStats_val}>{(this.state.commute_time/60).toFixed(0)}</div>
											<div style={pStats().pStats_unit}>min</div>
										</div>
										<div style={pStats().pStats_label}>{this.props.prefs.destination.commute_mode.toUpperCase()}</div>
									</div>
									:
									null
								}
								{
									this.props.current_listing.listing.SQFT
									?
									<div style={pStats((70-commute_time)/70).pStats_container}>
										<br/>
										<div style={pStats().pStats_top}>
											<div style={pStats().pStats_val}>{this.props.current_listing.listing.SQFT}</div>
										</div>
										<div style={pStats().pStats_label}>SQFT</div>
									</div>
									:
									null
								}
								{
									this.props.current_listing.listing.FURNISHED
									?
									<div style={pStats(match_perct).pStats_container}>
										<div style={pStats().pStats_top}>
										<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
	width="48" height="48"
	viewBox="0 0 224 224"
	style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,224v-224h224v224z" fill="none"></path><g fill="#ffffff"><g id="surface1"><path d="M112,46.66667c-12.14062,0 -22.34896,5.61459 -28.875,14c-5.61458,-2.80729 -11.26562,-4.66667 -17.79167,-4.66667c-17.71875,0 -32.73958,12.94271 -36.45833,29.75c2.80729,-0.94791 5.65104,-1.75 8.45833,-1.75c11.19271,0 21.58333,6.63542 26.25,16.91667l7.29167,14.875c10.28125,-0.94791 28.98438,-3.79167 41.125,-3.79167c12.14062,0 30.84375,2.84375 41.125,3.79167l7.29167,-14.875c4.66667,-10.28125 15.05729,-16.91667 26.25,-16.91667c2.80729,0 5.65104,0.80209 8.45833,1.75c-3.71875,-16.80729 -18.73958,-29.75 -36.45833,-29.75c-6.52604,0 -12.17708,1.85938 -17.79167,4.66667c-6.52604,-8.38541 -16.73438,-14 -28.875,-14zM37.33333,93.33333c-10.31771,0 -18.66667,8.34896 -18.66667,18.66667c0,9.22396 6.67188,16.84375 15.45833,18.375l10.79167,32.08333l-7.58333,14.875h18.66667l4.66667,-9.33333h102.66667l4.66667,9.33333h18.66667l-7.58333,-14.875l10.79167,-32.08333c8.78646,-1.53125 15.45833,-9.15104 15.45833,-18.375c0,-10.31771 -8.34896,-18.66667 -18.66667,-18.66667c-8.05729,0 -14.875,5.10417 -17.5,12.25h-0.29167l-10.20833,20.41667c0,0 -30.80729,-4.66667 -46.66667,-4.66667c-15.85938,0 -46.66667,4.66667 -46.66667,4.66667l-10.20833,-21.58333l-0.58333,0.29167c-2.84375,-6.70833 -9.47917,-11.375 -17.20833,-11.375z"></path></g></g></g></svg>
										</div>
										<div style={pStats().pStats_label}>FURNISHED</div>
									</div>
									:
									null
								}
								{
									this.props.current_listing.listing.PARKING
									?
									<div style={pStats(walkscore).pStats_container}>
										<div style={pStats().pStats_top}>
										<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
	width="48" height="48"
	viewBox="0 0 224 224"
	style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,224v-224h224v224z" fill="none"></path><g fill="#ffffff"><path d="M46.66667,28c-10.26667,0 -18.66667,8.4 -18.66667,18.66667v130.66667c0,10.26667 8.4,18.66667 18.66667,18.66667h130.66667c10.26667,0 18.66667,-8.4 18.66667,-18.66667v-130.66667c0,-10.26667 -8.4,-18.66667 -18.66667,-18.66667zM111.81771,65.33333c12.69333,0 21.75103,2.52729 27.81771,7.47396c5.78666,4.66667 9.69791,12.31125 9.69791,21.36459c0,9.05333 -2.99032,16.79417 -8.40365,22.02083c-7,6.72 -17.36146,9.71614 -29.49479,9.71614c-2.70667,0 -6.90156,-0.46739 -8.76823,-0.74739v33.50521h-18.66667v-91.36458c6.34667,-1.12 15.21771,-1.96875 27.81771,-1.96875zM112.83854,81.10156c-4.10667,0 -8.67854,0.75688 -10.17188,1.13021v26.50521c1.77333,0.46667 5.59927,1.11197 8.58594,1.11197c10.92,0 17.73697,-5.59197 17.73697,-15.11197c0,-8.49334 -5.88437,-13.63542 -16.15103,-13.63542z"></path></g></g></svg>
										</div>
										<div style={pStats().pStats_label}>PARKING</div>
									</div>
									:
									null
								}
							</div>
							<div style={mapStyles().mapControls}>
								{
									this.props.current_listing.listing.UTILITIES.filter(ut => ut.indexOf('electricity') > -1).length > 0
									?
									<Button type="ghost" inline size="small" style={{ margin: '3px' }}>Electric Incl.</Button>
									:
									<Button type="ghost" disabled inline size="small" style={{ margin: '3px' }}>Electric Extra</Button>
								}
								{
									this.props.current_listing.listing.UTILITIES.filter(ut => ut.indexOf('water') > -1).length > 0
									?
									<Button type="ghost" inline size="small" style={{ margin: '3px' }}>Water Incl.</Button>
									:
									<Button type="ghost" disabled inline size="small" style={{ margin: '3px' }}>Water Extra</Button>
								}
								{
									this.props.current_listing.listing.UTILITIES.filter(ut => ut.indexOf('heating') > -1).length > 0
									?
									<Button type="ghost" inline size="small" style={{ margin: '3px' }}>Heating Incl.</Button>
									:
									<Button type="ghost" disabled inline size="small" style={{ margin: '3px' }}>Heating Extra</Button>
								}
								{
									this.props.current_listing.listing.UTILITIES.filter(ut => ut.indexOf('internet') > -1).length > 0
									?
									<Button type="ghost" inline size="small" style={{ margin: '3px' }}>Internet Incl.</Button>
									:
									<Button type="ghost" disabled inline size="small" style={{ margin: '3px' }}>Internet Extra</Button>
								}
								{
									this.props.current_listing.listing.UTILITIES.filter(ut => ut.indexOf('ac') > -1).length > 0
									?
									<Button type="ghost" inline size="small" style={{ margin: '3px' }}>A/C</Button>
									:
									<Button type="ghost" disabled inline size="small" style={{ margin: '3px' }}>A/C Unknown</Button>
								}
								{
									this.props.current_listing.listing.UTILITIES.filter(ut => ut.indexOf('insurance') > -1).length > 0
									?
									<Button type="ghost" inline size="small" style={{ margin: '3px' }}>Insurance Incl.</Button>
									:
									<Button type="ghost" disabled inline size="small" style={{ margin: '3px' }}>Insurance Extra</Button>
								}
							</div>
							{/*<div style={comStyles().quick_stats_white}>
								<div style={pStats((70-commute_time)/70).pStats_container}>
									<div style={pStats().pStats_top}>
										<div style={pStats().pStats_val}>{commute_time}</div>
										<div style={pStats().pStats_unit}>min</div>
									</div>
									<div style={pStats().pStats_label}>COMMUTE</div>
								</div>
								<div style={pStats(match_perct).pStats_container}>
									<div style={pStats().pStats_top}>
										<div style={pStats().pStats_val}>{(match_perct*100).toFixed(0)}</div>
										<div style={pStats().pStats_unit}>%</div>
									</div>
									<div style={pStats().pStats_label}>MATCH</div>
								</div>
								<div style={pStats(walkscore).pStats_container}>
									<div style={pStats().pStats_top}>
										<div style={pStats().pStats_val}>{(walkscore*100).toFixed(0)}</div>
										<div style={pStats().pStats_unit}>%</div>
									</div>
									<div style={pStats().pStats_label}>NEARBY</div>
								</div>
							</div>*/}
							{/*<div style={mapStyles().mapControls}>
								<Button type="ghost" inline size="small" style={{ margin: '3px' }}>Transit</Button>
								<Button type="ghost" inline size="small" style={{ margin: '3px' }}>Stores</Button>
								<Button type="ghost" inline size="small" style={{ margin: '3px' }}>Resturants</Button>
								<Button type="ghost" inline size="small" style={{ margin: '3px' }}>Cafes</Button>
							</div>*/}
							<Card>
								<div>
									<div id='map' style={comStyles().map} />
								</div>
								{/*<Card.Body style={comStyles().quick_stats}>
									<div style={comStyles().stats_section}>
										<div style={comStyles().stats_section_value}>{this.props.current_listing.listing.BEDS}</div>
										<div style={comStyles().stats_section_label}>DAILY COMMUTE</div>
									</div>
									<div style={comStyles().stats_section}>
										<div style={comStyles().stats_section_value}>{this.props.current_listing.listing.BEDS}</div>
										<div style={comStyles().stats_section_label}>ALL INCLUSIVE</div>
									</div>
									<div style={comStyles().stats_section}>
										<div style={comStyles().stats_section_value}>{this.props.current_listing.listing.BEDS}</div>
										<div style={comStyles().stats_section_label}>WALKSCORE</div>
									</div>
								</Card.Body>*/}
								<Card.Body style={comStyles().interactive}>
									<h2 style={{ color: '#eff8f8', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: '50px' }}>Tell RentHero to ...</h2>
									<div onClick={() => alert('Tell us your availability and we will schedule tours for you. Is this necessary? Any flaws? Feedback?')} style={comStyles().interactive_button}>Book A Visit</div>
									<div onClick={() => alert('RentHero can ask the rent seller custom questions. Just tell us what you want to know. Is this necessary? any flaws? feedback?')} style={comStyles().interactive_button}>Ask Seller Questions</div>
									<div onClick={() => alert('RentHero can fill out the rental application on your behalf. Is this necessary? Any flaws? Feedback?')} style={comStyles().interactive_button}>Send My Application</div>
									<div onClick={() => alert('RentHero can send you the sellers contact info for you to speak to directly.')} style={comStyles().interactive_button}>Connect Me To Seller</div>
								</Card.Body>
								<Card.Body style={comStyles().about_stats}>
									{
										this.props.current_listing.listing.ADDRESS
										?
										<div style={{ fontWeight: 'bold' }}>{this.props.current_listing.listing.ADDRESS.split(',').slice(0,3).join(',')}</div>
										:
										null
									}
									{
										this.props.current_listing.listing.SELLER
										?
										<div style={{ fontSize: '0.75rem' }}>By Seller: {this.props.current_listing.listing.SELLER}</div>
										:
										null
									}
								</Card.Body>
					      <Card.Body>
					        <div>{this.props.current_listing.listing.DESCRIPTION}</div>
									<br/>
									<a href={this.props.current_listing.listing.URL} target='_blank'><Button type="ghost" size="large" style={{ margin: '3px' }}>See Original</Button></a>
					      </Card.Body>
								<div style={comStyles().bottom_area}>
								</div>
								<div style={comStyles().judgementIcons}>
								<div onClick={() => this.clickedJudgement('dislikes')} style={likeOrNotStyles().dislike}>
								<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
 width="60" height="60"
 viewBox="0 0 252 252"
 style="fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,252v-252h252v252z" fill="none"></path><path d="M126,211.68c-47.31976,0 -85.68,-38.36024 -85.68,-85.68v0c0,-47.31976 38.36024,-85.68 85.68,-85.68v0c47.31976,0 85.68,38.36024 85.68,85.68v0c0,47.31976 -38.36024,85.68 -85.68,85.68z" fill="#ffffff"></path><g fill="#e74c3c"><path d="M126,33.264c-51.13382,0 -92.736,41.59814 -92.736,92.736c0,51.13786 41.60218,92.736 92.736,92.736c51.13382,0 92.736,-41.59814 92.736,-92.736c0,-51.13786 -41.60218,-92.736 -92.736,-92.736zM174.384,123.51629c0,6.55603 -6.55603,8.74138 -6.55603,8.74138c0,0 0.72979,4.7376 0.72979,7.6487c0,3.64493 -3.7417,6.2496 -10.29773,6.2496c-9.47117,0 -11.71699,0 -23.81299,0c-9.53568,0 -9.83405,6.92294 -6.55603,14.20877c4.00781,8.3785 7.90272,16.70054 3.16512,24.71616c-2.91514,5.10048 -12.02342,9.10829 -13.1161,0c-2.18534,-22.95014 -18.9625,-26.95795 -26.97408,-36.42912c-6.05606,-7.33018 -9.24134,-16.08768 -14.82163,-18.16416c-1.62086,-0.60077 -2.56032,-2.29421 -2.56032,-4.01587v-36.88877c0,-2.14099 1.69344,-3.88282 3.8304,-4.0199c15.45869,-0.97978 14.59987,-7.94707 57.26246,-7.94707c34.60666,0 34.24378,8.3785 34.24378,12.02342c0,4.00781 -2.18534,6.92294 -2.18534,6.92294c0,0 7.6487,2.9111 7.6487,9.46714c0,6.19315 -5.83027,8.3785 -5.83027,8.3785c0,0 5.83027,2.91514 5.83027,9.10829z"></path></g><path d="M126,252c-69.58788,0 -126,-56.41212 -126,-126v0c0,-69.58788 56.41212,-126 126,-126v0c69.58788,0 126,56.41212 126,126v0c0,69.58788 -56.41212,126 -126,126z" fill="none"></path><path d="M126,246.96c-66.80436,0 -120.96,-54.15564 -120.96,-120.96v0c0,-66.80436 54.15564,-120.96 120.96,-120.96h0c66.80436,0 120.96,54.15564 120.96,120.96v0c0,66.80436 -54.15564,120.96 -120.96,120.96z" fill="none"></path></g></svg>
									</div>
									{/*<div onClick={() => this.clickedJudgement('love')} style={likeOrNotStyles().love}>
									<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
	 width="96" height="96"
	 viewBox="0 0 252 252"
	 style="fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,252v-252h252v252z" fill="none"></path><path d="M126,191.52c-36.1857,0 -65.52,-29.3343 -65.52,-65.52v0c0,-36.1857 29.3343,-65.52 65.52,-65.52h0c36.1857,0 65.52,29.3343 65.52,65.52v0c0,36.1857 -29.3343,65.52 -65.52,65.52z" fill="#ffffff"></path><g id="Layer_1"><g><g fill="#e74c3c"><g><g><g><g><g><g><path d="M28.31063,126c0,-53.94375 43.74563,-97.68937 97.68938,-97.68937c53.94375,0 97.68937,43.74563 97.68937,97.68938c0,53.94375 -43.74563,97.68937 -97.68937,97.68937c-53.94375,0 -97.68937,-43.74563 -97.68937,-97.68937z"></path></g></g></g></g></g></g></g><path d="M175.6125,89.42062c-13.7025,-13.7025 -35.91,-13.7025 -49.6125,0v0c-13.7025,-13.7025 -35.91,-13.7025 -49.6125,0c-13.7025,13.7025 -11.73375,34.1775 0,49.6125c12.40313,16.34063 35.08312,43.27312 49.6125,43.27312v0c14.52937,0 37.20937,-26.97188 49.6125,-43.27312c11.73375,-15.435 13.7025,-35.91 0,-49.6125z" fill="#ffffff"></path></g></g></g></svg>
									</div>*/}
									<div onClick={() => this.clickedJudgement('likes')} style={likeOrNotStyles().like}>
									<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
	 width="60" height="60"
	 viewBox="0 0 252 252"
	 style="fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,252v-252h252v252z" fill="none"></path><path d="M126,191.52c-36.1857,0 -65.52,-29.3343 -65.52,-65.52v0c0,-36.1857 29.3343,-65.52 65.52,-65.52h0c36.1857,0 65.52,29.3343 65.52,65.52v0c0,36.1857 -29.3343,65.52 -65.52,65.52z" fill="#ffffff"></path><g fill="#1abc9c"><path d="M218.736,126c0,-51.13786 -41.60218,-92.736 -92.736,-92.736c-51.13382,0 -92.736,41.59814 -92.736,92.736c0,51.13786 41.60218,92.736 92.736,92.736c51.13382,0 92.736,-41.59814 92.736,-92.736zM168.55373,137.592c0,0 5.83027,2.18534 5.83027,8.3785c0,6.55603 -7.6487,9.47117 -7.6487,9.47117c0,0 2.18534,2.91514 2.18534,6.92294c0,3.64493 0.36288,12.02342 -34.24378,12.02342c-42.66259,0 -41.80378,-6.9673 -57.26246,-7.9511c-2.13696,-0.13709 -3.8304,-1.87891 -3.8304,-4.0199v-36.88877c0,-1.72166 0.93946,-3.41914 2.55629,-4.01587c5.58029,-2.07648 8.76557,-10.83398 14.82163,-18.16416c8.01562,-9.47117 24.78874,-13.47898 26.97408,-36.42912c1.09267,-9.10829 10.20096,-5.10048 13.1161,0c4.7376,8.01562 0.84269,16.33766 -3.16512,24.71616c-3.28205,7.28179 -2.97965,14.20474 6.55603,14.20474c12.096,0 14.34182,0 23.81299,0c6.55603,0 10.29773,2.6087 10.29773,6.2496c0,2.91514 -0.72979,7.6487 -0.72979,7.6487c0,0 6.56006,2.18938 6.56006,8.74541c0,6.19315 -5.83027,9.10829 -5.83027,9.10829z"></path></g></g></svg>
									</div>
								</div>

								{/*<div style={likeOrNotStyles().container}>
									<div style={likeOrNotStyles().inner_container}>
										<div style={likeOrNotStyles().dislike}>
										<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
			width="60" height="60"
			viewBox="0 0 224 224"
			style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,224v-224h224v224z" fill="none"></path><g fill="#3498db"><g id="surface1"><path d="M205.33333,112c0,-51.33333 -42,-93.33333 -93.33333,-93.33333c-51.33333,0 -93.33333,42 -93.33333,93.33333c0,51.33333 42,93.33333 93.33333,93.33333c51.33333,0 93.33333,-42 93.33333,-93.33333zM158.66667,121.33333c0,10.28125 -8.38541,18.66667 -18.66667,18.66667h-30.80729l9.33333,14c1.85938,2.80729 2.80729,6.52604 2.80729,10.28125v3.71875c0,5.61459 -3.71875,9.33333 -9.33333,9.33333c0,0 -1.85938,0 -4.66667,0c-2.80729,0 -5.61458,-1.85938 -8.38541,-4.66667c-2.8073,-2.80729 -29.89583,-37.33333 -29.89583,-37.33333c-1.85938,-2.80729 -3.71875,-6.52604 -3.71875,-11.19271v-40.14062c0,-10.28125 8.38542,-18.66667 18.66667,-18.66667h44.80729c7.47397,0 14,3.71875 16.8073,10.28125l11.1927,23.33333c0.91147,2.77083 1.85938,5.57812 1.85938,8.38541z"></path></g></g></g></svg>
										</div>
										<div style={likeOrNotStyles().love}>
										<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
	width="96" height="96"
	viewBox="0 0 224 224"
	style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,224v-224h224v224z" fill="none"></path><g fill="#e74c3c"><path d="M112,18.66667c-51.464,0 -93.33333,41.86933 -93.33333,93.33333c0,51.464 41.86933,93.33333 93.33333,93.33333c51.464,0 93.33333,-41.86933 93.33333,-93.33333c0,-51.464 -41.86933,-93.33333 -93.33333,-93.33333zM127.49333,138.49733l-1.61467,1.46533c-3.20133,2.98667 -9.20267,7.476 -13.87867,10.84533c-4.68533,-3.37867 -10.70533,-7.88667 -13.972,-10.92933l-1.54,-1.4c-13.048,-11.80667 -27.09467,-27.31867 -19.81467,-42.532c3.416,-7.13067 10.84533,-11.93733 18.508,-11.94667c4.256,0 8.232,1.15733 11.80667,3.43467l5.012,3.20133l5.02133,-3.20133c3.57467,-2.27733 7.54133,-3.43467 11.79733,-3.43467h0.028c7.63467,0.00933 15.064,4.816 18.48,11.94667c7.28933,15.21333 -6.76667,30.72533 -19.83333,42.55067z"></path></g></g></svg>
										</div>
										<div style={likeOrNotStyles().like}>
										<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
			width="60" height="60"
			viewBox="0 0 224 224"
			style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,224v-224h224v224z" fill="none"></path><g fill="#2ecc71"><path d="M112,18.66667c-51.548,0 -93.33333,41.78533 -93.33333,93.33333c0,51.548 41.78533,93.33333 93.33333,93.33333c51.548,0 93.33333,-41.78533 93.33333,-93.33333c0,-51.548 -41.78533,-93.33333 -93.33333,-93.33333zM158.66667,104.23467l-16.94,39.44267c-1.47467,3.43467 -4.85333,5.656 -8.57733,5.656h-49.14933c-5.152,0 -9.33333,-4.18133 -9.33333,-9.33333v-51.716c0,-2.716 1.18533,-5.30133 3.248,-7.07467l34.08533,-29.33467l5.07733,4.47067c2.61333,2.30533 3.73333,5.87067 2.884,9.25867l-4.57333,18.396h33.94533c5.152,0 9.33333,4.18133 9.33333,9.33333z"></path></g></g></svg>
										</div>
									</div>
								</div>*/}
					    </Card>
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
	decrementLikes: PropTypes.func.isRequired
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
		destination: redux.listings.prefs.destination.address,
		prefs: redux.listings.prefs,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		nextListing,
		incrementLikes,
		decrementLikes
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
		},
		inner_container: {
      display: 'flex',
      flexDirection: 'column',
			overflow: 'hidden',
			maxWidth: '500px'
		},
		quick_stats: {
      display: 'flex',
      flexDirection: 'row',
			justifyContent: 'space-around',
			padding: '20px',
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
			background: '#fff',
			marginTop: '-10%',
			marginLeft: '-20%',
			zIndex: 1,
		},
		title: {
			fontSize: '1rem',
			maxWidth: '60vw',
			textAlign: 'center'
		},
		bednbath: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			fontSize: '0.8rem',
			fontWeight: 'bold',
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
		map: {
			height: '250px',
		},
		about_stats: {
      display: 'flex',
      flexDirection: 'column',
			justifyContent: 'space-around',
			padding: '20px',
			color: '#6a6a76',
		},
		interactive: {
      display: 'flex',
      flexDirection: 'column',
			justifyContent: 'center',
			height: '90vh',
			maxHeight: '700px',
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
			marginTop: `${priceHeight-60}px`
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
	if (percentage < 0.1) {
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
			fontSize: '0.7rem',
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
		},
		inner_container: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-around',
			alignItems: 'center',
			background: 'white',
			borderRadius: '20px 20px 0px 0px',
			width: '90vw',
			padding: '20px 5px 5px 5px'
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
