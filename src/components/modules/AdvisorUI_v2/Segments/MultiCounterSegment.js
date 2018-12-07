// Compt for copying as a MultiCounterSegment
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
import { ACCENT_COLOR, FONT_COLOR, FONT_FAMILY } from '../styles/advisor_ui_styles'



/*
<MultiCounterSegment
      title='Multi-Counter Segment'
      schema={{ id: 'eeee', endpoint: 'xxx' }}
      triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
      onDone={(original_id, endpoint, data) => this.doneName(original_id, endpoint, data)}
      texts={[
        { id: '0-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'You can put multiple inputs into me!' },
      ]}
      skippable
      skipEndpoint='xxx'
      counters={[
        { id: 'small_dogs', renderCountValue: (c) => c, incrementerOptions: { min: 0, max: 5, step: 1, default: 0 }, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Small Dogs', value: 0, tooltip: (<p>20 kg or less</p>) },
        { id: 'large_dogs', renderCountValue: (c) => c, incrementerOptions: { min: 0, max: 5, step: 1, default: 0 }, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Large Dogs', value: 0, tooltip: (<p>20 kg or more</p>) },
        { id: 'cats', renderCountValue: (c) => c, incrementerOptions: { min: 0, max: 5, step: 1, default: 0 }, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Cats', value: 0 },
      ]}
      other
      otherIncrementerOptions={{
        min: 0,
        max: 5,
        default: 0,
        step: 1,
      }}
   />
*/



class MultiCounterSegment extends Component {

  constructor() {
    super()
    this.state = {
      completedSections: [],
			instantChars: false,
      data: {
        counters: [],
      }
    }
    this.mobile = false
  }

  componentWillMount() {
    console.log(this.props.counters)
    this.setState({
      data: {
        ...this.state.data,
        counters: [].concat(this.props.counters),
      }
    }, () => console.log(this.state.data))
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
    this.props.onDone(this.props.schema.id, endpoint, this.state.data)
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
    console.log(this.state)
		return (
			<div id={`MultiCounterSegment--${this.props.schema.id}`} style={{ ...comStyles().container, minHeight: document.documentElement.clientHeight, ...this.props.segmentStyles }}>
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
                                this.props.triggerScrollDown(null, 1000)
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
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', borderRadius: '10px', padding: '20px', minHeight: '100px' }}>
              {
                this.state.data.counters.map((counter) => {
                  return (
                    <div>{counter.id}</div>
                  )
                })
              }
            </div>
            :
            <div style={{ width: '100%', height: '100px' }}></div>
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
              this.shouldDisplayInput()
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
MultiCounterSegment.propTypes = {
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
  */

  // UNIQUE PROPS FOR COMPONENT
  counters: PropTypes.array.isRequired,     // passed in, the counters
  /*
    counters = [
      { id: 'large_dogs', renderCountValue={(c) => c}, incrementerOptions: { min, max, step, default }, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Small Dogs', value: 0, tooltip: (<p>20 kg or less</p>) },
    ]
  */
  other: PropTypes.bool,                        // passed in, the ability to add more options
  otherIncrementerOptions: PropTypes.object,    // passed in
  /*
    otherIncrementerOptions = {
      min: 0,
      max: 5,
      default: 0,
      step: 1,
    }
  */
}

// for all optional props, define a default value
MultiCounterSegment.defaultProps = {
  texts: [],
  initialData: {},
  segmentStyles: {},
  skippable: false,
  skipEndpoint: '',
  counters: [],
  other: false,
  otherIncrementerOptions: {}
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MultiCounterSegment)

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
		}
	}
}
