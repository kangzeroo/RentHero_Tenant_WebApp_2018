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
import { triggerDrawerNav } from '../../actions/app/app_actions'
import { ACCENT_COLOR, FONT_COLOR, BACKGROUND_COLOR, FONT_FAMILY, INVERSE_FONT_COLOR } from '../modules/AdvisorUI_v2/styles/advisor_ui_styles'


class Checklist extends Component {

	render() {
		return (
			<div id='Checklist' style={comStyles().container}>
        <div onClick={() => this.props.triggerDrawerNav(true)} style={{ position: 'absolute', left: '10px', top: '10px' }}><i className='ion-navicon-round' style={{ fontSize: '1.3rem' }}></i></div>
        <div style={{ height: '150px', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><h3>Tenant TODO Checklist</h3></div>
        <div style={comStyles().dialog_menu}>
				    <div key='movein' onClick={() => this.props.history.push('/dialog/movein')} style={choiceStyles().action}>Move In</div>
				    <div key='group' onClick={() => this.props.history.push('/dialog/group')} style={choiceStyles().action}>My Group</div>
				    <div key='finances' onClick={() => this.props.history.push('/dialog/finance')} style={choiceStyles().action}>Finances</div>
				    <div key='credit' onClick={() => this.props.history.push('/dialog/credit')} style={choiceStyles().action}>Credit</div>
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
Checklist.propTypes = {
	history: PropTypes.object.isRequired,
  triggerDrawerNav: PropTypes.func.isRequired,
}

// for all optional props, define a default value
Checklist.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(Checklist)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

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
      ":hover": {
        backgroundColor: 'rgba(256,256,256,1)',
        color: INVERSE_FONT_COLOR
      }
    }
  }
}
