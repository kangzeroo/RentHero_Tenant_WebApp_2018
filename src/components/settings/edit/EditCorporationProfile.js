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
  Form,
  Input,
  message,
  Button,
} from 'antd'
import { phoneLookup } from '../../../api/comms/comms_api'
import { validateEmail } from '../../../api/general/general_api'
import { saveCorporationProfile } from '../../../actions/auth/auth_actions'
import { getCorpInfo, updateCorporationProfile } from '../../../api/corporation/corporation_api'

class EditCorporationProfile extends Component {

  constructor() {
    super()
    this.state = {
      corporation_id: '',
      corporation_profile: {},

      corporation_name: '',
      email: '',
      phone: '',
      website: '',

      loading: true,
      saving: false,
    }
  }

  componentWillMount() {
    const corporation_id_loc = this.props.location.pathname.indexOf('/app/settings/')
    const corporation_id_loc_end = this.props.location.pathname.indexOf('/corp/edit')
    const corporation_id = this.props.location.pathname.slice(corporation_id_loc + 14, corporation_id_loc_end)
    console.log(corporation_id)

    this.setState({
      corporation_id: corporation_id,
    })

    if (this.props.loading_complete) {
      this.refreshCorporation(corporation_id)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.corporation_profile !== nextProps.corporation_profile) {
      this.refreshCorporation(this.state.corporation_id)
    }
  }

  refreshCorporation(corporation_id) {
    if (corporation_id !== this.props.corporation_profile.corporation_id) {
      this.props.history.push('/invalid')
    } else {
      this.setState({
        corporation_profile: this.props.corporation_profile,
        corporation_name: this.props.corporation_profile.corporation_name,
        email: this.props.corporation_profile.email,
        phone: this.props.corporation_profile.phone,
        website: this.props.corporation_profile.website,
        loading: false,
      })
    }
  }

  determineIfChanged() {
    return this.props.corporation_profile.corporation_name !== this.state.corporation_name ||
           this.props.corporation_profile.website !== this.state.website ||
           this.props.corporation_profile.email !== this.state.email ||
           this.props.corporation_profile.phone !== this.state.phone
  }

  verifyEmail() {
    let email_verified = true
    if (!validateEmail(this.state.email)) {
      email_verified = false
      this.setState({
        saving: false,
      })
    }

    return email_verified
  }

  verifyPhone() {
    const p = new Promise((res, rej) => {
      let phone_verified = true
      let email_verified = true

      phoneLookup(this.state.phone)
      .then((data) => {
        console.log(data)
        this.setState({
          phone: data.verifiedNumber,
        })
        res(true)
      })
      .catch((err) => {
        phone_verified = false
        this.setState({
          saving: false,
        })
        message.error(err.response.data)
        rej()
      })
    })
    return p
  }


  updateCorporation(state) {
    this.setState({
      saving: true,
    })
    if (this.verifyEmail()) {
      this.verifyPhone()
      .then(() => {
        updateCorporationProfile({
          corporation_id: this.props.corporation_profile.corporation_id,
          corporation_name: state.corporation_name,
          website: state.website,
          email: state.email,
          phone: this.state.phone,
        })
        .then((data) => {
          return getCorpInfo(this.props.corporation_profile.corporation_id)
        })
        .then((data) => {
          console.log(data)
          this.props.saveCorporationProfile(data)
          this.setState({
            saving: false,
          })
          this.props.history.push('/app/settings')
        })
        .catch((err) => {
          console.log(err)
          message.error(err.response.data)
        })
      })
    } else {
      message.error('Invalid Email Address')
    }
  }

