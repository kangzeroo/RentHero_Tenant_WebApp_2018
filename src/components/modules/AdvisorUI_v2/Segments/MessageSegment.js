// Compt for copying as a MessageSegment
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
import { ACCENT_COLOR, FONT_COLOR, FONT_FAMILY, INPUT_BACKGROUND } from '../styles/advisor_ui_styles'



/*
  <MessageSegment
    title='Plain MessageSegment'
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
  />
*/



class MessageSegment extends Component {

  constructor() {
    super()
    this.state = {
      completedSections: [],
			instantChars: false,
      data: {
        value: false,
      }
    }
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
    console.log(`Is it mobile? ${isMobile()}`)
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
    this.props.onDone(this.props.schema.id, endpoint, this.state.data)
  }

  renderCustomComponent(text) {
    if (this.state.completedSections.filter((id) => {
      return id === text.id
    }).length === 0) {
      let currIndex = null
      let nextIndex = null
      this.props.texts.forEach((x, index) => {
        if (x.id === text.id) {
          currIndex = index
          nextIndex = index + 1
        }
      })
      if (this.props.texts[nextIndex] && this.props.texts[nextIndex].component) {
        const shouldDelay = this.shouldInstantChars(currIndex) ? 0 : this.props.texts[nextIndex].delay
        setTimeout(() => {
          this.setState({ completedSections: this.state.completedSections.concat([text.id]) })
        }, shouldDelay)
      } else {
        this.setState({ completedSections: this.state.completedSections.concat([text.id]) })
      }
    }
    return (text.component)
  }

	render() {
		return (
			<div id={`MessageSegment--${this.props.schema.id}`} style={{ ...comStyles().container, ...this.props.segmentStyles }}>
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
        								delay={this.state.instantChars || this.shouldInstantChars(txtIndex) ? 0 : text.delay}
                        tooltips={this.props.tooltips}
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
                              this.props.triggerScrollDown(null, 1000)
                            }
                            if (this.shouldDisplayInput() && !this.props.action.enabled) {
                              setTimeout(() => {
                                this.nextSegment()
                              }, 1000)
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
        <div>
          {
            this.shouldDisplayInput() && this.props.action.enabled
            ?
            <div style={{ height: '100px', display: 'flex', flexDirection: 'row' }}>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', position: 'relative' }}>
                <div onClick={() => this.nextSegment()} style={comStyles().action}>{this.props.action.label}</div>
              </div>
            </div>
            :
            null
          }
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
MessageSegment.propTypes = {
  // GENERIC PROPS FOR ALL SEGMENTS
  title: PropTypes.string,                  // passed in
	history: PropTypes.object.isRequired,
  instant_chars_segment_id: PropTypes.string.isRequired, // passed in, determines if this.state.instantChars = true
  triggerScrollDown: PropTypes.func.isRequired, // passed in
  initialData: PropTypes.object,            // passed in, allows us to configure inputs to whats already given
  onDone: PropTypes.func.isRequired,        // passed in
  skippable: PropTypes.bool,                // passed in
  skipEndpoint: PropTypes.string,           // passed in
  action: PropTypes.object,                 // passed in
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
}

// for all optional props, define a default value
MessageSegment.defaultProps = {
  texts: [],
  initialData: {},
  segmentStyles: {},
  skippable: false,
  skipEndpoint: '',
  action: { enabled: false, label: '' },
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MessageSegment)

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
		},
    action: {
      borderRadius: '10px',
      border: `1px solid ${FONT_COLOR}`,
      color: FONT_COLOR,
      padding: '5px 10px 5px 10px',
      // backgroundColor: INPUT_BACKGROUND,
      fontSize: '1rem',
      cursor: 'pointer',
			margin: '15px 0px 0px 0px',
			position: 'absolute',
			bottom: '20px',
			right: '0px',
    }
	}
}
