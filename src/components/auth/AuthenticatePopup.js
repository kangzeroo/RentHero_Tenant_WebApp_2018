// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Card,
  Icon,
  Divider,
  Input,
  Button,
  message,
} from 'antd'
import { validateEmail } from '../../api/general/general_api'
import { verifyPhone } from '../../api/phone/phone_api'
import { PASSWORDLESS_LOGIN_REDIRECT, AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '../../api/ENV_CREDs'
import auth0 from 'auth0-js'

class AuthenticatePopup extends Component {

  constructor() {
    super()
    this.state = {
      phone: '',
      email: '',

      error_message: '',

      option: '',
      verifying: false,

      verify_screen: false,

      code: '',
    }
  }

  componentWillMount() {
    if (this.props.current_listing && this.props.current_listing.REFERENCE_ID) {
      localStorage.removeItem('auth_listing_id')
      localStorage.setItem('auth_listing_id', this.props.current_listing.REFERENCE_ID)
      localStorage.setItem('auth_action', 'favorite')
    }
  }

  onClose() {
    history.pushState(null, null, `${this.props.location.pathname}/${this.props.current_listing.REFERENCE_ID}`)
    this.props.onClose()
  }

  sendVerificationCode() {
    this.setState({
      verifying: true,
      error_message: '',
    })
    if (this.state.phone.length > 0) {
      verifyPhone(this.state.phone)
        .then((data) => {
          console.log(data)
          this.setState({
            phone: data.phoneNumber,
            option: 'phone',
          })
          localStorage.setItem('phone', JSON.stringify(data))
          return this.startRegister('phone', data.phoneNumber)
        })
        .then((data) => {
          this.setState({
            verifying: false,
            verify_screen: true,
          })
        })
        .catch((err) => {
          message.error('Invalid Phone Number!')
          console.log(err)
          this.setState({
            error_message: 'Invalid Phone Number!',
            verifying: false,
          })
        })
    } else {
      if (validateEmail(this.state.email)) {
        localStorage.setItem('email', data.input_string)
        return this.startRegister('email', this.state.email)
                .then((data) => {
                  this.setState({
                    verifying: false,
                    verify_screen: true,
                    option: 'email',
                  })
                })
                .catch((err) => {
                  console.log(err)
                })
      } else {
        message.error('Invalid Email Address!')
        this.setState({
          error_message: 'Invalid Email Address!',
          verifying: false,
        })
      }

    }
  }

  startRegister(option, address) {
    const p = new Promise((res, rej) => {
      const self = this
      const webAuth = new auth0.WebAuth({
         domain:       AUTH0_DOMAIN,
         clientID:     AUTH0_CLIENT_ID,
         responseType: 'token id_token'
      })

      if (option === 'phone') {

          webAuth.passwordlessStart({
            connection: 'sms',
            send: 'code',
            phoneNumber: address,
          }, function (err,results) {
            if (err) {
              console.log(err)
              rej(err)
            }
            console.log(results)
            res(results)
          })

      } else {
        // Send a link using email
         webAuth.passwordlessStart({
             connection: 'email',
             send: 'code',
             email: email,
           }, function (err,results) {
             if (err) {
               console.log(err)
               rej(err)
             }

             console.log(results)
             res(results)
             // self.props.history.push('/verifyingemail')
             // self.done(original_id, endpoint, data)
           }
         )
      }
    })
    return p
  }

  verifyCode(code) {
    // this.done(original_id, endpoint, data)
    const webAuth = new auth0.WebAuth({
       domain:       AUTH0_DOMAIN,
       clientID:     AUTH0_CLIENT_ID,
       responseType: 'token id_token',
       redirectUri: PASSWORDLESS_LOGIN_REDIRECT
    })
    let self = this

    this.setState({
      verifying: true,
      error_message: '',
    })
    if (this.state.option === 'phone') {
      webAuth.passwordlessLogin({
        connection: 'sms',
        phoneNumber: self.state.phone,
        verificationCode: code
      }, function (err,res) {
        if (err) {
          console.log(err)
          message.error(err.description)
          self.setState({
            error_message: err.description,
            verifying: false,
          })
        }
        console.log(res)
      })
    } else {
      webAuth.passwordlessLogin({
        connection: 'email',
        phoneNumber: self.state.email,
        verificationCode: code
      }, function (err,res) {
        if (err) {
          console.log(err)
          message.error(err.description)
          self.setState({
            error_message: err.description,
            verifying: false,
          })
        }
        console.log(res)
      })
    }


  }

  renderHeader() {
    return (
      <Card style={{ width: '100%', position: 'absolute', top: 0, left: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
        <div />
        <Icon
          type="close"
          size='large'
          style={{
            cursor: 'pointer'
          }}
          onClick={() => this.onClose()}
        />
      </Card>
    )
  }

  renderInputs() {
    if (!this.state.verify_screen) {
      return (
        <div style={comStyles().inputContainer}>
          <h2>Save to list</h2>
          <p>Save this listing using your phone number or email</p>
          <Divider />
          <p style={{ fontWeight: 'bold', color: 'black' }}>Phone Number</p>
          <Input
            placeholder='Phone Number'
            value={this.state.phone}
            onChange={e => this.setState({ phone: e.target.value })}
            size='large'
            disabled={this.state.email.length > 0}
            onPressEnter={this.state.phone.length > 0 ? () => this.sendVerificationCode() : () => {}}
          />
          <br /><br />
          <Divider>or</Divider>
          <p style={{ fontWeight: 'bold', color: 'black' }}>Email Address</p>
          <Input
            placeholder='Email Address'
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value, })}
            size='large'
            disabled={this.state.phone.length > 0}
            onPressEnter={this.state.email.length > 0 ? () => this.sendVerificationCode() : () => {}}
          />
          <br /><br />
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ color: '#2faded', fontSize: '1.2rem'}} onClick={() => this.setState({ email: '', phone: '', error_message: '', })}>Clear</div>
            <Button type='primary' size='large' onClick={() => this.sendVerificationCode()}
                    disabled={this.state.phone.length === 0 && this.state.email.length === 0}
                    loading={this.state.verifying} icon='lock'
                    style={{ borderRadius: '25px' }}
            >Send Login Code</Button>
          </div>
          <br />
          {
            this.state.error_message && this.state.error_message.length > 0
            ?
            <div style={{ color: 'red' }}>{`* ${this.state.error_message}`}</div>
            :
            null
          }
        </div>
      )
    } else {
      return (
        <div style={comStyles().inputContainer}>
          <h2>My Code is</h2>
          <p>You should have received an {this.state.phone.length > 0 ? 'SMS' : 'Email'} with your verification code.</p>
          <Divider />
          <p style={{ fontWeight: 'bold', color: 'black' }}>Verification code</p>
          <Input
            placeholder='Your Verification Code'
            type='number'
            value={this.state.code}
            onChange={e => this.setState({ code: e.target.value })}
            size='large'
            onPressEnter={this.state.code.length > 0 ? () => this.verifyCode(this.state.code) : () => {}}
          />
          <br /><br />
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ color: '#2faded', fontSize: '1.2rem'}} onClick={() => this.setState({ email: '', phone: '', error_message: '', })}>Clear</div>
            <Button type='primary' size='large' onClick={() => this.verifyCode(this.state.code)}
                    disabled={this.state.code.length === 0 || this.state.verifying}
                    loading={this.state.verifying} icon='lock'
                    style={{ borderRadius: '25px' }}
            >Verify Code</Button>
          </div>
          <br />
          {
            this.state.error_message && this.state.error_message.length > 0
            ?
            <div style={{ color: 'red' }}>{`* ${this.state.error_message}`}</div>
            :
            null
          }
        </div>
      )
    }

  }

	render() {
		return (
			<div id='AuthenticatePopup' style={comStyles().container}>
        <div style={{ height: '60px' }} />
        {
          this.renderInputs()
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
AuthenticatePopup.propTypes = {
	history: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,       // passed in
  current_listing: PropTypes.object,        // passed in
}

// for all optional props, define a default value
AuthenticatePopup.defaultProps = {
  current_listing: {},
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AuthenticatePopup)

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
      padding: '20px',
      alignItems: 'flex-start',
      height: '96vh',
		},
    inputContainer: {
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      alignItems: 'flex-start',
      width: '100%',
		}
	}
}