  renderEditForm() {
    return (
      <Form layout='vertical'>
        <Form.Item
          validateStatus={this.state.corporation_name.length === 0 && !this.state.loading ? 'error' : ''}
          help={this.state.corporation_name.length === 0 && !this.state.loading ? 'Your first name must not be empty' : ''}
        >
          <p style={{ margin: 0, fontWeight: 'bold', }}>Company Name</p>
          <Input
            id='corporation_name'
            value={this.state.corporation_name}
            onChange={e => this.setState({ corporation_name: e.target.value })}
            placeholder='Company Name'
          />
        </Form.Item>
        <Form.Item>
          <p style={{ margin: 0, fontWeight: 'bold', }}>Website</p>
          <Input
            id='website'
            value={this.state.website}
            onChange={e => this.setState({ website: e.target.value })}
            placeholder='Website'
          />
        </Form.Item>
        <Form.Item
          validateStatus={this.state.email.length === 0 && !this.state.loading ? 'error' : ''}
          help={this.state.email.length === 0 && !this.state.loading ? 'Your email must not be empty' : ''}
        >
          <p style={{ margin: 0, fontWeight: 'bold', }}>Email Address</p>
          <Input
            id='email'
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
            placeholder='Email Address'
          />
        </Form.Item>
        <Form.Item
          validateStatus={this.state.phone.length === 0 && !this.state.loading ? 'error' : ''}
          help={this.state.phone.length === 0 && !this.state.loading ? 'Your phone number must not be empty' : ''}
        >
          <p style={{ margin: 0, fontWeight: 'bold', }}>Phone Number</p>
          <Input
            id='phone'
            value={this.state.phone}
            onChange={e => this.setState({ phone: e.target.value })}
            placeholder='Phone Number'
          />
        </Form.Item>
      </Form>
    )
  }

	render() {
		return (
			<div id='EditCorporationProfile' style={comStyles().container}>
      <Card id='DetailsContainer' style={comStyles().mainContainer} bordered={false}>
        {
          !this.state.loading && this.state.corporation_profile && this.state.corporation_profile.corporation_id
          ?
          <div>
            <h2>{`${this.state.corporation_profile.corporation_name} Details`}</h2>
            <div style={comStyles().backText} onClick={() => this.props.history.push(`/app/settings`)}>
              <Icon type='left' />
              <p style={{ paddingLeft: '10px', marginBottom: 0, }}>{`Back to Settings`}</p>
            </div>
          </div>
          :
          <Card loading />
        }
        <br />
        {
          this.renderEditForm()
        }
      </Card>
      {
        this.determineIfChanged() && !this.state.loading
        ?
        <Card style={comStyles().bottomContainer}>
          <div style={comStyles().rowContainer}>
            <Button
              type='primary'
              style={comStyles().saveButton}
              loading={this.state.saving}
              disabled={this.state.saving}
              onClick={() => this.updateCorporation(this.state)}
            >
              SAVE
            </Button>
            <Button
              type='default'
              style={comStyles().cancelButton}
              onClick={() => this.props.history.push(`/app/settings`)}
            >
              CANCEL
            </Button>
          </div>
        </Card>
        :
        null
      }
			</div>
		)
	}
}

// defines the types of variables in this.props
EditCorporationProfile.propTypes = {
	history: PropTypes.object.isRequired,
  staff_profile: PropTypes.object.isRequired,
  corporation_profile: PropTypes.object.isRequired,
  loading_complete: PropTypes.bool.isRequired,
  saveCorporationProfile: PropTypes.func.isRequired,
}

// for all optional props, define a default value
EditCorporationProfile.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(EditCorporationProfile)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    staff_profile: redux.auth.staff_profile,
    corporation_profile: redux.auth.corporation_profile,
    loading_complete: redux.app.loading_complete,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    saveCorporationProfile,
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
    backText: {
      height: '50px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      cursor: 'pointer',
      color: '#2faded',
    },
    bottomContainer: {
      position: 'absolute',
      bottom: '0',
      width: '100%',
      zIndex: 9999,
      background: '#6dd5ed',
      background: '-webkit-linear-gradient(to right, #fff, #6dd5ed)',
      background: 'linear-gradient(to right, #fff, #6dd5ed)'
    },
    rowContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    cancelButton: {
      padding: '0px 30px',
      marginLeft: '10px',
      backgroundColor: 'white',
    },
    saveButton: {
      padding: '0px 30px',
      marginLeft: '10px',
    }
	}
}
