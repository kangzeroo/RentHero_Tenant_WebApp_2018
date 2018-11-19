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
} from 'antd'


class DesktopDropdown extends Component {

  renderMenu() {
    return (
      <Menu>
        <Menu.Item>
          <Button type='danger' onClick={() => this.props.history.push('/logout')} icon='logout'>
            Log Out
          </Button>
        </Menu.Item>
      </Menu>
    )
  }

	render() {
		return (
			<div id='DesktopDropdown' style={comStyles().container}>
				<Dropdown overlay={this.renderMenu()}>
          <Icon
            type='menu-fold'
            style={{ color: 'white', fontSize: '1.5rem' }}
          />
        </Dropdown>
			</div>
		)
	}
}

// defines the types of variables in this.props
DesktopDropdown.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
DesktopDropdown.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(DesktopDropdown)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {

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
