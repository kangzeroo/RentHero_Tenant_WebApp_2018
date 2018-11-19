// Compt for copying as a SwipeList
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Carousel,
	Tag,
	Card,
	Badge,
	Button,
} from 'antd-mobile'


class SwipeList extends Component {

	constructor() {
		super()
		this.state = {
			imgHeight: 176
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.current_listing && prevProps.current_listing !== this.props.current_listing) {
			console.log('LOADED UP MAP')
			const location = { lat: this.props.current_listing.GPS.lat, lng: this.props.current_listing.GPS.lng }
			const map = new google.maps.Map(document.getElementById('map'), {
	      center: location,
	      zoom: 13,
				disableDefaultUI: true,
	    })
			const marker = new google.maps.Marker({position: location, map: map});
		}
	}

	render() {
		const commute_time = 47
		const match_perct = 0.76
		const walkscore = 0.89
		if (this.props.current_listing) {
			return (
				<div id='SwipeList' style={comStyles().container}>
					<div style={comStyles().inner_container}>
						<Carousel
			          autoplay={true}
			          infinite
			        >
			          {this.props.current_listing.IMAGES.map(url => (
			            <a
			              key={url}
			              style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
			            >
			              <img
			                src={url}
			                alt=""
			                style={{ width: '100%', verticalAlign: 'top' }}
			                onLoad={() => {
			                  // fire window resize event to change height
			                  window.dispatchEvent(new Event('resize'));
			                  this.setState({ imgHeight: 'auto' });
			                }}
			              />
			            </a>
			          ))}
			        </Carousel>
							<div style={priceStyle(screen.width).priceDiv}>
								<Badge text={`$${this.props.current_listing.PRICE}`} size='large' style={priceStyle().price} />
							</div>
							<div style={comStyles().titleDiv}>
								<div style={comStyles().title}>
									{this.props.current_listing.TITLE}
								</div>
								<div style={comStyles().bednbath}>
									{this.props.current_listing.BEDS} BED • {this.props.current_listing.BATHS} BATH
								</div>
							</div>
							<div style={comStyles().quick_stats_white}>
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
							</div>
							<div style={mapStyles().mapControls}>
								<Button type="ghost" inline size="small" style={{ margin: '3px' }}>Transit</Button>
								<Button type="ghost" inline size="small" style={{ margin: '3px' }}>Stores</Button>
								<Button type="ghost" inline size="small" style={{ margin: '3px' }}>Resturants</Button>
								<Button type="ghost" inline size="small" style={{ margin: '3px' }}>Cafes</Button>
							</div>
							<Card>
								<div>
									<div id='map' style={comStyles().map} />
								</div>
								<Card.Body style={comStyles().quick_stats}>
									<div style={comStyles().stats_section}>
										<div style={comStyles().stats_section_value}>{this.props.current_listing.BEDS}</div>
										<div style={comStyles().stats_section_label}>DAILY COMMUTE</div>
									</div>
									<div style={comStyles().stats_section}>
										<div style={comStyles().stats_section_value}>{this.props.current_listing.BEDS}</div>
										<div style={comStyles().stats_section_label}>ALL INCLUSIVE</div>
									</div>
									<div style={comStyles().stats_section}>
										<div style={comStyles().stats_section_value}>{this.props.current_listing.BEDS}</div>
										<div style={comStyles().stats_section_label}>WALKSCORE</div>
									</div>
								</Card.Body>
					      <Card.Body>
					        <div>{this.props.current_listing.DESCRIPTION}</div>
					      </Card.Body>
					    </Card>
							{
								this.props.current_listing.UTILITIES.map((util) => {
									return (
										<Tag key={util}>{util}</Tag>
									)
								})
							}
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
		current_listing: redux.listings.current_listing
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
			height: '150px',
			width: '140%',
			background: '#fff',
			marginTop: '-10%',
			marginLeft: '-20%',
			zIndex: 1,
		},
		title: {
			fontSize: '1.4rem',
		},
		bednbath: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			fontSize: '0.9rem',
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
	}
}

const priceStyle = (screenWidth) => {
	return {
		priceDiv: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			alignSelf: 'center',
			position: 'absolute',
			marginTop: screenWidth < 500 ? '52%' : '35%'
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
		color = 'white'
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
