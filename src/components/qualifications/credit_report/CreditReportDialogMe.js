// Compt for copying as a CreditReportDialogMe
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import $ from 'jquery'
import SubtitlesMachine from '../../modules/SubtitlesMachine'
import {
	Icon,
	WhiteSpace,
	Slider,
} from 'antd-mobile'


class CreditReportDialogMe extends Component {

	constructor() {
		super()
		this.state = {
			show_up: true,
			show_down: true,
			listeners: [],
			completed: [],

			knowWhatCreditReportIs: '',	// 'yes', 'remind', 'no'
			shouldGrabCreditReport: '',	// 'show', 'remind'

			creditScore: 650,
			changedMind: false,
		}
	}

	componentDidUpdate() {
		// repeat this for each HTML input field you need to auto-close on enter key press
		if (this.state.listeners.filter(l => l === 'input_field').length === 0 && document.getElementById('input_field')) {
			this.listenToInputClose('#section_two', 'two', 'input_field')
		}
	}

	incrementCounter(attr, inc) {
    if (this.state[attr] + inc >= 0) {
      this.setState({
        [attr]: this.state[attr] + inc
      })
    }
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

	renderCreditReportRefresherScreen() {
		return (
			<div id='credit_report_refresher' style={comStyles().sectional}>
				<SubtitlesMachine
						speed={0.25}
						delay={800}
						text={`A credit report is an official government 🏛️ + bank document 📜 that shows how reliably you pay back credit card bills, car loans and debt 😅`}
						textStyles={{
							fontSize: '1.3rem',
							color: 'white',
							textAlign: 'left',
						}}
						containerStyles={{
							width: '100%',
							backgroundColor: 'rgba(0,0,0,0)',
							borderRadius: '20px',
						}}
						doneEvent={() => {
							setTimeout(() => {
								this.setState({ completed: this.state.completed.concat(['credit_report_refresher']) })
							}, 500)
						}}
					/>
					{
						this.state.completed.filter(c => c === 'credit_report_refresher').length > 0
						?
						<div id='simple_score_out_of_850' style={comStyles().sectional_section}>
							<SubtitlesMachine
									speed={0.25}
									delay={800}
									text={`Your credit report is summarized by a simple score out of 850. Only official EQUIFAX reports are accepted.`}
									textStyles={{
										fontSize: '1.3rem',
										color: 'white',
										textAlign: 'left',
									}}
									containerStyles={{
										width: '100%',
										backgroundColor: 'rgba(0,0,0,0)',
										borderRadius: '20px',
										padding: '40px 0px 0px 0px'
									}}
									doneEvent={() => {
										setTimeout(() => {
											this.setState({ completed: this.state.completed.concat(['simple_score_out_of_850']) })
										}, 300)
									}}
								/>
						</div>
						:
						null
					}
					{
						this.state.completed.filter(c => c === 'simple_score_out_of_850').length > 0
						?
						<div id='learn_how_to_get_report' style={comStyles().sectional_section}>
							<SubtitlesMachine
									speed={0.25}
									delay={800}
									text={`Would you like get your EQUIFAX report? It takes 15 minutes and you will need a laptop computer.`}
									textStyles={{
										fontSize: '1.3rem',
										color: 'white',
										textAlign: 'left',
									}}
									containerStyles={{
										width: '100%',
										backgroundColor: 'rgba(0,0,0,0)',
										borderRadius: '20px',
										padding: '40px 0px 0px 0px'
									}}
									doneEvent={() => {
										setTimeout(() => {
											this.setState({ completed: this.state.completed.concat(['learn_how_to_get_report']) })
										}, 300)
									}}
								/>
								{
									this.state.completed.filter(c => c === 'learn_how_to_get_report').length > 0
									?
									<div id='should_you_get_report' style={comStyles().field_holder}>
										<div style={shouldGrabCreditReportStyles().listDiv}>
											<a href='https://renthero.fyi/rent-basics/how-to-do-credit-checks-as-tenants' target='_blank'>
												<div onClick={() => {this.setState({ shouldGrabCreditReport: 'show' }); this.clickedCheck('#credit_report_refresher', 'know_credit_report_options');}} style={shouldGrabCreditReportStyles(this.state.shouldGrabCreditReport).show}>SHOW ME HOW</div>
											</a>
											<div onClick={() => {this.setState({ shouldGrabCreditReport: 'remind' }); this.clickedCheck('#credit_report_refresher', 'know_credit_report_options')}} style={shouldGrabCreditReportStyles(this.state.shouldGrabCreditReport).remind}>REMIND ME LATER</div>
										</div>
									</div>
									:
									null
								}
						</div>
						:
						null
					}
			</div>
		)
	}

	renderCreditHealth(creditScore) {
		let label = 'HEALTHY'
		let color = ''
		if (creditScore >= 750) {
			label = 'EXCELLENT'
			color = '#32cd32'
		} else if (creditScore >= 700) {
			label = 'HEALTHY'
			color = '#72d92d'
		} else if (creditScore >= 620) {
			label = 'NORMAL'
			color = '#72d92d'
		} else if (creditScore >= 500) {
			label = 'POOR'
			color = '#ff9600'
		} else {
			label = 'WORST'
			color = '#ff0000'
		}
		return (
			<div style={{ width: '70px', padding: '3px', backgroundColor: 'white', fontSize: '0.65rem', borderRadius: '10px', textAlign: 'center', color: color }}>
				{label}
			</div>
		)
	}

	renderCreditScoreInputScreen() {
		return (
			<div id='input_credit_score_screen' style={comStyles().sectional}>
				<SubtitlesMachine
						speed={0.25}
						delay={800}
						text={`Please enter your EQUIFAX credit score below. Landlords require everyone in your group to do this 👍`}
						textStyles={{
							fontSize: '1.3rem',
							color: 'white',
							textAlign: 'left',
						}}
						containerStyles={{
							width: '100%',
							backgroundColor: 'rgba(0,0,0,0)',
							borderRadius: '20px',
						}}
						doneEvent={() => {
							setTimeout(() => {
								this.setState({ completed: this.state.completed.concat(['input_credit_score_screen']) })
							}, 300)
						}}
					/>
					{
						this.state.completed.filter(c => c === 'input_credit_score_screen').length > 0
						?
						<div style={{ margin: '20px 0px 20px 0px', width: '100%' }}>
							<a href='https://renthero.fyi/rent-basics/how-to-do-credit-checks-as-tenants' target='_blank' style={{ textDecoration: 'none', color: 'white' }}>Click here for a how-to guide</a>
						</div>
						:
						null
					}
					{
						this.state.completed.filter(c => c === 'input_credit_score_screen').length > 0
						?
						<div id='input_credit_score_screen_input' style={comStyles().field_holder}>
							<div style={inputStyles().counterDiv}>
								<div onClick={() => this.incrementCounter('creditScore', -1)} style={{ fontSize: '3rem', color: 'white', fontWeight: 'bold' }}>-</div>
								<div style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
									{this.state.creditScore}
									{this.renderCreditHealth(this.state.creditScore)}
								</div>
								<div onClick={() => this.incrementCounter('creditScore', 1)} style={{ fontSize: '3rem', color: 'white', fontWeight: 'bold' }}>+</div>
							</div>
							<WhiteSpace size="lg" />
							<Slider
								style={{ }}
								defaultValue={700}
								min={400}
								max={850}
								step={10}
								value={this.state.creditScore}
								onChange={(v) => this.setState({ creditScore: v })}
							/>
							<div onClick={() => {
								this.setState({ changedMind: true })
								this.clickedCheck('#remind_me_later', 'remind_later')
							}} style={inputStyles().smallButton}>Remind Me Later</div>
							<Icon onClick={() => {
								this.setState({ completed: this.state.completed.concat(['input_credit_score_screen_input']) })
								this.clickedCheck('#input_credit_report_screen', 'input_credit_score_screen_input')}
							} type='check-circle' size='lg' style={comStyles().check} />
						</div>
						:
						null
					}
			</div>
		)
	}

	renderCreditReportInputScreen() {
		return (
			<div id='input_credit_report_screen' style={comStyles().sectional}>
				<SubtitlesMachine
						speed={0.25}
						delay={800}
						text={`Please upload your credit report as a PDF 📜 RentHero keeps all your sensitive documents secure with bank level AES-256 bit encryption 🔒`}
						textStyles={{
							fontSize: '1.3rem',
							color: 'white',
							textAlign: 'left',
						}}
						containerStyles={{
							width: '100%',
							backgroundColor: 'rgba(0,0,0,0)',
							borderRadius: '20px',
						}}
						doneEvent={() => {
							setTimeout(() => {
								this.setState({ completed: this.state.completed.concat(['input_credit_report_screen']) })
							}, 300)
						}}
					/>
					{
						this.state.completed.filter(c => c === 'input_credit_report_screen').length > 0
						?
						<div style={inputStyles().upload}>UPLOAD</div>
						:
						null
					}
					{
						this.state.completed.filter(c => c === 'input_credit_report_screen').length > 0
						?
						<div id='input_credit_report_screen_input' style={comStyles().field_holder}>
							<div onClick={() => {
								this.setState({ changedMind: true })
								this.clickedCheck('#remind_me_later', 'input_credit_report_screen_input')
							}} style={inputStyles().smallButton}>Remind Me Later</div>
							<Icon onClick={() => {
								this.clickedCheck('#completion_screen', 'input_credit_report_screen_input')}
							} type='check-circle' size='lg' style={comStyles().check} />
						</div>
						:
						null
					}
			</div>
		)
	}

	renderRemindMeLater() {
		return (
			<div id='remind_me_later' style={comStyles().sectional}>
				<SubtitlesMachine
						speed={0.25}
						delay={500}
						text={`Sure 👍 We can do this another time. Remember that all landlords require a credit report, so it's better to get it done earlier rather than later.`}
						textStyles={{
							fontSize: '1.3rem',
							color: 'white',
							textAlign: 'left',
						}}
						containerStyles={{
							width: '100%',
							backgroundColor: 'rgba(0,0,0,0)',
							borderRadius: '20px',
						}}
						doneEvent={() => {
							setTimeout(() => {
								this.setState({ completed: this.state.completed.concat(['remind_me_later']) })
							}, 500)
						}}
					/>
					{
						this.state.completed.filter(c => c === 'remind_me_later').length > 0
						?
						<SubtitlesMachine
								speed={0.25}
								delay={500}
								text={`You can always come back to upload your docs by going to Profile > My Documents 🙂`}
								textStyles={{
									fontSize: '1.3rem',
									color: 'white',
									textAlign: 'left',
								}}
								containerStyles={{
									width: '100%',
									backgroundColor: 'rgba(0,0,0,0)',
									borderRadius: '20px',
									padding: '30px 0px 0px 0px'
								}}
								doneEvent={() => {
									setTimeout(() => {
										this.setState({ completed: this.state.completed.concat(['profile_my_documents']) })
									}, 500)
								}}
							/>
						:
						null
					}
					{
						this.state.completed.filter(c => c === 'profile_my_documents').length > 0
						?
						<div onClick={() => this.props.history.push('/matches')} style={inputStyles().button}>
							BACK TO BROWSING
						</div>
						:
						null
					}
			</div>
		)
	}

	renderCompletionScreen() {
		return (
			<div id='completion_screen' style={comStyles().sectional}>
				<SubtitlesMachine
						speed={0.25}
						delay={500}
						text={`Congratulations, you did it! 🎉 Your rental application is now more complete 😄`}
						textStyles={{
							fontSize: '1.3rem',
							color: 'white',
							textAlign: 'left',
						}}
						containerStyles={{
							width: '100%',
							backgroundColor: 'rgba(0,0,0,0)',
							borderRadius: '20px',
						}}
						doneEvent={() => {
							setTimeout(() => {
								this.setState({ completed: this.state.completed.concat(['completion_screen']) })
							}, 500)
						}}
					/>
					{
						this.state.completed.filter(c => c === 'completion_screen').length > 0
						?
						<SubtitlesMachine
								speed={0.25}
								delay={500}
								text={`Before you go back to browsing properties, share the link below with your roommates so they can be better prepared too 💪 Teamwork!`}
								textStyles={{
									fontSize: '1.3rem',
									color: 'white',
									textAlign: 'left',
								}}
								containerStyles={{
									width: '100%',
									backgroundColor: 'rgba(0,0,0,0)',
									borderRadius: '20px',
									padding: '20px 0px 0px 0px'
								}}
								doneEvent={() => {
									setTimeout(() => {
										this.setState({ completed: this.state.completed.concat(['completion_screen_share']) })
									}, 500)
								}}
							/>
						:
						null
					}
					{
						this.state.completed.filter(c => c === 'completion_screen_share').length > 0
						?
						<div style={inputStyles().share}>
							<input
								id="share_link"
								onClick={() => {
									document.getElementById("share_link").select()
									document.execCommand("copy")
								}}
								value={`🔗  ${window.location.origin}${this.props.location.pathname}`}
								style={inputStyles().text}
							></input>
						</div>
						:
						null
					}
					{
						this.state.completed.filter(c => c === 'completion_screen_share').length > 0
						?
						<div onClick={() => this.props.history.push('/matches')} style={inputStyles().button}>
							BACK TO BROWSING
						</div>
						:
						null
					}
			</div>
		)
	}

	render() {
		return (
			<div id='CreditReportDialogMe' style={comStyles().container}>
        <div style={comStyles().scroll}>
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
						<div id='initial_welcome' style={comStyles().sectional}>
							<SubtitlesMachine
									speed={0.25}
									delay={500}
									text={`I see you've found some cool properties! 😎 Let's briefly talk about paperwork.`}
									textStyles={{
										fontSize: '1.3rem',
										color: 'white',
										textAlign: 'left',
									}}
									containerStyles={{
										width: '100%',
										backgroundColor: 'rgba(0,0,0,0)',
										borderRadius: '20px',
									}}
									doneEvent={() => {
										setTimeout(() => {
											this.setState({ completed: this.state.completed.concat(['cool']) })
										}, 500)
									}}
								/>
								{
									this.state.completed.filter(c => c === 'cool').length > 0
									?
									<div id='ask_know_what_is_credit_report' style={comStyles().sectional_section}>
										<SubtitlesMachine
												speed={0.25}
												delay={800}
												text={`All landlords in Ontario expect a credit report with your application. Do you know what that is? 🤔`}
												textStyles={{
													fontSize: '1.3rem',
													color: 'white',
													textAlign: 'left',
												}}
												containerStyles={{
													width: '100%',
													backgroundColor: 'rgba(0,0,0,0)',
													borderRadius: '20px',
													margin: '30px 0px 0px 0px'
												}}
												doneEvent={() => {
													setTimeout(() => {
														this.setState({ completed: this.state.completed.concat(['ask_know_what_is_credit_report']) })
													}, 300)
												}}
											/>
											{
												this.state.completed.filter(c => c === 'ask_know_what_is_credit_report').length > 0
												?
												<div id='know_credit_report_options' style={comStyles().field_holder}>
													<div style={knowWhatIsCreditReportStyles().listDiv}>
														<div onClick={() => {this.setState({ knowWhatCreditReportIs: 'yes' }); this.clickedCheck('#input_credit_score_screen', 'know_credit_report_options')}} style={knowWhatIsCreditReportStyles(this.state.knowWhatCreditReportIs).yes}>YES</div>
														<div onClick={() => {this.setState({ knowWhatCreditReportIs: 'remind' }); this.clickedCheck('#credit_report_refresher', 'know_credit_report_options')}} style={knowWhatIsCreditReportStyles(this.state.knowWhatCreditReportIs).remind}>REMIND ME</div>
														<div onClick={() => {this.setState({ knowWhatCreditReportIs: 'no' }); this.clickedCheck('#credit_report_refresher', 'know_credit_report_options')}} style={knowWhatIsCreditReportStyles(this.state.knowWhatCreditReportIs).no}>NO</div>
													</div>
												</div>
												:
												null
											}
									</div>
									:
									null
								}
						</div>
						{/* interactive pathway when they DO NOT know what a credit report is */}
						{
							this.state.completed.filter(c => c === 'know_credit_report_options').length > 0 && this.state.knowWhatCreditReportIs !== 'yes'
							?
							this.renderCreditReportRefresherScreen()
							:
							null
						}
						{
							this.state.shouldGrabCreditReport === 'show'
							?
							this.renderCreditScoreInputScreen()
							:
							null
						}
						{
							this.state.shouldGrabCreditReport === 'show' && this.state.completed.filter(c => c === 'input_credit_score_screen_input').length > 0
							?
							this.renderCreditReportInputScreen()
							:
							null
						}
						{
							this.state.shouldGrabCreditReport === 'remind'
							?
							this.renderRemindMeLater()
							:
							null
						}
						{/* interactive pathway when they DO know what a credit report is */}
						{
							this.state.completed.filter(c => c === 'know_credit_report_options').length > 0 && this.state.knowWhatCreditReportIs === 'yes'
							?
							this.renderCreditScoreInputScreen()
							:
							null
						}
						{
							this.state.completed.filter(c => c === 'input_credit_score_screen_input').length > 0 && this.state.knowWhatCreditReportIs === 'yes'
							?
							this.renderCreditReportInputScreen()
							:
							null
						}
						{
							this.state.changedMind
							?
							this.renderRemindMeLater()
							:
							null
						}
						{
							this.state.completed.filter(c => c === 'input_credit_report_screen_input').length > 0 && !this.state.changedMind
							?
							this.renderCompletionScreen()
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
CreditReportDialogMe.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
CreditReportDialogMe.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(CreditReportDialogMe)

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
      display: 'flex',
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
			height: '90vh',
			minHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
			padding: '20px 0px 0px 0px',
			width: '100%',
			position: 'relative',
		},
		sectional_section: {
			display: 'flex',
			flexDirection: 'column',
			width: '100%',
			position: 'relative',
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
			cursor: 'pointer',
    },
		counterDiv: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding: '30px'
    },
		smallButton: {
			padding: '8px',
			fontSize: '0.7rem',
			color: 'white',
			border: '1px solid white',
			borderRadius: '15px',
			cursor: 'pointer',
			minWidth: '130px',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			margin: '15px 0px 0px 0px',
			position: 'absolute',
			bottom: '0px',
			left: '0px',
		},
    button: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: 'white',
      border: '1px solid white',
      padding: '15px',
      width: '100%',
      borderRadius: '15px',
      textAlign: 'center',
      cursor: 'pointer',
			position: 'absolute',
			bottom: '15vh'
    },
		upload: {
			margin: '30px 0px 0px 0px',
			width: '100%',
			height: '250px',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			fontSize: '1.5rem',
			fontWeight: 'bold',
			color: 'white',
			border: '2px dashed white',
			borderRadius: '20px',
		},
		share: {
			width: '100%',
			margin: '30px 0px 0px 0px',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
		},
  }
}


