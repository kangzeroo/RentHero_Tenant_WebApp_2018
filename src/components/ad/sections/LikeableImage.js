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
			<div id='LikeableImage' style={{ ...comStyles().container, ...this.props.styles }}>
				<img src={this.props.img} style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
        <div style={comStyles().button}>
					<i className='ion-ios-heart' style={{ fontSize: '2rem', color: '#ed1313' }}></i>
				</div>
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
		},
		button: {
			cursor: 'pointer',
			width: '45px',
	    height: '45px',
	    position: 'absolute',
	    bottom: '10px',
	    right: '10px',
	    backgroundColor: 'rgba(256,256,256,0.8)',
	    borderRadius: '50%',
	    display: 'flex',
	    flexDirection: 'column',
	    justifyContent: 'center',
		}
	}
}
