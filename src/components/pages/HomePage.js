// Compt for copying as a HomePage
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Button,
	Icon,
} from 'antd'
import SubtitlesMachine from '../modules/SubtitlesMachine'
import { GOOGLE_CLIENT_AUTH_CREDS } from '../../api/ENV_CREDS'
import { registerGoogleLoginWithCognito } from '../../api/aws/aws-cognito'
import { getStaffProfile } from '../../api/auth/auth_api'
import { authenticateStaff, saveStaffProfileToRedux } from '../../actions/auth/auth_actions'

class HomePage extends Component {

	constructor() {
    super()
    this.state = {
    }
  }

  componentWillMount() {
  }

  openUrl(url) {
    // const win = window.open(url, '_blank')
    // win.focus()
    window.open(url)
  }

	loginWithGoogle() {
    const self = this
    let profile = {}
    window.gapi.load('client:auth2', function() {
      console.log('LOADED')
      gapi.client.init(GOOGLE_CLIENT_AUTH_CREDS)
      .then(() => {
        console.log('PASSED INIT')
        gapi.auth2.getAuthInstance()
        .signIn({
          client_id: GOOGLE_CLIENT_AUTH_CREDS.clientId
        })
        .then((GoogleUser) => {
          console.log(GoogleUser)
          // GoogleUser.grantOfflineAccess()
          profile = {
            google_id: GoogleUser.getBasicProfile().getId(),
            name: GoogleUser.getBasicProfile().getName(),
            first_name: GoogleUser.getBasicProfile().getGivenName(),
            last_name: GoogleUser.getBasicProfile().getFamilyName(),
            pic: GoogleUser.getBasicProfile().getImageUrl(),
            email: GoogleUser.getBasicProfile().getEmail()
          }
          console.log(profile)
          const auth = GoogleUser.getAuthResponse(true)
          console.log(auth)
          return registerGoogleLoginWithCognito(auth.id_token)
          // return registerGoogleLoginWithCognito(auth.access_token)
        })
        .then(({ IdentityId }) => {
          console.log('LOGGED INTO GMAIL', IdentityId)
          return getStaffProfile(IdentityId, profile)
        })
        .then((data) => {
          console.log(data)
          self.props.authenticateStaff('something')
          self.props.saveStaffProfileToRedux(data.profile)
          if (data.new_entry) {
            self.props.history.push('/onboarding/checkstaff')
          } else {
            // self.props.history.push('/onboarding/checkstaff')
            self.props.history.push('/app/ads')
            setTimeout(() => {
              window.location.reload()
            }, 500)
          }
        })
        .catch((err) => {
          console.log(err)
        })
      })
    })
  }

	// <SubtitlesMachine
	// 	speed={0.5}
	// 	text='Your AI rental assistant. Qualify more renters than humanly possible.'
	// 	textStyles={{
	// 		fontSize: '1rem',
	// 		color: 'white',
	// 		textAlign: 'center',
	// 		fontStyle: 'italic',
	// 	}}
	// />

	render() {
		return (
			<div id='HomePage' style={comStyles().container}>
				<div style={comStyles().font_logo}>RentHero</div>
				<div style={comStyles().tagline}>

				</div>
				<Button onClick={() => this.loginWithGoogle()} type='ghost' style={{ width: '250px', color: 'white', border: '1px solid white' }}>
					Login with Gmail <Icon type='right' />
				</Button>
				<div style={{ width: '100%', height: '10px' }}></div>
				<Button onClick={() => this.props.history.push('/signup/beta/landlords')} type='ghost' style={{ width: '250px', color: 'white', border: '1px solid white' }}>
					Beta Signup <Icon type='right' />
				</Button>
			</div>
		)
	}
}

// defines the types of variables in this.props
HomePage.propTypes = {
	history: PropTypes.object.isRequired,
	authenticateStaff: PropTypes.func.isRequired,
	saveStaffProfileToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
HomePage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(HomePage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		authenticateStaff,
		saveStaffProfileToRedux,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#56CCF2',  /* fallback for old browsers */
			background: '-webkit-linear-gradient(to right, #2F80ED, #56CCF2)',  /* Chrome 10-25, Safari 5.1-6 */
			background: 'linear-gradient(to right, #2F80ED, #56CCF2)', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
		},
    font_logo: {
      fontSize: '3rem',
      color: 'white',
      // fontWeight: 'bold',
      fontFamily: `'Carter One', cursive`,
      margin: '0px 0px 20px 0px'
    },
    tagline: {
      fontSize: '1rem',
      color: 'white',
      margin: '0px 0px 100px 0px',
      width: '50%',
      textAlign: 'center',
      fontStyle: 'italic',
    },
    demo: {
      fontSize: '1rem',
      color: 'white',
      bottom: '20px',
      position: 'absolute',
      cursor: 'pointer',
    }
	}
}
