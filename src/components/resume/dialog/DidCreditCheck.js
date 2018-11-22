// Compt for copying as a DidCreditCheck
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import SubtitlesMachine from '../../modules/SubtitlesMachine'
import {

} from 'antd-mobile'


class DidCreditCheck extends Component {

	constructor() {
		super()
		this.state = {

		}
	}

	render() {
		return (
			<div id='WelcomeScreen' style={comStyles().container}>
        <div style={comStyles().slim}>
					<SubtitlesMachine
							speed={0.15}
							text={`Landlords expect a credit report from tenants. It's a history of how reliably you pay your credit card bills, car loan and debt.`}
							textStyles={{
								fontSize: '1.5rem',
								color: 'white',
								textAlign: 'left',
								fontWeight: 'bold'
							}}
							containerStyles={{
								width: '100%',
								backgroundColor: 'rgba(0,0,0,0)',
								padding: '20px',
								borderRadius: '20px',
							}}
							doneEvent={() => {
								console.log('DONE')
								setTimeout(() => {
									this.setState({ step: 1 })
									window.scrollTo(0,window.innerHeight)
								}, 600)
							}}
						/>
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
DidCreditCheck.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
DidCreditCheck.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(DidCreditCheck)

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
      height: '100vh',
      justifyContent: 'flex-start',
      alignItems: 'center',
			background: '#00c6ff', /* fallback for old browsers */
		  background: '-webkit-linear-gradient(to right, #00c6ff, #0072ff)', /* Chrome 10-25, Safari 5.1-6 */
		  background: 'linear-gradient(to right, #00c6ff, #0072ff)' /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
		},
    slim: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100%',
      maxWidth: '500px',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
	}
}
