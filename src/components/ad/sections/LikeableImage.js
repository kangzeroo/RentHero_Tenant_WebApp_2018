// Compt for copying as a LikeableImage
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'antd-mobile'


class LikeableImage extends Component {

	render() {
		return (
			<div id='LikeableImage' style={comStyles().container}>
				<img src={this.props.img} style={{ width: '100%', height: 'auto' }} />
        <div style={{ width: '50px', height: '50px', position: 'absolute', bottom: '10px', right: '10px' }}>Like</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
LikeableImage.propTypes = {
	history: PropTypes.object.isRequired,
  img: PropTypes.string.isRequired,
  styles: PropTypes.object,
}

// for all optional props, define a default value
LikeableImage.defaultProps = {
  styles: {}
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(LikeableImage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

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
      position: 'relative',
		}
	}
}
