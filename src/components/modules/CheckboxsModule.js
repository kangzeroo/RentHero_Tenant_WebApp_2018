// Compt for copying as a CheckboxsModule
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import { isMobile } from '../../api/general/general_api'
import {
  Checkbox,
} from 'antd'
import {
  Toast,
  Icon,
} from 'antd-mobile'


class CheckboxsModule extends Component {

  constructor() {
    super()
    this.state = {
      show_other_input: false,
      initial_selected_choices: [],
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
      initial_selected_choices: this.props.preselected,
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
            })
          }
        // OTHER DISABLED
        } else {
          this.setState({
            data: {
              ...this.state.data,
              selected_choices: [choice]
            }
          })
        }
      }
    }
  }

  determineIfChecked(selected_choices, choice) {
    let checked = false
    selected_choices.forEach((c) => {
      if (c.id === choice.id) {
        checked = true
      }
    })
    return checked
  }

  saveChanges() {
    this.props.onComplete(this.state.data)
  }

	render() {
		return (
			<div id='CheckboxsModule' style={comStyles().container}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '80%', margin: '0px 10% 0px 10%' }}>
				{
          this.props.choices.map(choice => {
            return (
              <Checkbox id={choice.id} key={choice.id} onClick={() => this.clickedChoice(choice)} checked={this.determineIfChecked(this.state.data.selected_choices, choice)}>{choice.text}</Checkbox>
            )
          })
        }
        </div>
        <div style={{ width: '100%', height: '50px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', position: 'relative', margin: '15px 0px 0px 0px' }}>
          {
            this.state.data.selected_choices !== this.state.initial_selected_choices
            ?
            <Icon onClick={(e) => this.saveChanges(e)} type='check-circle' size='lg' style={comStyles().check} />
            :
            <Icon type='check-circle-o' size='lg' style={{ ...comStyles().check, cursor: 'not-allowed', color: 'gray' }} />
          }
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
CheckboxsModule.propTypes = {
	history: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,        // passed in, function to call at very end
  multi: PropTypes.bool,                    // passed in, can there be multiple input choices?
  choices: PropTypes.array.isRequired,      // passed in
  /*
    options = [{ id: 'parentID-choiceID', value: 'X', text: 'Something to show'  }]
  */
  preselected: PropTypes.array,             // passed in
  /*
    preselected = [
      { id: 'optionA', text: 'Option A', value: true  },
      { id: 'other', text: 'Something else', value: true }
    ]
  */
}

// for all optional props, define a default value
CheckboxsModule.defaultProps = {
  multi: false,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(CheckboxsModule)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

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
		}
	}
}
