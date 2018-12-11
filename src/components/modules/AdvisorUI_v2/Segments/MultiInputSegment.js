// Compt for copying as a MultiInputSegment
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import SubtitlesMachine from './SubtitlesMachine'
import { isMobile } from '../../../../api/general/general_api'
import ShortUniqueId from 'short-unique-id'
import Ionicon from 'react-ionicons'
const uid = new ShortUniqueId()
import { Tooltip } from 'antd'
import {
  Toast,
  Icon,
} from 'antd-mobile'
import { ACCENT_COLOR, FONT_COLOR, INPUT_BACKGROUND, INPUT_PLACEHOLDER_COLOR, FONT_FAMILY } from '../styles/advisor_ui_styles'



/*
  <MultiInputSegment
    title='Multi Input Segment'
    schema={{ id: '1', endpoint: '2' }}
    texts={[
      { id: '1-1', text: 'Some string to display' },
      { id: '1-2', text: 'The next string to display!' }
    ]}
    inputs={[
      { id: '123', text: 'Web Developer', value: true },
      { id: '234', text: 'Chef', value: true },
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



class MultiInputSegment extends Component {

  constructor() {
    super()
    this.state = {
      completedSections: [],
			instantChars: false,
      input_string: '',
      data: {
        inputs: [],
      }
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
    this.setState({
      data: {
        ...this.state.data,
        inputs: this.props.inputs,
        ...this.props.initialData
      }
    })
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
    this.props.onDone(this.props.schema.id, endpoint, this.state.data)
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

  clickedAdd(e) {
    if (e) {
      e.stopPropagation()
    }
    if (this.state.input_string) {
      this.setState({
        data: {
          ...this.state.data,
          inputs: this.state.data.inputs.concat([{ id: uid.randomUUID(6), text: this.state.input_string, value: true }])
        },
        input_string: '',
      })
    }
    const input_field = document.getElementById(`input_field--${this.props.schema.id}`)
    const textarea_field = document.getElementById(`textarea_field--${this.props.schema.id}`)
    if (input_field) {
      input_field.scrollIntoView({ behavior: "smooth", block: "top" })
    } else if (textarea_field) {
      textarea_field.scrollIntoView({ behavior: "smooth", block: "top" })
    }
  }

  clickedRemove(e, id) {
    if (e) {
      e.stopPropagation()
    }
    this.setState({
      data: {
        ...this.state.data,
        inputs: this.state.data.inputs.filter(i => i.id !== id)
      }
    })
  }

	render() {
		return (
			<div id={`MultiInputSegment--${this.props.schema.id}`} style={{ ...comStyles().container, ...this.props.segmentStyles }}>
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
        {
          this.props.texts.map((text, txtIndex) => {
            return (
              <div>
                {
                  this.shouldDisplayText(text, txtIndex) || this.state.instantChars
                  ?
                  <div>
                    {
                      text.component
                      ?
                      this.renderCustomComponent(text)
                      :
                      <SubtitlesMachine
                        id={`Subtitle--${this.props.schema.id}--${text.id}`}
                        key={`${text.id}_${txtIndex}_${this.props.schema.id}`}
        								instant={this.state.instantChars || this.shouldInstantChars(txtIndex)}
        								speed={0.25}
        								delay={this.state.instantChars || this.shouldInstantChars(txtIndex) ? 0 : 500}
        								text={text}
        								textStyles={{
        									fontSize: '1.1rem',
        									color: FONT_COLOR,
        									textAlign: 'left',
                          fontFamily: FONT_FAMILY,
                          ...text.textStyles,
        								}}
        								containerStyles={{
        									width: '100%',
        									backgroundColor: 'rgba(0,0,0,0)',
        									margin: '20px 0px 20px 0px',
        								}}
        								doneEvent={() => {
                          console.log('DONE EVENT TRIGGERED')
      										this.setState({ completedSections: this.state.completedSections.concat([text.id]) }, () => {
                            if (text.scrollDown) {
                              this.props.triggerScrollDown(null, 1000)
                            }
                            console.log('shouldDisplayInput: ', this.shouldDisplayInput())
                            if (this.shouldDisplayInput() || this.state.instantChars) {
                              if (this.props.inputType === 'textarea') {
                                // document.getElementById(`textarea_field--${this.props.schema.id}`).focus()
                              } else {
                                console.log(this.mobile)
                                if (!this.mobile) {
                                  document.getElementById(`input_field--${this.props.schema.id}`).focus()
                                }
                                document.getElementById(`input_field--${this.props.schema.id}`).addEventListener('keyup', (e) => {
                            			if (e.keyCode === 13) {
                                    // document.getElementById(`input_field--${this.props.schema.id}`).blur()
                                    this.clickedAdd()
                            			}
                            		})
                              }
                            }
                          })
        								}}
        							/>
                    }
                  </div>
                  :
                  null
                }
              </div>
            )
          })
        }
        </div>
        <div style={{ margin: '30px 0px 0px 0px' }}>
          {
            this.shouldDisplayInput() || this.state.instantChars
            ?
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {
                this.state.data.inputs.map((input) => {
                  if (this.props.inputType === 'textarea') {
                    return (
                      <div style={{ position: 'relative', width: '100%', minHeight: '100px' }}>
                        <textarea
                          id={`${input.id}---textarea_field--${this.props.schema.id}`}
                          disabled
                          rows={4}
                          value={this.state.data.inputs.filter(i => i.id === input.id)[0] ? this.state.data.inputs.filter(i => i.id === input.id)[0].text : ''}
                          onChange={(e) => {}}
                          onFocus={() => this.focusedInput(`${input.id}---textarea_field--${this.props.schema.id}`)}
                          style={{ ...comStyles().textarea, cursor: 'not-allowed' }}
                        ></textarea>
                        <div style={{ position: 'absolute', top: '3px', right: '15px' }}>
                          <Ionicon icon="md-remove" onClick={(e) => this.clickedRemove(e, input.id)} fontSize="35px" color={FONT_COLOR}/>
                        </div>
                      </div>
                    )
                  } else {
                    return (
                      <div style={{ position: 'relative', width: '100%', minHeight: '70px' }}>
                        <input
                          id={`${input.id}---input_field--${this.props.schema.id}`}
                          disabled
                          type={this.props.inputType}
                          value={this.state.data.inputs.filter(i => i.id === input.id)[0] ? this.state.data.inputs.filter(i => i.id === input.id)[0].text : ''}
                          onChange={(e) => {}}
                          onFocus={() => this.focusedInput(`${input.id}---input_field--${this.props.schema.id}`)}
                          placeholder={this.props.inputType === 'number' ? this.props.numberInputPlaceholder : this.props.stringInputPlaceholder}
                          style={{ ...comStyles().text, cursor: 'not-allowed' }}
                        ></input>
                        <div style={{ position: 'absolute', top: '3px', right: '15px' }}>
                          <Ionicon icon="md-remove" onClick={(e) => this.clickedRemove(e, input.id)} fontSize="35px" color={FONT_COLOR}/>
                        </div>
                      </div>
                    )
                  }
                })
              }
              {
                this.props.inputType === 'textarea'
                ?
                <div style={{ position: 'relative', width: '100%', minHeight: '100px' }}>
                  <textarea
                    id={`textarea_field--${this.props.schema.id}`}
                    rows={4}
                    value={this.state.input_string}
                    onChange={(e) => {
                      this.setState({ input_string: e.target.value })
                    }}
                    onFocus={() => this.focusedInput(`textarea_field--${this.props.schema.id}`)}
                    placeholder={this.props.stringInputPlaceholder}
                    style={comStyles().textarea}
                  ></textarea>
                  <div style={{ position: 'absolute', top: '3px', right: '15px' }}>
                    <Ionicon icon="md-add" onClick={(e) => this.clickedAdd(e)} fontSize="35px" color={FONT_COLOR}/>
                  </div>
                </div>
                :
                <div style={{ position: 'relative', width: '100%', minHeight: '70px' }}>
                  <input
                    id={`input_field--${this.props.schema.id}`}
                    type={this.props.inputType}
                    value={this.state.input_string}
                    onChange={(e) => {
                      this.setState({ input_string: e.target.value })
                    }}
                    onFocus={() => this.focusedInput(`input_field--${this.props.schema.id}`)}
                    placeholder={this.props.inputType === 'number' ? this.props.numberInputPlaceholder : this.props.stringInputPlaceholder}
                    style={comStyles().text}
                  ></input>
                  <div style={{ position: 'absolute', top: '3px', right: '15px' }}>
                    <Ionicon icon="md-add" onClick={(e) => this.clickedAdd(e)} fontSize="35px" color={FONT_COLOR}/>
                  </div>
                </div>
              }
            </div>
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
              this.state.data.inputs && this.state.data.inputs.length && this.shouldDisplayInput()
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
MultiInputSegment.propTypes = {
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
  inputs: PropTypes.array,
  /*
    inputs = [{ id: '123', text: 'Web Developer', value: 'Web Developer' }]
  */
  minChars: PropTypes.number,               // passed in
  stringInputPlaceholder: PropTypes.string,
  numberInputPlaceholder: PropTypes.number,

}

// for all optional props, define a default value
MultiInputSegment.defaultProps = {
  title: '',
  texts: [],
  initialData: {},
  segmentStyles: {},
  skippable: false,
  skipEndpoint: '',
  inputType: 'text',
  inputs: [],
  minChars: 0,
  stringInputPlaceholder: '',
  numberInputPlaceholder: 0,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MultiInputSegment)

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
      height: '100vh',
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
