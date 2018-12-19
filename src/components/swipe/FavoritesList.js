// Compt for copying as a FavoritesList
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import {
	Button,
	Icon,
	Card,
} from 'antd-mobile'
import {
	getAdsByRefs,
} from '../../api/listings/listings_api'
import {
	restartSearch,
	decrementLikes,
	setCurrentListingsStack,
} from '../../actions/listings/listings_actions'
import { triggerDrawerNav } from '../../actions/app/app_actions'


class FavoritesList extends Component {

	startOver() {
		this.props.restartSearch()
		this.props.history.push('/')
	}

	clickedCancel(e, entry, attr) {
		e.stopPropagation()
		this.props.decrementLikes(attr, entry)
	}

	viewCollection(ref_ids) {
		getAdsByRefs(ref_ids)
			.then((data) => {
				console.log(data)
				this.props.setCurrentListingsStack('/favourites', data)
				this.props.history.push('/matches')
			})
			.catch((err) => {
				console.log(err)
			})
	}

	render() {
		return (
			<div id='FavoritesList' style={comStyles().container}>
        <div onClick={() => this.instantCharClick()} style={comStyles().scroll}>
					<div onClick={() => this.props.triggerDrawerNav(true)} style={{ position: 'fixed', top: '20px', left: '20px', zIndex: '4', color: 'white' }}>
						<Icon type='ellipsis' size='lg' />
					</div>
					<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
						<h1 style={{ padding: '30px', color: 'white', width: '100%', textAlign: 'right' }}>{`${this.props.name}'s Favourites`}</h1>
						{/*<Button onClick={() => this.startOver()} size='sm' type='ghost' style={comStyles().start_over}>Start Over</Button>*/}
					</div>
					<br/>
					<div style={{ padding: '30px', width: '100%' }}>
						<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
							<h1 style={{ padding: '20px', color: 'white', width: '100%', textAlign: 'center' }}></h1>
							<Button onClick={() => this.viewCollection(this.props.likes.map(l => l.REFERENCE_ID))} size='sm' type='ghost' style={comStyles().view}>View Likes</Button>
						</div>
						{
							this.props.likes.map(like => {
								return (
									<div id={like.REFERENCE_ID} onClick={() => this.props.history.push(`/matches/${like.REFERENCE_ID}`)} style={comStyles().card}>
										<img src={like.THUMBNAIL} style={comStyles().thumbnail} />
										<div style={comStyles().details}>
											<div style={comStyles().price}>
												${like.PRICE}
											</div>
											<div style={comStyles().address}>
												{like.ADDRESS}
											</div>
											<div style={comStyles().deets}>
												{`${like.BEDS} BEDS • ${like.BATHS} BATHS`}
											</div>
										</div>
										<Icon onClick={(e) => this.clickedCancel(e, like, 'likes')} type="cross-circle" style={{ position: 'absolute', top: '45%', right: '20px', cursor: 'pointer' }} />
									</div>
								)
							})
						}
					</div>
					<div style={{ padding: '30px', width: '100%' }}>
						<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
							<h1 style={{ padding: '20px', color: 'white', width: '100%', textAlign: 'center' }}></h1>
							<Button onClick={() => this.viewCollection(this.props.dislikes.map(l => l.REFERENCE_ID))} size='sm' type='ghost' style={comStyles().view}>View Dislikes</Button>
						</div>
						{
							this.props.dislikes.map(dislike => {
								return (
									<div id={dislike.REFERENCE_ID} onClick={() => this.props.history.push(`/matches/${dislike.REFERENCE_ID}`)} style={comStyles().card}>
										<img src={dislike.THUMBNAIL} style={comStyles().thumbnail} />
										<div style={comStyles().details}>
											<div style={comStyles().price}>
												${dislike.PRICE}
											</div>
											<div style={comStyles().address}>
												{dislike.ADDRESS}
											</div>
											<div style={comStyles().deets}>
												{`${dislike.BEDS} BEDS • ${dislike.BATHS} BATHS`}
											</div>
										</div>
										<Icon onClick={(e) => this.clickedCancel(e, dislike, 'dislikes')} type="cross-circle" style={{ position: 'absolute', top: '45%', right: '20px', cursor: 'pointer' }} />
									</div>
								)
							})
						}
					</div>
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
FavoritesList.propTypes = {
	history: PropTypes.object.isRequired,
	name: PropTypes.string,
	likes: PropTypes.array.isRequired,
	dislikes: PropTypes.array.isRequired,
	restartSearch: PropTypes.func.isRequired,
	triggerDrawerNav: PropTypes.func.isRequired,
	decrementLikes: PropTypes.func.isRequired,
	setCurrentListingsStack: PropTypes.func.isRequired,
}

// for all optional props, define a default value
FavoritesList.defaultProps = {
	name: 'Friend'
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(FavoritesList)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		name: redux.tenant.name,
		likes: redux.tenant.likes,
		dislikes: redux.tenant.dislikes,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		restartSearch,
		triggerDrawerNav,
		decrementLikes,
		setCurrentListingsStack,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      justifyContent: 'flex-start',
      alignItems: 'center',
			background: '#00c6ff', /* fallback for old browsers */
		  background: '-webkit-linear-gradient(to right, #00c6ff, #0072ff)', /* Chrome 10-25, Safari 5.1-6 */
		  background: 'linear-gradient(to right, #00c6ff, #0072ff)' /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
		},
    scroll: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '90vh',
			bottom: '0px',
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
		card: {
			width: '100%',
			height: '100px',
			display: 'flex',
			padding: '0px 0px 0px 10px',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'center',
			overflow: 'hidden',
			position: 'relative',
			backgroundColor: 'rgba(0,0,0,0.07)',
			border: '1px solid rgba(0,0,0,0)',
		},
		thumbnail: {
			width: '20%',
			height: 'auto',
			borderRadius: '5px',
		},
		details: {
			width: '70%',
			padding: '15px',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'flex-start',
			overflow: 'hidden',
			color: 'white',
		},
		price: {
			fontSize: '1.5rem',
			fontWeight: 'bold',
			color: 'white',
		},
		address: {
			fontSize: '0.8rem',
			color: 'white',
		},
		deets: {
			fontSize: '0.8rem',
			color: 'white',
		},
		start_over: {
			width: '30%',
			margin: '0px 40px 0px 0px',
			color: 'white',
			border: '1px solid white',
			padding: '15px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		view: {
			width: '30%',
			minWidth: '150px',
			margin: '0px 0px 20px 0px',
			color: 'white',
			border: '1px solid white',
			padding: '15px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		}
	}
}
