// Compt for copying as a Checklist
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'antd-mobile'
import { Progress } from 'antd'
import { triggerDrawerNav } from '../../actions/app/app_actions'
import { ACCENT_COLOR, FONT_COLOR, BACKGROUND_COLOR, FONT_FAMILY, INVERSE_FONT_COLOR } from '../modules/AdvisorUI_v2/styles/advisor_ui_styles'


class Checklist extends Component {

	checkMoveInProgress() {
		let progress = 0
		let left = 7
		const MOVEIN = this.props.prefs.MOVEIN
		if (MOVEIN.FROM_CITY) {
			progress += 10
			left -= 1
		}
		if (MOVEIN.IDEAL_MOVEIN_DATE) {
			progress += 20
			left -= 1
		}
		if (MOVEIN.MIN_MOVEIN_DATE) {
			progress += 10
			left -= 1
		}
		if (MOVEIN.MAX_MOVEIN_DATE) {
			progress += 10
		}
		if (MOVEIN.TOUR_READY_DATE) {
			progress += 10
			left -= 1
		}
		if (MOVEIN.URGENCY_AS) {
			progress += 20
			left -= 1
		}
		if (MOVEIN.TOUR_REP_AS) {
			progress += 10
			left -= 1
		}
		if (MOVEIN.LEASE_LENGTH) {
			progress += 10
			left -= 1
		}
		return {
			progress,
			left
		}
	}

	checkGroupProgress() {
		let progress = 0
		let left = 4
		const GROUP = this.props.prefs.GROUP
		if (GROUP.ACCEPTABLE_UNITS_AS) {
			progress += 25
			left -= 1
		}
		if (GROUP.CERTAIN_MEMBERS || GROUP.FAMILY_MEMBER_AS) {
			progress += 25
			left -= 1
		}
		if (GROUP.SEARCHING_AS) {
			progress += 25
			left -= 1
		}
		if (GROUP.WHOLE_OR_RANDOM_AS) {
			progress += 25
			left -= 1
		}
		return {
			progress,
			left
		}
	}

	checkFinanceProgress() {
		let progress = 0
		let left = 4
		const FINANCIALS = this.props.prefs.FINANCIALS
		if (FINANCIALS.EMPLOYED_AS) {
			progress += 25
			left -= 1
		}
		if (FINANCIALS.IDEAL_PER_PERSON) {
			progress += 25
			left -= 1
		}
		if (FINANCIALS.SIGN_LEASE_AS) {
			progress += 25
			left -= 1
		}
		if (FINANCIALS.BUDGET_FLEXIBILITY) {
			progress += 25
			left -= 1
		}
		return {
			progress,
			left
		}
	}

	checkCreditProgress() {
		let progress = 0
		let left = 1
		const CREDIT = this.props.prefs.CREDIT
		if (CREDIT.GUESSED_CREDIT_SCORE) {
			progress += 100
			left -= 1
		}
		return {
			progress,
			left
		}
	}

	render() {
		return (
			<div id='Checklist' style={comStyles().container}>
        <div onClick={() => this.props.triggerDrawerNav(true)} style={{ position: 'absolute', left: '10px', top: '10px' }}><i className='ion-navicon-round' style={{ fontSize: '1.3rem' }}></i></div>
        <div style={{ height: '150px', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><h3>Tenant TODO Checklist</h3></div>
        <div style={comStyles().dialog_menu}>
				    <div key='movein' onClick={() => this.props.history.push('/dialog/movein')} style={choiceStyles().action}>
							<div style={choiceStyles().status}><Progress type='circle' percent={this.checkMoveInProgress().progress} width={30} /></div>
							<div style={choiceStyles().label}>
								{
									this.checkMoveInProgress().left == 0
									?
									`Move In`
									:
									`Move In - ${this.checkMoveInProgress().left} Questions`
								}
							</div>
						</div>
				    <div key='group' onClick={() => this.props.history.push('/dialog/group')} style={choiceStyles().action}>
							<div style={choiceStyles().status}><Progress type='circle' percent={this.checkGroupProgress().progress} width={30} /></div>
							<div style={choiceStyles().label}>
								{
									this.checkGroupProgress().left == 0
									?
									`My Group`
									:
									`My Group - ${this.checkGroupProgress().left} Questions`
								}
							</div>
						</div>
				    <div key='finances' onClick={() => this.props.history.push('/dialog/finance')} style={choiceStyles().action}>
							<div style={choiceStyles().status}><Progress type='circle' percent={this.checkFinanceProgress().progress} width={30} /></div>
							<div style={choiceStyles().label}>
								{
									this.checkFinanceProgress().left == 0
									?
									`Set Budget`
									:
									`Set Budget - ${this.checkFinanceProgress().left} Questions`
								}
							</div>
						</div>
				    <div key='credit' onClick={() => this.props.history.push('/dialog/credit')} style={choiceStyles().action}>
							<div style={choiceStyles().status}><Progress type='circle' percent={this.checkCreditProgress().progress} width={30} /></div>
							<div style={choiceStyles().label}>
								{
									this.checkCreditProgress().left == 0
									?
									`Credit`
									:
									`Credit - ${this.checkCreditProgress().left} Questions`
								}
							</div>
						</div>
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
Checklist.propTypes = {
	history: PropTypes.object.isRequired,
  triggerDrawerNav: PropTypes.func.isRequired,
	prefs: PropTypes.func.isRequired,
}

// for all optional props, define a default value
Checklist.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(Checklist)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		prefs: redux.prefs
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    triggerDrawerNav,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
		},
    dialog_menu: {
      padding: '20px',
    }
	}
}


const choiceStyles = () => {
  return {
    action: {
      width: '100%',
      borderRadius: '10px',
      border: `1px solid ${FONT_COLOR}`,
      color: `${FONT_COLOR}`,
      padding: '10px 0px 10px 0px',
      backgroundColor: 'rgba(0,0,0,0)',
      fontSize: '1rem',
      margin: '10px 0px 10px 0px',
      cursor: 'pointer',
      textAlign: 'center',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-around',
			position: 'relative',
      ":hover": {
        backgroundColor: FONT_COLOR,
        color: INVERSE_FONT_COLOR
      }
    },
		status: {
			minWidth: '20%',
			position: 'absolute',
			top: '0px',
			right: '0px',
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
		},
		label: {
			minWidth: '100%'
		}
  }
}
