// Compt for copying as a VerifyCodeSegment
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import SubtitlesMachine from './SubtitlesMachine'
import { isMobile } from '../../../../api/general/general_api'
import { Tooltip } from 'antd'
import {
  Toast,
  Icon,
} from 'antd-mobile'
import { ACCENT_COLOR, FONT_COLOR, INPUT_BACKGROUND, INPUT_PLACEHOLDER_COLOR, FONT_FAMILY } from '../styles/advisor_ui_styles'



/*
  <VerifyCodeSegment
    title='Input Segment'
    schema={{ id: '1', endpoint: '2' }}
    texts={[
      { id: '1-1', text: 'Some string to display' },
      { id: '1-2', text: 'The next string to display!' }
    ]}
    onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
    triggerScrollDown={() => this.triggerScrollDown()}
    segmentStyles={{ padding: '30px 0px 0px 0px' }}
    skippable={false}
    skipEndpoint=''
    inputType={'text', 'textarea', 'number', 'tel', 'email', 'url'}
    stringInputPlaceholder={'Type something'}
    numberInputPlaceholder={0}
  />
*/



class VerifyCodeSegment extends Component {

  constructor() {
    super()
    this.state = {
      completedSections: [],
			instantChars: true,
      data: {
        input_string: '',
      },
      clicked_resend: false,
    }
    this.mobile = false
  }

  componentWillMount() {
    if (this.props.initialData) {
      this.setState({
        data: {
          ...this.state.data,
          ...this.props.initialData
        }
      })
    }
    if (this.props.instant_chars_segment_id === this.props.schema.id) {
      this.setState({
        instantChars: true
      })
    }
  }