const knowWhatIsCreditReportStyles = (answer) => {
	let listOptions = {
		padding: '10px',
		fontSize: '0.8rem',
		color: 'white',
		border: '1px solid white',
		borderRadius: '15px',
		margin: '10px',
		cursor: 'pointer',
		minWidth: '100px',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	}
	let yesStyles = {}
	let remindStyles = {}
	let noStyles = {}
	if (answer === 'yes') {
		yesStyles.color = '#009cff'
		yesStyles.backgroundColor = 'white'
	}
	if (answer === 'remind') {
		remindStyles.color = '#009cff'
		remindStyles.backgroundColor = 'white'
	}
	if (answer === 'no') {
		noStyles.color = '#009cff'
		noStyles.backgroundColor = 'white'
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
		yes: {
			...listOptions,
			...yesStyles,
		},
		remind: {
			...listOptions,
			...remindStyles,
		},
		no: {
			...listOptions,
			...noStyles,
		},
	}
}


const shouldGrabCreditReportStyles = (answer) => {
	let listOptions = {
		padding: '10px',
		fontSize: '0.8rem',
		color: 'white',
		border: '1px solid white',
		borderRadius: '15px',
		margin: '10px',
		cursor: 'pointer',
		minWidth: '150px',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	}
	let showStyles = {}
	let remindStyles = {}
	if (answer === 'show') {
		showStyles.color = '#009cff'
		showStyles.backgroundColor = 'white'
	}
	if (answer === 'remind') {
		remindStyles.color = '#009cff'
		remindStyles.backgroundColor = 'white'
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
		show: {
			...listOptions,
			...showStyles,
		},
		remind: {
			...listOptions,
			...remindStyles,
		},
	}
}
