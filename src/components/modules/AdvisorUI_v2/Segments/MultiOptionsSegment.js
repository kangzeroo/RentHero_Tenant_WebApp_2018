// Compt for copying as a MultiOptionsSegment
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
  Icon,
} from 'antd-mobile'
import { ACCENT_COLOR, FONT_COLOR, FONT_FAMILY, INVERSE_FONT_COLOR, BACKGROUND_COLOR, INPUT_BACKGROUND, INPUT_PLACEHOLDER_COLOR } from '../styles/advisor_ui_styles'

/*
  <MultiOptionsSegment
    title='MultiOptions Segment'
    schema={{
      id: '2',
      endpoint: '3',
      choices: [
        { id: '2-0', text: 'Option A', value: 'A', endpoint: '3' },
        { id: '2-1', text: 'Option B', value: 'B', endpoint: '4' },
        { id: '2-2', text: 'Option C', value: 'C', endpoint: '5' }
      ]
    }}
    texts={[
      { id: '2-1', text: 'Some string to display' },
      { id: '2-2', text: 'The next string to display! The next string to display, The next string to display, The next string to display, The next string to display, The next string to display, The next string to display, The next string to display, The next string to display, The next string to display'},
      { id: '2-3', text: 'OH YES. the next string to display, The next string to display, The next string to display, The next string to display, The next string to display, The next string to display, The next string to display, The next string to display, The next string to display'}
    ]}
    onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
    triggerScrollDown={() => this.triggerScrollDown()}
    segmentStyles={{ padding: '100px 0px 100px 0px' }}
    preselected={[]}
    skippable={false}
    skipEndpoint=''
    multi
  />
*/

class MultiOptionsSegment extends Component {

