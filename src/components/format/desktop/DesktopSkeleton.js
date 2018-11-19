// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Menu,
  Icon,
  Badge,
} from 'antd'
import DesktopHeader from './DesktopHeader'

class DesktopSkeleton extends Component {

  constructor() {
    super()
    this.state = {
      currentTabs: [],

      menu_hidden: false,
    }
  }

  componentWillMount() {
    if (this.props.selected_tab) {
      this.setState({
        currentTabs: ['.$'.concat(this.props.selected_tab)]
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selected_tab !== nextProps.selected_tab) {
      this.setState({
        currentTabs: ['.$'.concat(this.props.selected_tab)]
      })
    }
  }

  filterUniqueContacts() {
    const unique_contacts = []
    this.props.leads.forEach((lead) => {
      let exists = false
      unique_contacts.forEach((contact) => {
        if (contact.tenant_id === lead.tenant_id) {
          exists = true
        }
      })
      if (!exists) {
        unique_contacts.push(lead)
      }
    })

    return unique_contacts.length
  }

  renderCounts(sub) {
    const keys = sub.key.split('/')
    if (keys[0] === 'people') {
      if (keys[1] === 'leads') {
        return this.props.leads.length
      } else if (keys[1] === 'contacts') {
        return this.filterUniqueContacts()
      } else {
        return 0
      }
    } else {
      return 0
    }
  }

  renderMenu() {
    return (
      <Menu
        mode='inline'
        style={comStyles().menuContainer}
        onClick={e => this.props.history.push(`/app/${e.key.substr(2)}`)}
        selectedKeys={this.state.currentTabs}
        onSelect={(a) => this.setState({ currentTabs: [a.key], })}
      >
        {
          this.props.navs.map((nav) => {
            if (nav.submenu && nav.submenu.length > 0) {
              return (
                <Menu.SubMenu
                  key={nav.key}
                  title={<span>{nav.icon}<span>{nav.title}</span></span>}
                  onTitleClick={(a) => this.props.history.push(`/app/${a.key.substr(2)}`)}
                >
                  {
                    nav.submenu.map((sub) => {
                      return (
                        <Menu.Item key={sub.key}>
                          {/*<Badge count={this.renderCounts(sub)} offset={[0, 15]}>*/}
                            <span>{sub.icon}<span>{sub.title}</span></span>
                        </Menu.Item>
                      )
                    })
                  }
                </Menu.SubMenu>
              )
            } else {
              return (
                <Menu.Item key={nav.key}>
                  <span>{nav.icon}<span>{nav.title}</span></span>
                </Menu.Item>
              )
            }
          })
        }
      </Menu>
    )
  }

	render() {
		return (
			<div id='DesktopSkeleton' style={comStyles().container}>
				<DesktopHeader />
        <div style={comStyles().mainContainer} >
          {
            // this.props.side_menu_open
            // ?
            this.renderMenu()
            // :
            // null
          }
          <div style={comStyles(!this.props.side_menu_open).contentContainer}>
            {
              this.props.routes
            }
          </div>
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
DesktopSkeleton.propTypes = {
	history: PropTypes.object.isRequired,
  corporation_profile: PropTypes.object.isRequired,
  navs: PropTypes.array.isRequired,       // passed in
  routes: PropTypes.object.isRequired,     // passed in
  // side_menu_open: PropTypes.bool.isRequired,
  selected_tab: PropTypes.string.isRequired,
  // leads: PropTypes.array.isRequired,
}

// for all optional props, define a default value
DesktopSkeleton.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(DesktopSkeleton)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    // leads: redux.leads.leads,
    corporation_profile: redux.auth.corporation_profile,
    // side_menu_open: redux.app.side_menu_open,
    selected_tab: redux.app.selected_tab,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {

	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = (menu_hidden) => {
  let attrs
  if (menu_hidden) {
    attrs = {
      minWidth: '100%',
      maxWidth: '100%',
    }
  } else {
    attrs = {
      minWidth: '80%',
      maxWidth: '20%',
    }
  }
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
		},
    mainContainer: {
      display: 'flex',
      flexDirection: 'row',
      minHeight: '93vh',
      maxHeight: '93vh',
      minWidth: '100vw',
      maxWidth: '100vw',
    },
    menuContainer: {
      minWidth: '20%',
      maxWidth: '20%',
    },
    contentContainer: {
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '93vh',
      minWidth: '80%',
      maxWidth: '20%',
      // overflowY: 'scroll',
      // ...attrs,
    }
	}
}
