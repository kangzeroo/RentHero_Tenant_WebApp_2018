// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Button,
  Icon,
} from 'antd'


class NoResults extends Component {

	render() {
		return (
			<div id='NoResults' style={comStyles().container}>
				<Icon type="alert" theme="twoTone" twoToneColor="#eb2f96" style={{ fontSize: '5rem' }}/>
        <h1>No Results</h1>
        <p>This is awkward.. There's no listings in your defined area and preferences, we're only available in Waterloo and Toronto right now!</p>
        <p>We'll be coming to your area soon!</p>
        <Button type='primary' onClick={() => this.props.history.push('/onboarding')} style={{ borderRadius: '25px'}} size='large'>
          Start Over
        </Button>
			</div>
		)
	}
}

// defines the types of variables in this.props
NoResults.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
NoResults.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(NoResults)

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
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      padding: '25px',
		}
	}
}
