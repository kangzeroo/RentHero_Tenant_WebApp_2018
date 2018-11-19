// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import {
  Button,
} from 'antd-mobile'
import TimePicker from 'material-ui/TimePicker'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Checkbox from 'material-ui/Checkbox';
import { updateLandlordOfficeHours, turnOnOfficeHours } from '../../../api/corporation/corporation_api'

class SelectOfficeHours extends Component {

  constructor() {
    super()
    this.state = {
      selected_start_time: '',
      selected_end_time: '',

      checked: false,

      saving: false,

      error_messages: [],
      submitted: false,
      success_message: '',
    }
  }

  componentWillMount() {
    // console.log(this.props.corpDetails)
    if (this.props.corpDetails && this.props.corpDetails.selected_start_time) {
      this.setState({
        selected_start_time: moment(this.props.corpDetails.office_hours_start, 'HHmm').toDate(),
        selected_end_time: moment(this.props.corpDetails.office_hours_end, 'HHmm').toDate(),
      })
    }
  }

  validateForm() {
    let ok_to_proceed = true
    const error_messages = []
    if (this.state.selected_start_time.length === 0) {
      ok_to_proceed = false
      error_messages.push('Please enter a start time')
    }
    if (this.state.selected_end_time.length === 0) {
      ok_to_proceed = false
      error_messages.push('Please enter an end time')
    }
    if (!this.state.checked) {
      ok_to_proceed = false
      error_messages.push('Please agree to the terms')
    }
    this.setState({
      error_messages: error_messages,
    })
    return ok_to_proceed
  }

  saveOfficeHours() {
    if (this.validateForm()) {
      this.setState({
        saving: true,
      })
      const time_begin = moment(this.state.selected_start_time).format('HHmm')
      const time_end = moment(this.state.selected_end_time).format('HHmm')
      // console.log(time_begin, time_end)
      updateLandlordOfficeHours({
        corporation_id: this.props.corporation_profile.corporation_id,
        office_hours_start: time_begin,
        office_hours_end: time_end,
      })
      .then((data) => {
        // console.log(data)
        this.setState({
          submitted: true,
          success_message: data.message,
          saving: false,
        })
        turnOnOfficeHours(this.props.corporation_profile.corporation_id)
        this.props.refreshCorp()
      })
      .catch((err) => {
        // console.log(err)
        this.setState({
          error_messages: [err.toString()],
          saving: false,
        })
      })
    }
  }

	render() {
		return (
			<div id='SelectOfficeHours' style={comStyles().container}>
        <p>Select a range of times where your agents will receive inquiries.</p>
        <p>All inquiries made outside the office hours will be sent to the general inbox, and appear on the Leads Page,
          and you can assign agents from this page.</p>
        <br />
        <MuiThemeProvider>
          <TimePicker
            hintText='Select Office Hours Begin'
            okLabel='Select Begin Time'
            minutesStep={5}
            value={this.state.selected_start_time ? moment(this.state.selected_start_time, 'HHmm').toDate() : null}
            fullWidth
            onChange={(e, d) => this.setState({ selected_start_time: d })}
          />
        </MuiThemeProvider>
        <MuiThemeProvider>
          <TimePicker
            hintText='Select Office Hours End'
            okLabel='Select End Time'
            minutesStep={5}
            value={this.state.selected_end_time ? moment(this.state.selected_end_time, 'HHmm').toDate() : null}
            fullWidth
            onChange={(e, d) => this.setState({ selected_end_time: d })}
          />
        </MuiThemeProvider>
        <br />
        <MuiThemeProvider>
          <Checkbox
            label='I understand that this will affect my response rates'
            checked={this.state.checked}
            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', }}
            onCheck={() => this.setState({ checked: !this.state.checked, })}
          />
        </MuiThemeProvider>
        <br />
        {
          this.state.submitted
          ?
          <div style={{ color: '#93F9B9' }}>{ this.state.success_message }</div>
          :
          <Button type='primary' onClick={() => this.saveOfficeHours()} loading={this.state.saving}>
            Save Office Hours
          </Button>
        }
        {
          this.state.error_messages.map((err) => {
            return (
              <div style={{ color: 'red' }}>{ err }</div>
            )
          })
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
SelectOfficeHours.propTypes = {
	history: PropTypes.object.isRequired,
  corporation_profile: PropTypes.object.isRequired,
  refreshCorp: PropTypes.func.isRequired,             // passed in
  corpDetails: PropTypes.object,          // passed in
}

// for all optional props, define a default value
SelectOfficeHours.defaultProps = {
  corpDetails: {},
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SelectOfficeHours)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    corporation_profile: redux.auth.corporation_profile,
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
      margin: '20px',
		}
	}
}
