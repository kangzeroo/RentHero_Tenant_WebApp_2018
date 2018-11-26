// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import {
  Switch,
  Route,
  withRouter,
  Redirect,
} from 'react-router-dom'
import 'font-awesome/css/font-awesome.css'
import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import {
  LocaleProvider,
  List,
  Drawer,
} from 'antd-mobile'
import enUS from 'antd-mobile/lib/locale-provider/en_US'
import AppRootMechanics from './AppRootMechanics'
import AppRoutes from './AppRoutes'
import HomePage from './pages/HomePage'
import Logout from './auth/Logout'
import WelcomeScreen from './home/WelcomeScreen'
import UserPreferences from './home/UserPreferences'
import NoteToTester from './home/NoteToTester'
import SwipeList from './swipe/SwipeList'
import OnboardingTenant from './tenant/OnboardingTenant'
import MoveInPrefs from './tenant/MoveInPrefs'
import InteractiveTemplate from './misc/InteractiveTemplate'
import CreditReportDialogMe from './qualifications/credit_report/CreditReportDialogMe'
import AdvisorUITemplate from './misc/AdvisorUITemplate'
import TweenOne from 'rc-tween-one'
import '../styles/pretty_scrollbar.css'
import { triggerDrawerNav } from '../actions/app/app_actions'


class AppRoot extends Component {

  clickedDrawerOption(path) {
    this.props.triggerDrawerNav(false)
    this.props.history.push(path)
  }

	render() {
    const sidebar = [
      <List.Item key={1} onClick={() => this.clickedDrawerOption('/')}>Profile</List.Item>,
      <List.Item key={2} onClick={() => this.clickedDrawerOption('/matches')}>Browse</List.Item>,
      <List.Item key={3} onClick={() => this.clickedDrawerOption('/')}>Favorites</List.Item>,
    ]
    if (this.props.authentication_loaded) {
      return (
        <LocaleProvider locale={enUS}>
          <Switch>

            <Route exact path='/' render={WelcomeScreen} />
            <Route exact path='/onboarding' render={OnboardingTenant} />
            <Route exact path='/login' render={HomePage} />
            <Route exact path='/logout' render={Logout} />

            <Route path='/app/*' component={AppRoutes} />

            <Drawer
              className="main-navigation"
              style={{ minHeight: document.documentElement.clientHeight }}
              enableDragHandle={false}
              sidebarStyle={{ zIndex: '99', width: '35vw', backgroundColor: 'white' }}
              contentStyle={{ color: '#A6A6A6', textAlign: 'center' }}
              overlayStyle={{ zIndex: '10' }}
              sidebar={sidebar}
              open={this.props.drawer_nav_open}
              onOpenChange={() => this.props.triggerDrawerNav(false)}
            >
              <Route exact path='/matches' render={SwipeList} />
              <Route exact path='/dialog/moveinprefs/me' render={MoveInPrefs} />
              <Route exact path='/dialog/credit_report/me' render={CreditReportDialogMe} />
              <Route exact path='/sandbox' render={AdvisorUITemplate} />
            </Drawer>
          </Switch>
        </LocaleProvider>
      )
    } else {
      return (
        <div style={comStyles().loadingContainer}>
          <TweenOne
            animation={{ scale: 0.9, yoyo: true, repeat: 1, duration: 900 }}
            style={{ transform: 'scale(1)' }}
          >
           <h1 style={comStyles().font_logo}>RentHero</h1>
         </TweenOne>
        </div>
      )
    }

	}
}

// defines the types of variables in this.props
AppRoot.propTypes = {
	history: PropTypes.object.isRequired,
  authentication_loaded: PropTypes.bool.isRequired,
  triggerDrawerNav: PropTypes.func.isRequired,
  drawer_nav_open: PropTypes.bool,
}

// for all optional props, define a default value
AppRoot.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AppRoot)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    authentication_loaded: redux.auth.authentication_loaded,
    drawer_nav_open: redux.app.drawer_nav_open,
	}
}

// Connect together the Redux store with this React component
const AppRootKernal =  withRouter(
	connect(mapReduxToProps, {
    triggerDrawerNav,
	})(RadiumHOC)
)

export default AppRootMechanics(AppRootKernal)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
		},
    bottom_nav_bar: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0px',
    },
    bottom_nav_button: {
      display: 'flex',
      flexDirection: 'column',
      width: '25vw',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingContainer: {
      fontFamily: 'Helvetica Neue',
      minHeight: '100vh',
      maxHeight: '100vh',
      minWidth: '100vw',
      maxWidth: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#56CCF2',  /* fallback for old browsers */
			background: '-webkit-linear-gradient(to right, #2F80ED, #56CCF2)',  /* Chrome 10-25, Safari 5.1-6 */
			background: 'linear-gradient(to right, #2F80ED, #56CCF2)', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    },
    font_logo: {
      fontSize: '3rem',
      color: 'white',
      fontWeight: 'bold',
      fontFamily: `'Carter One', cursive`,
    },
    error_message: {
      width: '100vw',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(269deg, #0bacbd, #1a76c1)',
    },
    error_message_padding: {
      padding: '20px',
      textAlign: 'center',
    },
    error_text: {
      color: 'white'
    },
    copy_input: {
      minWidth: '80vw',
      maxWidth: '80vw',
      margin: ''
    }
	}
}