  constructor() {
    super()
    this.state = {
      completedSections: [],
			instantChars: false,
      show_other_input: false,
      data: {
        selected_choices: [],
        other_choice: '',
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
    this.autoFillOtherSection()
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
    if (prevProps.preselected !== this.props.preselected) {
      this.autoFillOtherSection()
    }
  }

  autoFillOtherSection() {
    console.log(this.props.preselected)
    let other_option = this.props.preselected.filter(pre => pre.id === 'other')[0]
    let other_choice = ''
    if (other_option && other_option.text) {
      other_choice = other_option.text
    }
    this.setState({
      show_other_input: other_choice ? true : false,
      data: {
        ...this.state.data,
        selected_choices: this.props.preselected,
        other_choice: other_choice,
      }
    }, () => console.log(this.state))
  }

  clickedChoice(choice) {
    let already_selected = false
    this.state.data.selected_choices.forEach((c) => {
      if (c.id === choice.id) {
        already_selected = true
      }
    })
    // MULTI SELECT
    if (this.props.multi) {
      // UNSELECT
      if (already_selected) {
        this.setState({
          data: {
            ...this.state.data,
            selected_choices: this.state.data.selected_choices.filter(c => c.id !== choice.id)
          }
        })
      // SELECT
      } else {
        this.setState({
          data: {
            ...this.state.data,
            selected_choices: this.state.data.selected_choices.concat([choice])
          }
        })
      }
    // SINGLE SELECT
    } else {
      // UNSELECT
      if (already_selected) {
        this.setState({
          data: {
            ...this.state.data,
            selected_choices: this.state.data.selected_choices.filter(c => c.id !== choice.id)
          }
        })
      // SELECT
      } else {
        // OTHER ENABLED
        if (this.props.other) {
          // OTHER ALREADY OPENED
          if (this.state.show_other_input) {
            this.setState({
              show_other_input: false,
              data: {
                ...this.state.data,
                selected_choices: [choice],
                other_choice: '',
              }
            }, () => {
              this.props.onDone(this.props.schema.id, choice.endpoint, this.state.data)
            })
          // OTHER ALREADY CLOSED
          } else {
            this.setState({
              show_other_input: false,
              data: {
                ...this.state.data,
                selected_choices: [choice],
                other_choice: '',
              }
            }, () => {
              this.props.onDone(this.props.schema.id, choice.endpoint, this.state.data)
            })
          }
        // OTHER DISABLED
        } else {
          this.setState({
            data: {
              ...this.state.data,
              selected_choices: [choice]
            }
          }, () => {
            this.props.onDone(this.props.schema.id, choice.endpoint, this.state.data)
          })
        }
      }
    }
  }

  clickedOther(bool) {
    if (bool) {
      if (this.props.multi) {
        this.setState({
          show_other_input: bool,
        })
      } else {
        this.setState({
          show_other_input: bool,
          data: {
            ...this.state.data,
            selected_choices: []
          }
        })
      }
    } else {
      this.setState({
        show_other_input: bool,
        data: {
          ...this.state.data,
          other_choice: '',
          selected_choices: this.state.data.selected_choices.filter(c => c.id !== 'other')
        }
      })
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
    this.setState({
      data: {
        ...this.state.data,
        selected_choices: this.state.data.selected_choices.filter(sel => sel.id !== 'other').concat(this.state.data.other_choice ? [
          { id: 'other', text: this.state.data.other_choice || 'other', value: this.state.data.other_choice ? true : false }
        ]: [])
      }
    }, () => this.props.onDone(this.props.schema.id, endpoint, this.state.data))
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

	render() {
		return (
			<div id={`MultiOptionsSegment--${this.props.schema.id}`} style={{ ...comStyles().container, ...this.props.segmentStyles }}>
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
                        key={`${text.id}_${txtIndex}`}
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
      										this.setState({ completedSections: this.state.completedSections.concat([text.id]) }, () => {
                            if (text.scrollDown) {
                              this.props.triggerScrollDown(null, 500)
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
            this.shouldDisplayInput()
            ?
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', padding: '10px', color: ACCENT_COLOR }}>
                {
                  this.props.multi
                  ?
                  'SELECT MULTIPLE'
                  :
                  'SELECT ONE'
                }
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                {
                  this.props.schema.choices.map((choice) => {
                    return (
                      <div style={{ margin: '10px 5px 10px 5px' }}>
                        <div key={choice.id} onClick={() => this.clickedChoice(choice)} style={choiceStyles(this.state.data.selected_choices, choice).choice}>
                          <div style={{ width: '90%' }}>{choice.text}</div>
                          {choice.tooltip ? <Tooltip title={choice.tooltip} style={{ width: '10%' }}><span onClick={(e) => e.stopPropagation()}>&nbsp;&nbsp;&nbsp;ℹ️</span></Tooltip> : null}
                        </div>
                      </div>
                    )
                  })
                }
                {
                  this.props.other
                  ?
                  <div>
                    {
                      this.state.show_other_input
                      ?
                      null
                      :
                      <div key='other' onClick={() => this.clickedOther(true)} style={{ ...choiceStyles(this.state.data.selected_choices, { id: 'other' }).choice, justifyContent: 'center' }}>Other</div>
                    }
                  </div>
                  :
                  null
                }
              </div>
              {
                this.props.other && this.state.show_other_input
                ?
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                  <input
                    id={`other_input--${this.props.schema.id}`}
                    value={this.state.data.other_choice}
                    onChange={(e) => {
                      this.setState({ data: { ...this.state.data, other_choice: e.target.value } })
                    }}
                    placeholder="Enter your choice"
                    onFocus={() => this.focusedInput(`other_input--${this.props.schema.id}`)}
                    onKeyUp={(e) => {
                      if (e.keyCode === 13) {
                        document.getElementById(`other_input--${this.props.schema.id}`).blur()
                      }
                    }}
                    style={comStyles().text}
                  ></input>
                  <span onClick={() => this.clickedOther(false)} style={{ margin: '5px', padding: '5px' }}>X</span>
                </div>
                :
                null
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
              (this.props.multi ? this.props.multi && this.shouldDisplayInput() : this.shouldDisplayInput())
              ?
              <div>
                {
                  (this.state.data.selected_choices && this.state.data.selected_choices.length > 0) || (this.props.other ? this.state.show_other_input && this.state.data.other_choice : false)
                  ?
                  <Icon onClick={(e) => this.nextSegment(e)} type='check-circle' size='lg' style={comStyles().check} />
                  :
                  null
                }
              </div>
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
MultiOptionsSegment.propTypes = {
  // GENERIC PROPS FOR ALL SEGMENTS
  title: PropTypes.string,                  // passed in
	history: PropTypes.object.isRequired,
  instant_chars_segment_id: PropTypes.string, // passed in, determines if this.state.instantChars = true
  triggerScrollDown: PropTypes.func.isRequired, // passed in
  onDone: PropTypes.func.isRequired,        // passed in, function to call at very end
  initialData: PropTypes.object,            // passed in, allows us to configure inputs to whats already given
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
      { id: 'parentID-choiceID', value: 'X', text: 'Something to show', endpoint: 'targetID'  }
    ]
  */

  // UNIQUE PROPS FOR COMPONENT
  multi: PropTypes.bool,                    // passed in, can there be multiple input choices?
  other: PropTypes.bool,                    // passed in, can there be an "other" option for text input?
  preselected: PropTypes.array,             // passed in
  /*
    preselected = [
      { id: 'optionA', text: 'Option A', value: true  },
      { id: 'other', text: 'Something else', value: true }
    ]
  */
}

// for all optional props, define a default value
MultiOptionsSegment.defaultProps = {
  title: '',
  initialData: null,
  instant_chars_segment_id: '',
  multi: false,
  other: false,
  skippable: false,
  skipEndpoint: '',
  segmentStyles: {},
  texts: [],
  preselected: []
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MultiOptionsSegment)

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
      minHeight: document.documentElement.clientHeight,
		},
    text: {
      background: INPUT_BACKGROUND,
      border: 'none',
      display: 'flex',
      outline: 'none',
      width: '100%',
      maxWidth: '300px',
      fontSize: '1rem',
      height: '30px',
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

const choiceStyles = (selected_choices, choice) => {
  let selectedStyle = {}
  selected_choices.forEach((c) => {
    if (c.id === choice.id) {
      selectedStyle.backgroundColor = FONT_COLOR,
      selectedStyle.color = INVERSE_FONT_COLOR
    }
  })
  return {
    choice: {
      width: '200px',
      minWidth: '100px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: '10px',
      border: `1px solid ${FONT_COLOR}`,
      color: FONT_COLOR,
      padding: '5px',
      backgroundColor: INPUT_BACKGROUND,
      fontSize: '1rem',
      cursor: 'pointer',
      textAlign: 'center',
      ...selectedStyle,
      // ":hover": {
      //   opacity: 0.5
      // }
    }
  }
}
