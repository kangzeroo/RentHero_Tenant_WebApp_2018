// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  TabBar,
  NavBar,
} from 'antd-mobile'
import { changeSelectedTab } from '../../../actions/app/app_actions'
import DesktopHeader from '../desktop/DesktopHeader'

class MobileSkeleton extends Component {

  goToRoute(key, path) {
    this.props.changeSelectedTab(key)
    this.props.history.push(path)
  }

	render() {
		return (
      <TabBar
        id='MobileSkeleton'
        unselectedTintColor='#949494'
        tintColor='#33A3F4'
        barTintColor='white'
      >
        {
          this.props.navs.map((nav) => {
            return (
              <TabBar.Item
                id='MainContainer'
                icon={nav.icon}
                style={comStyles().hideOverflow}
                selectedIcon={nav.selectedIcon}
                title={nav.title}
                key={nav.key}
                selected={this.props.selected_tab === nav.key}
                onPress={() => this.goToRoute(nav.key, nav.path)}
              >
                <DesktopHeader />
                { this.props.routes }
              </TabBar.Item>
            )
          })
        }
      </TabBar>
		)
	}
}

// defines the types of variables in this.props
MobileSkeleton.propTypes = {
	history: PropTypes.object.isRequired,
  authenticated: PropTypes.bool,
  // bottomnav_open: PropTypes.bool,
  // authentication_loaded: PropTypes.bool,
  changeSelectedTab: PropTypes.func.isRequired,
  selected_tab: PropTypes.string.isRequired,
  navs: PropTypes.array.isRequired,             // passed in
  routes: PropTypes.object.isRequired,          // passed in
}

// for all optional props, define a default value
MobileSkeleton.defaultProps = {
  authenticated: false,
  // bottomnav_open: false,
  // authentication_loaded: false,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MobileSkeleton)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    // bottomnav_open: redux.app.bottomnav_open,
    selected_tab: redux.app.selected_tab,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    changeSelectedTab,
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
    font_logo: {
      fontSize: '1.5rem',
      color: 'rgba(81, 151, 214, 1)',
      fontWeight: 'bold',
      fontFamily: `'Carter One', cursive`,
    },
    hideOverflow: {
      // overflowY: 'scroll'
    },
	}
}
