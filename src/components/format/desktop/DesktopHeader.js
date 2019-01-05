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
	Menu,
	Dropdown,
	Icon,
} from 'antd'
import DesktopDropdown from './DesktopDropdown'
import {
	getListings,
} from '../../../api/listings/listings_api'
import {
	saveListingsToRedux,
} from '../../../actions/listings/listings_actions'
import { saveTenantPreferences } from '../../../api/prefs/prefs_api'
import { selectCity } from '../../../actions/listings/listings_actions'
import { triggerDrawerNav } from '../../../actions/app/app_actions'

class DesktopHeader extends Component {

	renderTenantUnauthenticated() {
		return (
			<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
				<div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'white', cursor: 'pointer' }} onClick={() => this.props.history.push('/login')}>Login</div>
			</div>
		)
	}

	renderTenantAuthenticated() {
		return (
			<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
				<div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'white', cursor: 'pointer' }} onClick={() => this.props.history.push('/favourites')}>Favourites</div>
			</div>
		)
	}

	selectedCity({ DESTINATION_ADDRESS, DESTINATION_GEOPOINT, city }) {
		// this.props.selectCity(city)
		// saveTenantPreferences({
    //   TENANT_ID: this.props.tenant_profile.tenant_id,
    //   KEY: 'LOCATION',
    //   DESTINATION_ADDRESS,
    //   DESTINATION_GEOPOINT,
    // }).then((LOCATION) => {
    //   console.log(LOCATION)
    //   this.props.updatePreferences(LOCATION)
		// 	return getListings(this.props.prefs)
    // }).then((data) => {
    //   this.props.saveListingsToRedux(data)
    // }).catch((err) => {
    //   console.log(err)
    // })
	}

	render() {
		const menu = (
			<Menu>
		    <Menu.Item>
		      <a target="_blank" rel="noopener noreferrer" onClick={() => this.selectedCity({
						DESTINATION_ADDRESS: '200 University Ave W, Waterloo, ON N2L 3G1',
						DESTINATION_GEOPOINT: '43.473811,-80.531618',
						city: 'Waterloo, Canada'
					})}>Waterloo, Canada</a>
		    </Menu.Item>
		    {/*<Menu.Item>
		      <a target="_blank" rel="noopener noreferrer" onClick={() => this.selectedCity({
						DESTINATION_ADDRESS: 'NO',
						DESTINATION_GEOPOINT: '54.6576,-45.5675',
						city: 'Toronto, Canada'
					})}>Toronto, Canada</a>
		    </Menu.Item>*/}
		  </Menu>
		)
		return (
			<div id='DesktopHeader' style={comStyles().container}>
				<div style={comStyles().font_logo} onClick={() => this.props.history.push('/matches')}>RentHero</div>

				<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
					<Dropdown overlay={menu}>
				    <a className="ant-dropdown-link" href="#" style={{ color: 'white' }}>
				      {this.props.chosen_city} <Icon type="down" />
				    </a>
				  </Dropdown>
					&nbsp; &nbsp;

					{/*<div onClick={() => this.props.triggerDrawerNav(true)}><i className='ion-navicon-round' style={{ fontSize: '1.3rem', color: 'white', cursor: 'pointer' }}></i></div>*/}
					{
						this.props.authentication_loaded && this.props.tenant_profile && this.props.tenant_profile.authenticated
						?
						<DesktopDropdown />
						:
						this.renderTenantUnauthenticated()
					}
				</div>
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
	chosen_city: PropTypes.string.isRequired,
	selectCity: PropTypes.func.isRequired,
	saveListingsToRedux: PropTypes.func.isRequired,
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
		chosen_city: redux.listings.chosen_city,
		prefs: redux.prefs,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		triggerDrawerNav,
		selectCity,
		saveListingsToRedux,
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
