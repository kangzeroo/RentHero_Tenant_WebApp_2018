// Compt for copying as a FavoritesList
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Button,
} from 'antd-mobile'


class FavoritesList extends Component {

	startOver() {
		localStorage.setItem('acct_details', null)
		this.props.history.push('/')
	}

	render() {
		return (
			<div id='FavoritesList' style={comStyles().container}>
				<h1>Hello {this.props.name}</h1>
				<Button onClick={() => this.startOver()} type='outline'>Start Over</Button>
				<br/>
				<h2>LIKES</h2>
				{
					this.props.likes.map(like => {
						return (
							<div id={like}>{like}</div>
						)
					})
				}
				<h2>DIS-LIKES</h2>
				{
					this.props.dislikes.map(dislike => {
						return (
							<div id={dislike}>{dislike}</div>
						)
					})
				}
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
