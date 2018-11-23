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
import AppRootMechanics from './AppRootMechanics'
import AppRoutes from './AppRoutes'
import HomePage from './pages/HomePage'
import Logout from './auth/Logout'
import WelcomeScreen from './home/WelcomeScreen'
import UserPreferences from './home/UserPreferences'
import NoteToTester from './home/NoteToTester'
import SwipeList from './swipe/SwipeList'
import OnboardingTenant from './tenant/OnboardingTenant'
import InteractiveTemplate from './misc/InteractiveTemplate'
import TweenOne from 'rc-tween-one'
import '../styles/pretty_scrollbar.css'



class AppRoot extends Component {

	render() {
    if (this.props.authentication_loaded) {
      return (
        <Switch>
          <Route exact path='/' render={WelcomeScreen} />
          <Route exact path='/preferences' render={OnboardingTenant} />
          <Route exact path='/login' render={HomePage} />
          <Route exact path='/logout' render={Logout} />

          <Route path='/app/*' component={AppRoutes} />

          <Route exact path='/notes' render={NoteToTester} />
          <Route exact path='/matches' render={SwipeList} />
          <Route exact path='/sandbox' render={OnboardingTenant} />

        </Switch>
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
	}
}

// Connect together the Redux store with this React component
const AppRootKernal =  withRouter(
	connect(mapReduxToProps, {
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