  componentDidMount() {
    this.mobile = isMobile()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.initialData !== this.props.initialData) {
      this.setState({
        data: {
          ...this.state.data,
          ...this.props.initialData
        }
      })
    }
    if (prevProps.instant_chars_segment_id !== this.props.instant_chars_segment_id) {
      if (this.props.instant_chars_segment_id === this.props.schema.id) {
        this.setState({
          instantChars: true
        })
      }
    }
  }

  shouldDisplayText(text, txtIndex) {
    if (txtIndex === 0) {
      return true
    } else {
      return this.state.completedSections.filter((id) => {
        return this.props.texts[txtIndex - 1].id === id
      }).length > 0
    }
  }

  shouldInstantChars(txtIndex) {
    if (txtIndex === 0) {
      return false
    } else {
      let allOtherTextsLoadedCount = 0
      this.props.texts.forEach((text) => {
        this.state.completedSections.forEach((sec) => {
          if (text.id === sec.id) {
            allOtherTextsLoadedCount += 1
          }
        })
      })
      return allOtherTextsLoadedCount === this.props.texts.length
    }
  }

  shouldDisplayInput() {
    if (this.state.instantChars) {
      return true
    } else {
      let allOtherTextsLoadedCount = 0
      this.props.texts.forEach((text) => {
        this.state.completedSections.forEach((id) => {
          if (text.id === id) {
            allOtherTextsLoadedCount += 1
          }
        })
      })
      return allOtherTextsLoadedCount === this.props.texts.length
    }
  }

  nextSegment(e, endpoint = this.props.schema.endpoint) {
    if (e) {
      e.stopPropagation()
    }
    if (this.state.data.input_string.length < this.props.minChars) {
      Toast.info(`Minimum ${this.props.minChars} characters. ${this.props.minChars - this.state.data.input_string.length} left to go.`, 2)
    } else if (this.props.inputType === 'tel') {
      if (this.state.data.input_string.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/igm)) {
        this.props.onDone(this.props.schema.id, endpoint, this.state.data)
      } else {
        Toast.info(`Enter a valid phone number`, 1)
      }
    } else if (this.props.inputType === 'email') {
      if (this.state.data.input_string.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/igm)) {
        this.props.onDone(this.props.schema.id, endpoint, this.state.data)
      } else {
        Toast.info(`Enter a valid email address`, 1)
      }
    } else if (this.props.inputType === 'url') {
      if (this.state.data.input_string.toLowerCase().indexOf('http') > -1 || this.state.data.input_string.toLowerCase().indexOf('www') > -1 || this.state.data.input_string.toLowerCase().indexOf('.') > -1) {
        this.props.onDone(this.props.schema.id, endpoint, this.state.data)
      } else {
        Toast.info(`Enter a valid URL`, 1)
      }
    } else {
      this.props.onDone(this.props.schema.id, endpoint, this.state.data)
    }
  }

  focusedInput(id) {
    if (this.mobile) {
      document.getElementById(id).scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  renderCustomComponent(text) {
    if (this.state.completedSections.filter((id) => {
      return id === text.id
    }).length === 0) {
      this.setState({ completedSections: this.state.completedSections.concat([text.id]) })
    }
    return (text.component)
  }

  renderInputCode() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontSize: '1.1rem',
            color: FONT_COLOR,
            textAlign: 'left',
            // fontFamily: FONT_FAMILY,
            fontWeight: 'bold',
            width: '100%',
           //           backgroundColor: 'rgba(0,0,0,0)',
           margin: '20px 0px 20px 0px',
          }}
        >My Code is</div>
        <input
          id={`input_field--${this.props.schema.id}`}
          type={'number'}
          value={this.state.data.input_string}
          onChange={(e) => {
            this.setState({ data: { ...this.state.data, input_string: e.target.value } })
          }}
          onFocus={() => this.focusedInput(`input_field--${this.props.schema.id}`)}
          placeholder={'Your received code'}
          style={comStyles().text}
        ></input>
        <br />
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{ fontSize: '0.8REM'}}>{`Didn't receive a code?`}</div>
          <div style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer'}} onClick={this.state.clicked_resend ? () => {} : () => this.setState({ clicked_resend: true, }, () => this.props.resendCode())}>RESEND CODE</div>
        </div>
        <br /><br /><br />
        <p style={{ fontSize: '0.8REM'}}>A verification code has been sent to your phone. Check your SMS!</p>
      </div>
    )
  }

	render() {
		return (
			<div id={`VerifyCodeSegment--${this.props.schema.id}`} style={{ ...comStyles().container, ...this.props.segmentStyles }}>
        {
          this.props.title
          ?
          <div style={{ padding: '0px 0px 20px 0px', display: 'flex', borderBottom: `1px solid ${ACCENT_COLOR}` }}>
            <span style={{ fontSize: '0.7rem', color: ACCENT_COLOR }}>{this.props.title.toUpperCase()}</span>
          </div>
          :
          null
        }
        <div>
        </div>
        <div style={{ margin: '30px 0px 0px 0px' }}>
          {
            this.shouldDisplayInput() || this.state.instantChars
            ?
            this.renderInputCode()
            :
            null
          }
        </div>
        <div style={{ height: '100px', display: 'flex', flexDirection: 'row' }}>
          <div style={{ width: '50%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', position: 'relative' }}>
            {
              this.props.skippable && this.props.skipEndpoint && this.shouldDisplayInput()
              ?
              <div id={`skip--${this.props.schema.id}`} onClick={(e) => this.nextSegment(e, this.props.skipEndpoint)} style={comStyles().skip}>Skip</div>
              :
              null
            }
          </div>
          <div style={{ width: '50%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', position: 'relative' }}>
            {
              this.state.data.input_string && this.shouldDisplayInput()
              ?
              <Icon onClick={(e) => this.nextSegment(e)} type='check-circle' size='lg' style={comStyles().check} />
              :
              <div>
                {
                  this.shouldDisplayInput()
                  ?
                  <Icon type='check-circle-o' size='lg' style={{ ...comStyles().check, cursor: 'not-allowed', color: ACCENT_COLOR }} />
                  :
                  null
                }
              </div>
            }
          </div>
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
VerifyCodeSegment.propTypes = {
  // GENERIC PROPS FOR ALL SEGMENTS
  title: PropTypes.string,                  // passed in
	history: PropTypes.object.isRequired,
  instant_chars_segment_id: PropTypes.string.isRequired, // passed in, determines if this.state.instantChars = true
  triggerScrollDown: PropTypes.func.isRequired, // passed in
  initialData: PropTypes.object,            // passed in, allows us to configure inputs to whats already given
  onDone: PropTypes.func.isRequired,        // passed in
  skippable: PropTypes.bool,                // passed in
  skipEndpoint: PropTypes.string,           // passed in
  texts: PropTypes.array,        // passed in, text to say
  /*
    texts = [
      { id: 'parentID-textID', scrollDown: true, delay: 500, text: 'Some string to display', component: (<div>Example</div>), tooltips: [{ id: 'abc-123', tooltip: (<div>Click this for further info</div>) }] }
    ]
  */
  segmentStyles: PropTypes.object,          // passed in, style of container
  schema: PropTypes.object.isRequired,      // passed in, schema for the internal data. Whats my id? Where to go next?
  /*
    schema.id = 'abc'
    schema.endpoint = 'xyz'
    schema.choices = [
      { id: 'parentID-choiceID', text: 'Something to show', endpoint: 'targetID'  }
    ]
  */

  // UNIQUE PROPS FOR COMPONENT
  inputType: PropTypes.string,              // passed in
  /*
    inputType ['text', 'textarea', 'number', 'tel', 'email', 'url']
  */
  minChars: PropTypes.number,               // passed in
  stringInputPlaceholder: PropTypes.string,
  numberInputPlaceholder: PropTypes.number,

  resendCode: PropTypes.func.isRequired,    // passed in
}

// for all optional props, define a default value
VerifyCodeSegment.defaultProps = {
  title: '',
  texts: [],
  initialData: {},
  segmentStyles: {},
  skippable: false,
  skipEndpoint: '',
  inputType: 'text',
  minChars: 0,
  stringInputPlaceholder: '',
  numberInputPlaceholder: 0,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(VerifyCodeSegment)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    instant_chars_segment_id: redux.app.instant_chars_segment_id,
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
      padding: '50px 0px 0px 0px',
      minHeight: '100vh',
      // minHeight: document.documentElement.clientHeight,
		},
    text: {
      background: INPUT_BACKGROUND,
      border: 'none',
      display: 'flex',
      outline: 'none',
      width: '100%',
      fontSize: '1.2rem',
      height: '30px',
      borderRadius: '10px',
      padding: '20px',
      color: FONT_COLOR,
      WebkitBoxShadow: '0 2px 10px 1px rgba(0,0,0,0)',
      boxShadow: '0 2px 10px 1px rgba(0,0,0,0)',
      "::placeholder": {
        color: INPUT_PLACEHOLDER_COLOR,
      },
      "::-webkit-input-placeholder": {
        color: INPUT_PLACEHOLDER_COLOR,
      }
    },
    textarea: {
      background: INPUT_BACKGROUND,
      border: 'none',
      display: 'flex',
      outline: 'none',
      width: '100%',
      fontSize: '1.2rem',
      height: 'auto',
      borderRadius: '10px',
      padding: '20px',
      color: FONT_COLOR,
      webkitBoxShadow: '0 2px 10px 1px rgba(0,0,0,0)',
      boxShadow: '0 2px 10px 1px rgba(0,0,0,0)',
      "::placeholder": {
        color: INPUT_PLACEHOLDER_COLOR,
      },
      "::-webkit-input-placeholder": {
        color: INPUT_PLACEHOLDER_COLOR,
      }
    },
    skip: {
      padding: '5px',
      minWidth: '50px',
      border: `1px solid ${FONT_COLOR}`,
      borderRadius: '5px',
      fontSize: '0.8rem',
      color: FONT_COLOR,
      cursor: 'pointer',
      position: 'absolute',
      bottom: '20px',
      left: '0px',
      ":hover": {
        opacity: 0.5
      }
    },
		check: {
			color: FONT_COLOR,
			fontWeight: 'bold',
			cursor: 'pointer',
			margin: '15px 0px 0px 0px',
			position: 'absolute',
			bottom: '20px',
			right: '0px',
		}
	}
}
