// Compt for copying as a MultiOptionsSegment
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import SubtitlesMachine from './SubtitlesMachine'
import {

} from 'antd-mobile'

/*
  <MultiOptionsSegment
    schema={{
      id: '2',
      endpoint: '3',
      choices: [
        { id: '2-0', text: 'Option A', endpoint: '3' },
        { id: '2-1', text: 'Option B', endpoint: '4' },
        { id: '2-2', text: 'Option C', endpoint: '5' }
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
    console.log(this.props.instantCharsSegmentID)
    console.log(this.props.schema.id)
    if (this.props.instant_chars_segment_id === this.props.schema.id) {
      this.setState({
        instantChars: true
      })
    }
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

  clickedChoice(choice) {
    console.log(this.state)
    console.log(choice)
    let already_selected = false
    this.state.data.selected_choices.forEach((c) => {
      if (c.id === choice.id) {
        already_selected = true
      }
    })
    if (this.props.multi) {
      if (already_selected) {
        this.setState({
          data: {
            ...this.state.data,
            selected_choices: this.state.data.selected_choices.filter(c => c.id !== choice.id)
          }
        })
      } else {
        this.setState({
          data: {
            ...this.state.data,
            selected_choices: this.state.data.selected_choices.concat([choice])
          }
        })
      }
    } else {
      if (already_selected) {
        this.setState({
          data: {
            ...this.state.data,
            selected_choices: this.state.data.selected_choices.filter(c => c.id !== choice.id)
          }
        })
      } else {
        this.setState({
          data: {
            ...this.state.data,
            selected_choices: this.state.data.selected_choices.concat([choice])
          }
        }, () => {
          this.props.onDone(this.props.schema.id, choice.endpoint, this.state)
        })
      }
    }
  }

  clickedOther(bool) {
    if (bool) {
      this.setState({
        show_other_input: bool
      })
    } else {
      this.setState({
        show_other_input: bool,
        data: {
          ...this.state.data,
          other_choice: ''
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

    nextSegment(e) {
      e.stopPropagation()
      this.props.onDone(this.props.schema.id, this.props.schema.endpoint, this.state.data)
    }

	render() {
		return (
			<div id='MultiOptionsSegment' style={{ ...comStyles().container, ...this.props.segmentStyles }}>
        <div style={{ padding: '20px' }}>
          <span style={{ fontSize: '2rem', color: 'white' }}>{`SEGMENT ${this.props.schema.id}`}</span>
        </div>
        <div>
        {
          this.props.texts.map((text, txtIndex) => {
            return (
              <div>
                {
                  this.shouldDisplayText(text, txtIndex) || this.state.instantChars
                  ?
                  <SubtitlesMachine
                    id={text.id}
                    key={`${text.id}_${txtIndex}`}
    								instant={this.state.instantChars || this.shouldInstantChars(txtIndex)}
    								speed={0.25}
    								delay={this.state.instantChars || this.shouldInstantChars(txtIndex) ? 0 : 500}
    								text={text.text}
    								textStyles={{
    									fontSize: '1.1rem',
    									color: 'white',
    									textAlign: 'left',
    								}}
    								containerStyles={{
    									width: '100%',
    									backgroundColor: 'rgba(0,0,0,0)',
    									margin: '20px 0px 20px 0px',
    								}}
    								doneEvent={() => {
  										this.setState({ completedSections: this.state.completedSections.concat([text.id]) }, () => {
                        this.props.triggerScrollDown(null, 1000)
                      })
    								}}
    							/>
                  :
                  null
                }
              </div>
            )
          })
        }
        </div>
        {
          this.shouldDisplayInput()
          ?
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              {
                this.props.schema.choices.map((choice) => {
                  return (
                    <div>
                      <span key={choice.id} onClick={() => this.clickedChoice(choice)} style={choiceStyles(this.props.givenChoiceStyles, this.state.data.selected_choices, choice).choice}>{choice.text}</span>
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
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <input
                        id="other_input"
                        value={this.state.data.other_choice}
                        onChange={(e) => {
                          this.setState({ data: { ...this.state.data, other_choice: e.target.value } })
                        }}
                        placeholder="Enter your choice"
                        style={comStyles().text}
                      ></input>
                      <span onClick={() => this.clickedOther(false)} style={{ margin: '5px', padding: '5px' }}>X</span>
                    </div>
                    :
                    <span key='other' onClick={() => this.clickedOther(true)} style={choiceStyles(this.props.givenChoiceStyles, this.state.data.selected_choices, { id: 'other' }).choice}>Other</span>
                  }
                </div>
                :
                null
              }
            </div>
          </div>
          :
          null
        }
        <div style={{ padding: '20px', height: '50px' }}>
          {
            this.props.multi && this.shouldDisplayInput()
            ?
            <div style={{ padding: '20px', height: '50px' }}>
              {
                (this.state.data.selected_choices && this.state.data.selected_choices.length > 0) || (this.state.show_other_input && this.state.data.other_choice)
                ?
                <span onClick={(e) => this.nextSegment(e)} style={{ fontSize: '0.8rem', color: 'white', margin: '5px' }}>Done {this.state.data.selected_choices.length}</span>
                :
                null
              }
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
MultiOptionsSegment.propTypes = {
  // GENERIC PROPS FOR ALL SEGMENTS
	history: PropTypes.object.isRequired,
  instant_chars_segment_id: PropTypes.string, // passed in, determines if this.state.instantChars = true
  triggerScrollDown: PropTypes.func.isRequired, // passed in
  onDone: PropTypes.func.isRequired,        // passed in, function to call at very end
  initialData: PropTypes.object,            // passed in, allows us to configure inputs to whats already given
  texts: PropTypes.array,        // passed in, text to say
  /*
    texts = [
      { id: 'parentID-textID', text: 'Some string to display' }
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
  multi: PropTypes.bool,                    // passed in, can there be multiple input choices?
  other: PropTypes.bool,                    // passed in, can there be an "other" option for text input?
  givenChoiceStyles: PropTypes.object,      // passed in, determines the styling for choices
}

// for all optional props, define a default value
MultiOptionsSegment.defaultProps = {
  initialData: null,
  instant_chars_segment_id: '',
  multi: false,
  other: false,
  givenChoiceStyles: {
    unselected: {},
    selected: {},
  },
  segmentStyles: {},
  texts: []
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
		},
    text: {
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      display: 'flex',
      outline: 'none',
      width: '100%',
      fontSize: '1rem',
      height: '30px',
      borderRadius: '10px',
      padding: '20px',
      color: '#ffffff',
      webkitBoxShadow: '0 2px 10px 1px rgba(0,0,0,0)',
      boxShadow: '0 2px 10px 1px rgba(0,0,0,0)',
    }
	}
}

const choiceStyles = (givenChoiceStyles, selected_choices, choice) => {
  let selectedStyle = {}
  selected_choices.forEach((c) => {
    if (c.id === choice.id) {
      selectedStyle.backgroundColor = givenChoiceStyles.selected.backgroundColor || 'white',
      selectedStyle.color = givenChoiceStyles.selected.color || 'black'
    }
  })
  return {
    choice: {
      width: '200px',
      borderRadius: '10px',
      border: '1px solid white',
      color: 'white',
      padding: '5px',
      backgroundColor: 'rgba(0,0,0,0)',
      fontSize: '1rem',
      margin: '5px',
      cursor: 'pointer',
      ...givenChoiceStyles,
      ...selectedStyle,
      ":hover": {
        opacity: 0.5
      }
    }
  }
}
