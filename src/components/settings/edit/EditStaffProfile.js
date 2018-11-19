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
import { updateStaffProfile } from '../../../api/staff/staff_api'
import { getStaffProfile } from '../../../api/google/google_api'
import { setStaffProfile } from '../../../actions/auth/auth_actions'

class EditStaffProfile extends Component {

  constructor() {
    super()
    this.state = {
      staff_id: '',
      staff_profile: {},

      first_name: '',
      last_name: '',
      email: '',
      phone: '',

      loading: true,
      saving: false,
    }
  }

  componentWillMount() {
    const staff_id_loc = this.props.location.pathname.indexOf('/app/settings/')
    const staff_id_loc_end = this.props.location.pathname.indexOf('/staff/edit')
    const staff_id = this.props.location.pathname.slice(staff_id_loc + 14, staff_id_loc_end)
    console.log(staff_id)

    this.setState({
      staff_id: staff_id,
    })

    if (this.props.loading_complete) {
      this.refreshStaff(staff_id)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.staff_profile !== nextProps.staff_profile) {
      this.refreshStaff(this.state.staff_id)
    }
  }

  refreshStaff(staff_id) {
    if (staff_id !== this.props.staff_profile.staff_id) {
      this.props.history.push('/invalid')
    } else {
      this.setState({
        staff_profile: this.props.staff_profile,
        first_name: this.props.staff_profile.first_name,
        last_name: this.props.staff_profile.last_name,
        email: this.props.staff_profile.email,
        phone: this.props.staff_profile.phone,
        loading: false,
      })
    }
  }

  determineIfChanged() {
    return this.props.staff_profile.first_name !== this.state.first_name ||
           this.props.staff_profile.last_name !== this.state.last_name ||
           this.props.staff_profile.email !== this.state.email ||
           this.props.staff_profile.phone !== this.state.phone
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

  updateStaff(state) {
    this.setState({
      saving: true,
    })
    if (this.verifyEmail()) {
      this.verifyPhone()
      .then(() => {
        updateStaffProfile({
          staff_id: this.props.staff_profile.staff_id,
          first_name: state.first_name,
          last_name: state.last_name,
          email: state.email,
          phone: this.state.phone,
          staff_title: this.props.staff_profile.staff_title,
        })
        .then((data) => {
          return getStaffProfile(this.props.staff_profile.staff_id)
        })
        .then((data) => {
          this.props.setStaffProfile(data.profile)
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
          validateStatus={this.state.first_name.length === 0 && !this.state.loading ? 'error' : ''}
          help={this.state.first_name.length === 0 && !this.state.loading ? 'Your first name must not be empty' : ''}
        >
          <p style={{ margin: 0, fontWeight: 'bold', }}>First Name</p>
          <Input
            id='first_name'
            value={this.state.first_name}
            onChange={e => this.setState({ first_name: e.target.value })}
            placeholder='First Name'
          />
        </Form.Item>
        <Form.Item
          validateStatus={this.state.last_name.length === 0 && !this.state.loading ? 'error' : ''}
          help={this.state.last_name.length === 0 && !this.state.loading ? 'Your last name must not be empty' : ''}
        >
          <p style={{ margin: 0, fontWeight: 'bold', }}>Last Name</p>
          <Input
            id='last_name'
            value={this.state.last_name}
            onChange={e => this.setState({ last_name: e.target.value })}
            placeholder='Last Name'
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
			<div id='EditStaffProfile' style={comStyles().container}>
        <Card id='DetailsContainer' style={comStyles().mainContainer} bordered={false}>
          {
            !this.state.loading && this.state.staff_profile && this.state.staff_profile.staff_id
            ?
            <div>
              <h2>{`${this.state.staff_profile.first_name} Details`}</h2>
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
                onClick={() => this.updateStaff(this.state)}
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
EditStaffProfile.propTypes = {
	history: PropTypes.object.isRequired,
  staff_profile: PropTypes.object.isRequired,
  corporation_profile: PropTypes.object.isRequired,
  loading_complete: PropTypes.bool.isRequired,
  setStaffProfile: PropTypes.func.isRequired,
}

// for all optional props, define a default value
EditStaffProfile.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(EditStaffProfile)

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
    setStaffProfile,
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
