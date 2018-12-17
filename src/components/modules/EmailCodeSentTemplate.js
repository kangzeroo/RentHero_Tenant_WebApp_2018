// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Icon,
} from 'antd'


class EmailCodeSentTemplate extends Component {

  constructor() {
    super()
    this.state = {
      email: '',
    }
  }

  componentWillMount() {
    if (this.props.tenant_profile && this.props.tenant_profile.email) {
      this.setState({
        email: this.props.tenant_profile.email
      })
    } else {
      const email = localStorage.getItem('email')
      if (email) {
        this.setState({
          email: email,
        })
      } else {
        this.props.history.push('/')
      }
    }
  }

	render() {
		return (
			<div id='EmailCodeSentTemplate' style={comStyles().container}>
				<h1>Check your Email!</h1>
        <Icon type="mail" theme="twoTone" style={{ fontSize: '5rem' }} />
        <br /><br />
        <div>An email with a magic link has been sent to <span style={{ fontWeight: 'bold' }}>{this.state.email}</span>. Please check your email in a moment.</div>
        <br /><br /><br />
        <h2>{`Didn't recieve a link?`}</h2>
        <br />
        <div style={{ fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => this.props.history.push('/register')}>
          USE A DIFFERENT EMAIL OR PHONE NUMBER
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
EmailCodeSentTemplate.propTypes = {
	history: PropTypes.object.isRequired,
  tenant_profile: PropTypes.object.isRequired,
}

// for all optional props, define a default value
EmailCodeSentTemplate.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(EmailCodeSentTemplate)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    tenant_profile: redux.auth.tenant_profile,
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
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100%',
      margin: '20px',
      padding: '10px',
		}
	}
}
