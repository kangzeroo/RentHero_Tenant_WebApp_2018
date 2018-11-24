// Compt for copying as a MoveInPrefs
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import $ from 'jquery'
import SubtitlesMachine from '../modules/SubtitlesMachine'
import { Calendar, DateRangePicker } from 'react-date-range'
import {
	Icon,
	Toast,
} from 'antd-mobile'


class MoveInPrefs extends Component {

	constructor() {
		super()
		this.state = {
			show_up: true,
			show_down: true,
			listeners: [],
			completed: [],
			instantChars: false,

			date: new Date(),
			movein_rush: '',		// 'must', 'flexible', 'browsing'
			lease_situation: '',
			moving_reason: '',
		}
	}

	componentDidUpdate() {
		// repeat this for each HTML input field you need to auto-close on enter key press
		if (this.state.listeners.filter(l => l === 'input_field').length === 0 && document.getElementById('input_field')) {
			this.listenToInputClose('#section_two', 'two', 'input_field')
		}
	}

	// trigger instant load text from <SubtitleMachine>
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

	render() {
		return (
			<div id='MoveInPrefs' style={comStyles().container}>
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
						<div id='movein_urgency' style={comStyles().sectional}>
							<SubtitlesMachine
									instant={this.state.instantChars}
									speed={0.25}
									delay={500}
									text={`Let's talk about move-in dates. Are you in a rush to move-in? 📅`}
									textStyles={{
										fontSize: '1.1rem',
										color: 'white',
										textAlign: 'left',
									}}
									containerStyles={{
										width: '100%',
										backgroundColor: 'rgba(0,0,0,0)',
										borderRadius: '20px',
									}}
									doneEvent={() => {
										console.log('DONE')
										setTimeout(() => {
											this.setState({ completed: this.state.completed.concat(['movein_urgency']) })
											// console.log('DONE')
										}, 500)
									}}
								/>
								{
									this.state.completed.filter(c => c === 'movein_urgency').length > 0
									?
									<div id='chose_movein_urgency' style={comStyles().field_holder}>
										<div style={moveinRushStyles().listDiv}>
											<div onClick={() => {this.setState({ movein_rush: 'must' }); this.clickedCheck('#moving_reason', 'chose_movein_urgency')}} style={moveinRushStyles(this.state.movein_rush).must}>YES, STRICT MOVE-IN</div>
											<div onClick={() => {this.setState({ movein_rush: 'flexible' }); this.clickedCheck('#moving_reason', 'chose_movein_urgency')}} style={moveinRushStyles(this.state.movein_rush).flexible}>NO, FLEXIBLE MOVE-IN</div>
											<div onClick={() => {this.setState({ movein_rush: 'browsing' }); this.clickedCheck('#moving_reason', 'chose_movein_urgency')}} style={moveinRushStyles(this.state.movein_rush).browsing}>NO, JUST BROWSING</div>
										</div>
									</div>
									:
									null
								}
						</div>
						{
							this.state.movein_rush
							?
							<div id='moving_reason' style={comStyles().sectional}>
								<SubtitlesMachine
									instant={this.state.instantChars}
									speed={0.25}
									delay={500}
									text={`What is the reason for your desired move?`}
									textStyles={{
										fontSize: '1.1rem',
										color: 'white',
										textAlign: 'left',
									}}
									containerStyles={{
										width: '100%',
										backgroundColor: 'rgba(0,0,0,0)',
										borderRadius: '20px',
									}}
									doneEvent={() => {
										console.log('DONE')
										setTimeout(() => {
											this.setState({ completed: this.state.completed.concat(['moving_reason']) })
										}, 500)
									}}
								/>
								{
									this.state.completed.filter(c => c === 'moving_reason').length > 0
									?
									<div style={comStyles().field_holder}>
										<textarea
			                id="moving_reason_text"
											rows={5}
			                value={this.state.moving_reason}
			                onChange={(e) => {
			                  console.log(e.target.value)
			                  this.setState({ moving_reason: e.target.value })
			                }}
			                placeholder="🌃"
			                style={inputStyles().textarea}
			              ></textarea>
										{
											this.state.moving_reason
											?
											<Icon onClick={() => this.clickedCheck('#ideal_movein', 'moving_reason_text', 'moving_reason_text')} type='check-circle' size='lg' style={comStyles().check} />
											:
											null
										}
									</div>
									:
									null
								}
							</div>
							:
							null
						}
						{
							this.state.completed.filter(c => c === 'moving_reason_text').length > 0
							?
							<div id='ideal_movein' style={comStyles().sectional}>
								<SubtitlesMachine
										instant={this.state.instantChars}
										speed={0.25}
										delay={500}
										text={`When is your ideal move-in date? 🏆`}
										textStyles={{
											fontSize: '1.1rem',
											color: 'white',
											textAlign: 'left',
										}}
										containerStyles={{
											width: '100%',
											backgroundColor: 'rgba(0,0,0,0)',
											borderRadius: '20px',
										}}
										doneEvent={() => {
											console.log('DONE')
											setTimeout(() => {
												this.setState({ completed: this.state.completed.concat(['ideal_movein']) })
											}, 500)
										}}
									/>
								{
									this.state.completed.filter(c => c === 'ideal_movein').length > 0
									?
									<div id='ideal_movein_date' style={comStyles().field_holder}>
										<Calendar
											date={this.state.date}
											minDate={new Date()}
											onChange={date => this.setState({ date }, () => console.log(this.state))}
										/>
										{
											moment(this.state.date).diff(moment(), 'hours') < 0
											?
											Toast.fail('Move-in date cannot be in the past', 2)
											:
											null
										}
										{
											moment(this.state.date).diff(moment(), 'hours') > 0
											?
											<Icon onClick={() => this.clickedCheck('#acceptable_movein_range', 'ideal_movein_date')} type='check-circle' size='lg' style={comStyles().check} />
											:
											null
										}
									</div>
									:
									null
								}
							</div>
							:
							null
						}
						{
							this.state.completed.filter(c => c === 'ideal_movein_date').length > 0
							?
							<div id='acceptable_movein_range' style={comStyles().sectional}>
								<SubtitlesMachine
										instant={this.state.instantChars}
										speed={0.25}
										delay={800}
										text={`🤔 Flexible move-in dates gives you more options 😏 What's your range?`}
										textStyles={{
											fontSize: '1.1rem',
											color: 'white',
											textAlign: 'left',
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
												this.setState({ completed: this.state.completed.concat(['acceptable_movein_range']) })
											}, 1000)
										}}
									/>
									{
										this.state.completed.filter(c => c === 'acceptable_movein_range').length > 0
										?
										<div id='chosen_movein_range'>
											<DateRangePicker
												ranges={[{
													startDate: new Date(),
													endDate: new Date(),
													key: 'selection',
												}]}
												showDateDisplay={false}
												moveRangeOnFirstSelection={false}
												className={'PreviewArea'}
												minDate={new Date()}
												onChange={(ranges) => {
													console.log(ranges)
												}}
											/>
											{/*
												moment(this.state.date).diff(moment(), 'hours') < 0
												?
												Toast.fail('Move-in date cannot be in the past', 2)
												:
												null
											*/}
											{
												// moment(this.state.date).diff(moment(), 'hours') > 0
												true
												?
												<Icon onClick={() => this.clickedCheck('#existing-lease', 'chosen_movein_range')} type='check-circle' size='lg' style={comStyles().check} />
												:
												null
											}
										</div>
										:
										null
									}
							</div>
							:
							null
						}
						{
							this.state.completed.filter(c => c === 'chosen_movein_range').length > 0
							?
							<div id='existing-lease' style={comStyles().sectional}>
								<SubtitlesMachine
									instant={this.state.instantChars}
									speed={0.25}
									delay={500}
									text={`Have you been leasing your current place for more than 1 year? 💼`}
									textStyles={{
										fontSize: '1.1rem',
										color: 'white',
										textAlign: 'left',
									}}
									containerStyles={{
										width: '100%',
										backgroundColor: 'rgba(0,0,0,0)',
										borderRadius: '20px',
									}}
									doneEvent={() => {
										console.log('DONE')
										setTimeout(() => {
											this.setState({ completed: this.state.completed.concat(['existing-lease']) })
										}, 500)
									}}
								/>
								{
									this.state.completed.filter(c => c === 'existing-lease').length > 0
									?
									<SubtitlesMachine
										instant={this.state.instantChars}
										id='notice'
										speed={0.25}
										delay={500}
										text={`You legally must give 2 months notice to your landlord before exiting your current lease 🌮`}
										textStyles={{
											fontSize: '1.1rem',
											color: 'white',
											textAlign: 'left',
										}}
										containerStyles={{
											width: '100%',
											backgroundColor: 'rgba(0,0,0,0)',
											borderRadius: '20px',
											margin: '20px 0px 0px 0px'
										}}
										doneEvent={() => {
											console.log('DONE')
											setTimeout(() => {
												this.setState({ completed: this.state.completed.concat(['notice']) })
											}, 500)
										}}
									/>
									:
									null
								}
								{
									this.state.completed.filter(c => c === 'notice').length > 0
									?
									<div id='existing-lease-situation' style={comStyles().field_holder}>
										<div style={leaseSitStyles().listDiv}>
											<div onClick={() => {this.setState({ lease_situation: 'over12mth' }); this.clickedCheck('#results', 'existing-lease-situation')}} style={leaseSitStyles(this.state.lease_situation).over12mth}>STILL UNDER A 12 MONTH LEASE</div>
											<div onClick={() => {this.setState({ lease_situation: 'under12mth' }); this.clickedCheck('#results', 'existing-lease-situation')}} style={leaseSitStyles(this.state.lease_situation).under12mth}>MONTH-TO-MONTH LEASE</div>
											<div onClick={() => {this.setState({ lease_situation: 'sublet' }); this.clickedCheck('#results', 'existing-lease-situation')}} style={leaseSitStyles(this.state.lease_situation).sublet}>SHORT-TERM SUBLET</div>
											<div onClick={() => {this.setState({ lease_situation: 'nolease' }); this.clickedCheck('#results', 'existing-lease-situation')}} style={leaseSitStyles(this.state.lease_situation).nolease}>NO LEASE</div>
											{/*<div onClick={() => this.setState({ lease_situation: 'complicated' })} style={leaseSitStyles(this.state.lease_situation).complicated}>IT'S COMPLICATED</div>*/}
										</div>
									</div>
									:
									null
								}
								{
									this.state.completed.filter(c => c === 'existing-lease-situation').length > 0
									?
									<div id='results' style={comStyles().sectional}>
										<SubtitlesMachine
												instant={this.state.instantChars}
												speed={0.25}
												delay={500}
												text={`We found 88 matching rentals for your time range. Check out the distribution.`}
												textStyles={{
													fontSize: '1.1rem',
													color: 'white',
													textAlign: 'left',
												}}
												containerStyles={{
													width: '100%',
													backgroundColor: 'rgba(0,0,0,0)',
													borderRadius: '20px',
													margin: '20px 0px 0px 0px'
												}}
												doneEvent={() => {
													console.log('DONE')
													setTimeout(() => {
														this.setState({ completed: this.state.completed.concat(['results']) })
													}, 500)
												}}
											/>
									</div>
									:
									null
								}
								{
									this.state.completed.filter(c => c === 'results').length > 0
									?
									<div onClick={() => this.props.history.push('/matches')} style={inputStyles().button}>
										SEE MATCHES
									</div>
									:
									null
								}
							</div>
							:
							null
						}
					</div>
					<div style={comStyles().down_part}>
						{
							this.state.show_down
							?
							<Icon onClick={() => {
								$('#middle_part').animate({
										scrollTop: document.getElementById("middle_part").scrollHeight
								}, 500);
							}} type='down' size='lg' style={comStyles().down} />
							:
							null
						}
					</div>
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
MoveInPrefs.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
MoveInPrefs.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MoveInPrefs)

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
			padding: '20px 0px 70px 0px'
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
		textarea: {
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      display: 'flex',
      outline: 'none',
      width: '100%',
      fontSize: '1.2rem',
      height: 'auto',
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


const moveinRushStyles = (movein_rush) => {
	let listOptions = {
		padding: '10px',
		fontSize: '0.8rem',
		color: 'white',
		border: '1px solid white',
		borderRadius: '15px',
		margin: '10px',
		cursor: 'pointer',
		minWidth: '300px',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	}
	let mustStyles = {}
	let flexibleStyles = {}
	let browsingStyles = {}
	if (movein_rush === 'must') {
		mustStyles.color = '#009cff'
		mustStyles.backgroundColor = 'white'
	}
	if (movein_rush === 'flexible') {
		flexibleStyles.color = '#009cff'
		flexibleStyles.backgroundColor = 'white'
	}
	if (movein_rush === 'browsing') {
		browsingStyles.color = '#009cff'
		browsingStyles.backgroundColor = 'white'
	}
	return {
		listDiv: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			flexWrap: 'wrap',
			width: '100%',
			padding: '30px'
		},
		must: {
			...listOptions,
			...mustStyles,
		},
		flexible: {
			...listOptions,
			...flexibleStyles,
		},
		browsing: {
			...listOptions,
			...browsingStyles,
		},
	}
}


