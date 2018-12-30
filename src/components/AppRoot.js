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
import '../styles/app.css'
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
import {
  Menu,
  Dropdown,
  Icon,
} from 'antd'
import enUS from 'antd-mobile/lib/locale-provider/en_US'
import AppRootMechanics from './AppRootMechanics'
import AppRoutes from './AppRoutes'
import HomePage from './pages/HomePage'
import Logout from './auth/Logout'
import WelcomeScreen from './home/WelcomeScreen'
import UserPreferences from './home/UserPreferences'
import NoteToTester from './home/NoteToTester'
import SwipeList from './swipe/SwipeList'
// import MoveInPrefs from './tenant/MoveInPrefs'
import InteractiveTemplate from './misc/InteractiveTemplate'
// import CreditReportDialogMe from './qualifications/credit_report/CreditReportDialogMe'
import FavoritesList from './swipe/FavoritesList'
import NoMoreListings from './swipe/NoMoreListings'
// import ContinueSession from './tenant/ContinueSession'
import AdvisorUITemplate from './misc/AdvisorUITemplate'
import AdvisorUI from './modules/AdvisorUI_v2/AdvisorUI'
import OnlyMapHunting from './hunting/OnlyMapHunting'
import NoResults from './modules/NoResults'
// import SearchPrefs from './tenant/SearchPrefs'
import CoverPage from './pages/CoverPage'
import RegisterPage from './pages/RegisterPage'
import LandingPage from './pages/LandingPage'
import Checklist from './tenant/Checklist'
import FinancialDialog from './dialogs/financial/FinancialDialog'
// import OnboardingDialog from './dialogs/onboarding/OnboardingDialog'
import CreditDialog from './dialogs/credit/CreditDialog'
import EditSearch from './edits/EditSearch'
import MoveInDialog from './dialogs/movein/MoveInDialog'
import TenantFavorites from './favorites/TenantFavorites'
import GroupDialog from './dialogs/group/GroupDialog'
import RoommatesDialog from './dialogs/roommates/RoommatesDialog'
import ChineseDialogOnboarding from './dialogs/onboarding/ChineseDialogOnboarding'
import InterestDialog from './dialogs/interest/InterestDialog'
import LoginPage from './login/LoginPage'
import LoginPasswordless from './auth/LoginPasswordless'
import Passwordless from './auth/Passwordless'
import TenantDuality from './pages/TenantDuality'
import AdsHome from './ad/AdsHome'
import EmailCodeSentTemplate from './modules/EmailCodeSentTemplate'

import TweenOne from 'rc-tween-one'
import '../styles/pretty_scrollbar.css'
import { triggerDrawerNav } from '../actions/app/app_actions'


class AppRoot extends Component {

  clickedDrawerOption(path) {
    this.props.triggerDrawerNav(false)
    this.props.history.push(path)
  }

  renderDrawer() {
    const sidebar = [
      <List.Item key={0} onClick={() => this.clickedDrawerOption('/matches')} style={{ backgroundColor: 'rgba(0,0,0,0)' }}><span style={{ color: 'black' }}>Browse</span></List.Item>,
      <List.Item key={9} onClick={() => this.clickedDrawerOption('/checklist')} style={{ backgroundColor: 'rgba(0,0,0,0)' }}><span style={{ color: 'black' }}>Checklist</span></List.Item>,
      <List.Item key={3} onClick={() => this.clickedDrawerOption('/favourites')} style={{ backgroundColor: 'rgba(0,0,0,0)' }}><span style={{ color: 'black' }}>Favorites</span></List.Item>,
      <List.Item key={5} onClick={() => this.clickedDrawerOption('/logout')} style={{ backgroundColor: 'rgba(0,0,0,0)' }}><span style={{ color: 'black' }}>Logout</span></List.Item>,
    ]
    return (
      <Drawer
        className="main-navigation"
        style={{ minHeight: document.documentElement.clientHeight }}
        enableDragHandle={false}
        sidebarStyle={{
          zIndex: '99',
          width: '40vw',
          minWidth: '250px',
          background: 'white',
          // background: '#00c6ff', /* fallback for old browsers */
          // background: '-webkit-linear-gradient(to right, #00c6ff, #0072ff)', /* Chrome 10-25, Safari 5.1-6 */
          // background: 'linear-gradient(to right, #00c6ff, #0072ff)' /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        }}
        contentStyle={{ color: '#A6A6A6', textAlign: 'center' }}
        overlayStyle={{ zIndex: '10', backgroundColor: 'rgba(0,0,0,0.5)' }}
        sidebar={sidebar}
        open={this.props.drawer_nav_open}
        onOpenChange={() => this.props.triggerDrawerNav(false)}
      >
        <Route exact path='/sandbox' render={EditSearch} />
        <Route exact path='/' render={LandingPage} />
        <Route exact path='/register' render={RegisterPage} />
        <Route exact path='/map' render={OnlyMapHunting} />

        <Route exact path='/checklist' render={Checklist} />

        <Route exact path='/matches' render={AdsHome} />
        <Route exact path='/matches/:ref_id' render={AdsHome} />
        {/*<Route exact path='/prefs' render={SearchPrefs} />*/}

        <Route exact path='/no_more' render={NoMoreListings} />
        <Route exact path='/cover' render={CoverPage} />
        {/*<Route exact path='/sample' render={AdvisorUI} />
        <Route exact path='/sino' render={ChineseDialogOnboarding} />*/}
        {/*<Route exact path='/onboarding' render={OnboardingDialog} />*/}
        <Route exact path='/dialog/movein' render={MoveInDialog} />
        <Route exact path='/dialog/group' render={GroupDialog} />
        {/*<Route exact path='/dialog/personal' render={RoommatesDialog} />*/}
        <Route exact path='/dialog/finance' render={FinancialDialog} />
        <Route exact path='/dialog/credit' render={CreditDialog} />
      </Drawer>
    )
  }

	render() {
    if (this.props.authentication_loaded) {
      return (
        <LocaleProvider locale={enUS}>
          <Switch>

            <Route exact path='/' render={TenantDuality} />
            {
              //<Route exact path='/login' render={HomePage} />
            }
            <Route exact path='/favorites' render={TenantFavorites} />
            <Route exact path='/intro' render={TenantDuality} />
            <Route exact path='/login' render={LoginPage} />

            <Route exact path='/passwordless' render={Passwordless} />
            <Route exact path='/register' render={RegisterPage} />

            <Route exact path='/logout' render={Logout} />
            <Route exact path='/noresults' render={NoResults} />
            {/*<Route exact path='/existing_session' render={ContinueSession} />*/}
            <Route exact path='/verifyingemail' render={EmailCodeSentTemplate} />

            <Route exact path='/p/:pid' render={InterestDialog} />

            <Route path='/app/*' component={AppRoutes} />

            {
              this.renderDrawer()
            }
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
