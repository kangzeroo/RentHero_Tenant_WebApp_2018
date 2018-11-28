// Compt for copying as a InteractiveTemplate
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import $ from 'jquery'
import SubtitlesMachine from '../modules/SubtitlesMachine'
import {
	Icon,
} from 'antd-mobile'


class InteractiveTemplate extends Component {

	constructor() {
		super()
		this.state = {
			show_up: true,
			show_down: true,
			listeners: [],
			completed: [],
			instantChars: false,

			string1: '',
		}
	}

	componentWillMount() {
		const already_logged_in = localStorage.getItem('user_session')
		if (already_logged_in) {
			this.props.history.push('/matches')
		}
	}

	componentDidMount() {
		mixpanel.track('Loaded Welcome Screen')
	}

	componentDidUpdate() {
		// repeat this for each HTML input field you need to auto-close on enter key press
		if (this.state.listeners.filter(l => l === 'input_field').length === 0 && document.getElementById('input_field')) {
			this.listenToInputClose('#section_two', 'two', 'input_field')
		}
	}

	instantCharClick() {
		this.setState({
			instantChars: true
		})
		setTimeout(() => {
			this.setState({
				instantChars: false
			})
		}, 50)
	}

	// pass in the id of the next div to scroll down to, add the id of the section we just finished, and blur any current input with id inputDiv
	clickedCheck(nextDiv, justFinished, inputDiv, timeout = 0) {
		if (inputDiv && document.getElementById(inputDiv)) {
			document.getElementById(inputDiv).blur()
		}
		setTimeout(() => {
			this.setState({ completed: this.state.completed.concat([justFinished]) }, () => {
				history.pushState(null, null, `${this.props.location.pathname}${nextDiv}`)
				$('#middle_part').animate({
						scrollTop: document.getElementById("middle_part").scrollHeight - $(nextDiv).position().top
				}, 500);
			})
		}, timeout)
	}

	// pass in the id of the next div to scroll down to, add the id of the section we just finished, and blur any current input with id inputDiv
	listenToInputClose(nextDiv, justFinished, inputDiv) {
		document.getElementById(inputDiv).addEventListener('keyup', (e) => {
			if (e.keyCode === 13) {
				this.clickedCheck(nextDiv, justFinished, inputDiv, 500)
			}
		})
		this.setState({
			listeners: this.state.listeners.concat([inputDiv])
		})
	}

	beginAdventure() {
		this.props.history.push('/onboarding')
		mixpanel.track('Began Adventure')
	}

