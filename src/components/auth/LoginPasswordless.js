// Compt for copying as a LoginPasswordless
// This compt is used for...
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import { Auth0LockPasswordless } from 'auth0-lock'
import { PASSWORDLESS_LOGIN_REDIRECT, AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '../../api/ENV_CREDs'
import {

} from 'antd-mobile'


class LoginPasswordless extends Component {

  constructor() {
    super()
    this.state = {
      logintype: 'phone',
    }
    this.passwordlessOptions = {
      phone: {
        allowedConnections: ['sms'],
        passwordlessMethod: 'code',
        auth: {
          redirectUrl: PASSWORDLESS_LOGIN_REDIRECT,
          responseType: 'token id_token',
          params: {
            scope: 'openid sms'
          }
        }
      },
      email: {
        allowedConnections: ['email'],
        passwordlessMethod: 'code',
        auth: {
          redirectUrl: PASSWORDLESS_LOGIN_REDIRECT,
          responseType: 'token id_token',
          params: {
            scope: 'openid email'
          }
        }
      },
      theme: {
        logo: 'https://s3.amazonaws.com/rentburrow-static-assets/Logos/rentheroLogo.png',
        primaryColor: '#2faded',
        title: 'RentHero'
      }
    }
  }

  componentDidMount() {
    document.getElementById('passwordless-phone').addEventListener('click', () => {
      this.setState({
        logintype: 'phone'
      }, () => this.setupPasswordless())
    })
    document.getElementById('passwordless-email').addEventListener('click', () => {
      this.setState({
        logintype: 'email'
      }, () => this.setupPasswordless())
    })
  }

  setupPasswordless() {
    const lockPasswordless = new Auth0LockPasswordless(
     AUTH0_CLIENT_ID,
     AUTH0_DOMAIN,
     this.passwordlessOptions[this.state.logintype]
    )
    lockPasswordless.on('authenticated', function(authResult) {
      console.log('AUTHEED! PASSWORDLESS')
      // Use the token in authResult to getUserInfo() and save it to localStorage
      lockPasswordless.getUserInfo(authResult.accessToken, function(error, profile) {
        if (error) {
          // Handle error
          console.log(error)
          return;
        }
        console.log('AUTHEED! YESSS')
        console.log(profile)
        localStorage.setItem('Success', 'YEEE DAWGIE')
        localStorage.setItem('profile', JSON.stringify(profile))
        localStorage.setItem('renthero_tenant_token', JSON.stringify({ type: 'passwordless', accessToken: authResult.accessToken }))
      })
    })
    lockPasswordless.show()
  }

	render() {
		return (
			<div id='LoginPasswordless' style={comStyles().container}>
				<button id='passwordless-phone'>Login with Phone</button>
				<button id='passwordless-email'>Login with Magic Email</button>
			</div>
		)
	}
}

// defines the types of variables in this.props
LoginPasswordless.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
LoginPasswordless.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(LoginPasswordless)

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
