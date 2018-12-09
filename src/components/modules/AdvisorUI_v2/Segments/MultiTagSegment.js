// Compt for copying as a MultiTagSegment
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import SubtitlesMachine from './SubtitlesMachine'
import { isMobile } from '../../../../api/general/general_api'
import { Tooltip, Tag, Input } from 'antd'
import {
  Toast,
  Icon,
} from 'antd-mobile'
import { ACCENT_COLOR, FONT_COLOR, FONT_FAMILY, BACKGROUND_COLOR } from '../styles/advisor_ui_styles'



/*
  <MultiTagSegment
    title='Plain MultiTagSegment'
    schema={{ id: '1', endpoint: '2' }}
    texts={[
      { id: '1-1', text: 'Some string to display' },
      { id: '1-2', text: 'The next string to display!' }
    ]}
    tags={[
      { id: 'balcony', text: 'Balcony', value: 'true' },
      { id: 'ensuite_laundry', text: 'Ensuite Laundry', value: 'false' },
    ]}
    minTags={2}
    onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
    triggerScrollDown={() => this.triggerScrollDown()}
    segmentStyles={{ padding: '30px 0px 0px 0px' }}
    skippable={false}
    skipEndpoint=''
  />
*/



class MultiTagSegment extends Component {

  constructor() {
    super()
    this.state = {
      completedSections: [],
			instantChars: false,
      new_tag: false,
      input_string: '',
      data: {
        all_tags: [],
        chosen_tags: [],
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
        all_tags: this.props.tags.sort((a, b) => {
          let a_value = a.value ? 1 : -1
          let b_value = b.value ? 1 : -1
          return b_value - a_value
        }),
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

  renderCustomComponent(text) {
    if (this.state.completedSections.filter((id) => {
      return id === text.id
    }).length === 0) {
      this.setState({ completedSections: this.state.completedSections.concat([text.id]) })
    }
    return (text.component)
  }

  addedTag(tag_text) {
    this.setState({
      input_string: '',
      new_tag: false,
      data: {
        ...this.state.data,
        all_tags: this.state.data.all_tags.concat([
          { id: tag_text.replace(/(\s)/igm, '_'), text: tag_text, value: true }
        ])
      }
    })
  }

  tappedTag(e, tag) {
    console.log(tag)
    if (e) {
      e.stopPropagation()
    }
    if (tag.value) {
      this.setState({
        data: {
          ...this.state.data,
          all_tags: this.state.data.all_tags.map(t => {
            if (t.id === tag.id) {
              return { ...t, value: false }
            } else {
              return t
            }
          }),
        }
      }, () => console.log(this.state.data))
    } else {
      this.setState({
        data: {
          ...this.state.data,
          all_tags: this.state.data.all_tags.map(t => {
            if (t.id === tag.id) {
              return { ...t, value: true }
            } else {
              return t
            }
          }),
        }
      }, () => console.log(this.state.data))
    }
  }

	render() {
		return (
			<div id={`MultiTagSegment--${this.props.schema.id}`} style={{ ...comStyles().container, minHeight: document.documentElement.clientHeight, ...this.props.segmentStyles }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '20px', minHeight: '100px' }}>
              <div style={{ height: '50px' }}>
                {this.state.new_tag && (
                  <Input
                    type="text"
                    size="small"
                    style={{ width: 120 }}
                    value={this.state.input_string}
                    onChange={(e) => this.setState({ input_string: e.target.value })}
                    onBlur={() => this.addedTag(this.state.input_string)}
                    onPressEnter={() => this.addedTag(this.state.input_string)}
                  />
                )}
                {!this.state.new_tag && (
                  <div
                    onClick={() => this.setState({ new_tag: true })}
                    style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '5px', margin: '5px', color: 'white', cursor: 'pointer', border: '1px dashed white', borderRadius: '5px' }}
                  >
                    Add New
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                {
                  this.state.data.all_tags.map((tag) => {
                    return (
                      <div onClick={(e) => this.tappedTag(e, tag)} style={tagStyles(tag.value).tag}>
                        {tag.text}
                      </div>
                    )
                  })
                }
                </div>
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
              this.state.data.all_tags.filter(t => t.value).length >= this.props.minTags && this.shouldDisplayInput()
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
MultiTagSegment.propTypes = {
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
  tags: PropTypes.array.isRequired,       // passed in
  /*
    tags = [
      { id: 'balcony', text: 'Balcony', value: 'true' },
      { id: 'ensuite_laundry', text: 'Ensuite Laundry', value: 'ensuite_laundry' },
    ]
  */
  minTags: PropTypes.number,                 // passed in
}

// for all optional props, define a default value
MultiTagSegment.defaultProps = {
  texts: [],
  initialData: {},
  segmentStyles: {},
  skippable: false,
  skipEndpoint: '',
  tags: [],
  minTags: 0,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MultiTagSegment)

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

const tagStyles = (checked) => {
  let taggedStyles = {
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0)'
  }
  if (checked) {
    taggedStyles.color = BACKGROUND_COLOR
    taggedStyles.backgroundColor = 'white'
  }
  return {
    tag: {
      padding: '5px',
      borderRadius: '5px',
      margin: '10px 5px 10px 5px',
      cursor: 'pointer',
      ...taggedStyles,
    }
  }
}