const leaseSitStyles = (lease_situation) => {
	let listOptions = {
		padding: '10px',
		fontSize: '0.8rem',
		color: 'white',
		border: '1px solid white',
		borderRadius: '15px',
		margin: '10px',
		cursor: 'pointer',
		minWidth: '300px',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	}
	let over12mthStyles = {}
	let under12mthStyles = {}
	let subletStyles = {}
	let complicatedStyles = {}
	let noleaseStyles = {}
	if (lease_situation === 'over12mth') {
		over12mthStyles.color = '#009cff'
		over12mthStyles.backgroundColor = 'white'
	}
	if (lease_situation === 'under12mth') {
		under12mthStyles.color = '#009cff'
		under12mthStyles.backgroundColor = 'white'
	}
	if (lease_situation === 'sublet') {
		subletStyles.color = '#009cff'
		subletStyles.backgroundColor = 'white'
	}
	if (lease_situation === 'complicated') {
		complicatedStyles.color = '#009cff'
		complicatedStyles.backgroundColor = 'white'
	}
	if (lease_situation === 'nolease') {
		noleaseStyles.color = '#009cff'
		noleaseStyles.backgroundColor = 'white'
	}
	return {
		listDiv: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			flexWrap: 'wrap',
			width: '100%',
			padding: '30px'
		},
		over12mth: {
			...listOptions,
			...over12mthStyles,
		},
		under12mth: {
			...listOptions,
			...under12mthStyles,
		},
		sublet: {
			...listOptions,
			...subletStyles,
		},
		complicated: {
			...listOptions,
			...complicatedStyles,
		},
		nolease: {
			...listOptions,
			...noleaseStyles,
		}
	}
}