	render() {
		return (
			<div id='InteractiveTemplate' style={comStyles().container}>
        <div onClick={() => this.instantCharClick()} style={comStyles().scroll}>
					{/*<div style={comStyles().up_part}>
						{
							this.state.show_up
							?
							<Icon type='up' size='lg' style={comStyles().up} />
							:
							null
						}
					</div>*/}
					<div id='middle_part' style={comStyles().middle_part}>
						<div id='hello' style={comStyles().sectional}>
							<SubtitlesMachine
									instant={this.state.instantChars}
									speed={0.25}
									delay={500}
									text={`Hello 👋`}
									textStyles={{
										fontSize: '1.5rem',
										color: 'white',
										textAlign: 'left',
		                fontWeight: 'bold'
									}}
									containerStyles={{
										width: '100%',
										backgroundColor: 'rgba(0,0,0,0)',
										borderRadius: '20px',
									}}
									doneEvent={() => {
										console.log('DONE')
										setTimeout(() => {
											this.setState({ completed: this.state.completed.concat(['hello']) })
											// console.log('DONE')
										}, 500)
									}}
								/>
							{
								this.state.completed.filter(c => c === 'hello').length > 0
								?
								<div id='im_renthero' style={comStyles().field_holder}>
									<SubtitlesMachine
											instant={this.state.instantChars}
											speed={0.25}
											delay={500}
											text={`My name is RentHero 😇`}
											textStyles={{
												fontSize: '1.5rem',
												color: 'white',
												textAlign: 'left',
												fontWeight: 'bold'
											}}
											containerStyles={{
												width: '100%',
												backgroundColor: 'rgba(0,0,0,0)',
												borderRadius: '20px',
											}}
											doneEvent={() => {
												setTimeout(() => {
													this.setState({ completed: this.state.completed.concat(['im_renthero']) })
												}, 500)
											}}
										/>
								</div>
								:
								null
							}
							{
								this.state.completed.filter(c => c === 'im_renthero').length > 0
								?
								<div id='what_i_do' style={comStyles().field_holder}>
									<SubtitlesMachine
											instant={this.state.instantChars}
											speed={0.3}
											delay={500}
											text={`I'm an A.I. rental agent looking out for your best interests . . . I'll help you find homes 🏠 provide expert advice 💡 and prepare your paperwork 📜`}
											textStyles={{
												fontSize: '1.1rem',
												color: 'white',
												textAlign: 'left',
											}}
											containerStyles={{
												width: '100%',
												backgroundColor: 'rgba(0,0,0,0)',
												borderRadius: '20px',
												margin: '50px 0px 0px 0px',
											}}
											doneEvent={() => {
												setTimeout(() => {
													this.setState({ completed: this.state.completed.concat(['what_i_do']) })
												}, 500)
											}}
										/>
								</div>
								:
								null
							}
							{
								this.state.completed.filter(c => c === 'what_i_do').length > 0
								?
								<div id='home_hunting' style={comStyles().field_holder}>
									<SubtitlesMachine
											instant={this.state.instantChars}
											speed={0.25}
											delay={800}
											text={`Ready to start home hunting? 😄`}
											textStyles={{
												fontSize: '1.1rem',
												color: 'white',
												textAlign: 'left',
											}}
											containerStyles={{
												width: '100%',
												backgroundColor: 'rgba(0,0,0,0)',
												borderRadius: '20px',
												margin: '50px 0px 0px 0px',
											}}
											doneEvent={() => {
												setTimeout(() => {
													this.setState({ completed: this.state.completed.concat(['home_hunting']) })
													$('#middle_part').animate({
															scrollTop: document.getElementById("middle_part").scrollHeight
													}, 500);
												}, 500)
											}}
										/>
								</div>
								:
								null
							}
							{
								this.state.completed.filter(c => c === 'home_hunting').length > 0
								?
								<div onClick={() => this.beginAdventure()} style={inputStyles().button}>
									BEGIN ADVENTURE
								</div>
								:
								null
							}
						</div>
					</div>
					<div style={comStyles().down_part}>
						{/*
							this.state.show_down
							?
							<Icon onClick={() => {
								$('#middle_part').animate({
										scrollTop: document.getElementById("middle_part").scrollHeight
								}, 500);
							}} type='down' size='lg' style={comStyles().down} />
							:
							null
						*/}
					</div>
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
InteractiveTemplate.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
InteractiveTemplate.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(InteractiveTemplate)

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
			position: 'fixed',
      minHeight: '90vh',
			bottom: '0px',
      width: '100%',
      maxWidth: '500px',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
		up_part: {
			position: 'fixed',
			top: '0px',
			height: '15vh',
			minHeight: '15vh',
			maxHeight: '15vh',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-end',
			alignItems: 'center',
		},
		middle_part: {
      // display: 'flex',
      flexDirection: 'column',
      height: '90vh',
      width: '100%',
      maxWidth: '500px',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      padding: '10px 0px 0px 0px',
			overflowY: 'scroll',
			padding: '20px 20px 20px 20px',
		},
		down_part: {
			position: 'fixed',
			bottom: '0px',
			height: '10vh',
			minHeight: '10vh',
			maxHeight: '10vh',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
		},
		up: {
			color: 'white',
			fontWeight: 'bold',
			cursor: 'pointer',
		},
		down: {
			color: 'white',
			fontWeight: 'bold',
			cursor: 'pointer',
		},
		sectional: {
			position: 'relative',
			height: 'auto',
			minHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
			padding: '20px 0px 0px 0px',
			width: '100%',
		},
		field_holder: {
			display: 'flex',
			flexDirection: 'column',
			width: '100%',
			position: 'relative',
		},
		check: {
			color: 'white',
			fontWeight: 'bold',
			cursor: 'pointer',
			margin: '15px 0px 0px 0px',
			position: 'absolute',
			bottom: '0px',
			right: '0px',
		}
	}
}


const inputStyles = () => {
  return {
    text: {
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      display: 'flex',
      outline: 'none',
      width: '100%',
      fontSize: '1.2rem',
      height: '30px',
      borderRadius: '10px',
      padding: '20px',
      color: '#ffffff',
      webkitBoxShadow: '0 2px 10px 1px rgba(0,0,0,0)',
      boxShadow: '0 2px 10px 1px rgba(0,0,0,0)',
    },
    button: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      color: 'white',
      border: '1px solid white',
      padding: '15px',
      width: '100%',
      borderRadius: '15px',
      textAlign: 'center',
      cursor: 'pointer',
			position: 'absolute',
			bottom: '10vh',
    },
  }
}
