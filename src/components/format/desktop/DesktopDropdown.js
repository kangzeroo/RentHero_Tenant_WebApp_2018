// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Dropdown,
  Menu,
  Button,
  Icon,
  Divider,
} from 'antd'
import { toggleDropdown } from '../../../actions/app/app_actions'

class DesktopDropdown extends Component {

  toggleDropdown() {
    if (this.props.dropdown_open) {
      this.props.toggleDropdown(false)
    } else {
      this.props.toggleDropdown(true)
    }
  }

  renderMenu() {
    return (
      <Menu size='large' mode="vertical" style={{ width: 256 }}>
        <br />
        <Divider>Rentals</Divider>
        <Menu.Item style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
          <Button type='primary' size='large' icon='search' onClick={() => this.props.history.push('/matches')} style={{ borderRadius: '25px', width: '80%' }}>
            Browse
          </Button>
        </Menu.Item>
        <Divider>Account</Divider>
        <Menu.Item key={1} onClick={() => this.props.history.push('/app/profile')} style={{ padding: '10px' }}>
            <span>
              <Icon style={{ marginRight: '10px' }} type="user" size='large' />
              <span>Profile</span>
            </span>
        </Menu.Item>
        <Menu.Item key={3} onClick={() => this.props.history.push('/app/favourites')} style={{ padding: '10px' }}>
            <span>
              <Icon style={{ marginRight: '10px' }} type="heart" theme="twoTone" twoToneColor="#eb2f96" />
              <span>Favorites</span>
            </span>
        </Menu.Item>
        <Menu.Item key={9} onClick={() => this.props.history.push('/checklist')} style={{ padding: '10px' }}>
            <span>
              <Icon style={{ marginRight: '10px' }} type="file" />
              <span>Checklist</span>
            </span>
        </Menu.Item>
        <Divider />
        <Menu.Item>
          <Button type='danger' onClick={() => this.props.history.push('/logout')} icon='logout' style={{ width: '100%'}} >
            Log Out
          </Button>
        </Menu.Item>
      </Menu>

    )
  }

	render() {
		return (
			<div id='DesktopDropdown' style={comStyles().container}>
				<Dropdown overlay={this.renderMenu()} visible={this.props.dropdown_open} trigger={['click', 'hover']}>
          <i className='ion-navicon-round' style={{ fontSize: '1.3rem', color: 'white', cursor: 'pointer' }} onClick={() => this.toggleDropdown()}></i>
        </Dropdown>
			</div>
		)
	}
}

// defines the types of variables in this.props
DesktopDropdown.propTypes = {
	history: PropTypes.object.isRequired,
  toggleDropdown: PropTypes.func.isRequired,
  dropdown_open: PropTypes.bool.isRequired,
}

// for all optional props, define a default value
DesktopDropdown.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(DesktopDropdown)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    dropdown_open: redux.app.dropdown_open,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    toggleDropdown,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
		}
	}
}
