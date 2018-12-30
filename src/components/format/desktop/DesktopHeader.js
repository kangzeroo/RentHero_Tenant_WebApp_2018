// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Divider,
} from 'antd'
import DesktopDropdown from './DesktopDropdown'
import { triggerDrawerNav } from '../../../actions/app/app_actions'

class DesktopHeader extends Component {

	renderTenantUnauthenticated() {
		return (
			<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
				<div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'white', cursor: 'pointer' }} onClick={() => this.props.history.push('/login')}>Login</div>
			</div>
		)
	}

	render() {
		return (
			<div id='DesktopHeader' style={comStyles().container}>
				<div style={comStyles().font_logo} onClick={() => this.props.history.push('/')}>RentHero</div>

				{/*<div onClick={() => this.props.triggerDrawerNav(true)}><i className='ion-navicon-round' style={{ fontSize: '1.3rem', color: 'white', cursor: 'pointer' }}></i></div>*/}
				{
					this.props.authentication_loaded && this.props.tenant_profile && this.props.tenant_profile.authenticated
					?
					<DesktopDropdown />
					:
					this.renderTenantUnauthenticated()
				}

			</div>
		)
	}
}

// defines the types of variables in this.props
DesktopHeader.propTypes = {
	history: PropTypes.object.isRequired,
  triggerDrawerNav: PropTypes.func.isRequired,
	authenticated: PropTypes.bool.isRequired,
	authentication_loaded: PropTypes.bool.isRequired,
	tenant_profile: PropTypes.object.isRequired,
}

// for all optional props, define a default value
DesktopHeader.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(DesktopHeader)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		authenticated: redux.auth.authenticated,
		authentication_loaded: redux.auth.authentication_loaded,
		tenant_profile: redux.auth.tenant_profile,
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: '7vh',
      maxHeight: '7vh',
      minWidth: '100vw',
      maxWidth: '100vw',
      // background: 'rgba(81, 151, 214, 1)',
      padding: '15px',
			background: '#56CCF2',  /* fallback for old browsers */
			background: '-webkit-linear-gradient(to right, #2F80ED, #56CCF2)',  /* Chrome 10-25, Safari 5.1-6 */
			background: 'linear-gradient(to right, #2F80ED, #56CCF2)', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

		},
    font_logo: {
      fontSize: '1.4rem',
      color: 'white',
      fontWeight: 'bold',
      fontFamily: `'Carter One', cursive`,
			cursor: 'pointer',
    },
	}
}
