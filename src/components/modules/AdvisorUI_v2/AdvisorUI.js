// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import moment from 'moment'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import $ from 'jquery'
import {
  Icon,
} from 'antd-mobile'
import { toggleInstantCharsSegmentID } from '../../../actions/app/app_actions'
import Segment from './Segment'
import CounterSegment from './CounterSegment'
import MultiOptionsSegment from './MultiOptionsSegment'


class AdvisorUI extends Component {

  constructor() {
    super()
    this.state = {
      lastUpdated: 0,
    }
    this.all_segments = []
    this.shown_segments = []
  }

  componentWillMount() {
    this.all_segments = this.all_segments.concat([
      { id: '1', component: (<CounterSegment
                                schema={{ id: '1', endpoint: '2' }}
                                texts={[
                                  { id: '1-1', text: 'Some string to display' },
                                  { id: '1-2', text: 'The next string to display!' }
                                ]}
                                onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                triggerScrollDown={() => this.triggerScrollDown()}
                                renderCountValue={(v) => (<div><span>{v} </span><span style={{ fontSize: '0.8rem' }}>rooms</span></div>)}
                                segmentStyles={{ padding: '30px 0px 0px 0px' }}
                                slider
                                sliderOptions={{ min: 10, max: 100, step: 5 }}
                                incrementerOptions={{ max: 100, min: 10, step: 5 }}
                             />) },
      { id: '2', component: (<MultiOptionsSegment
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
                             />) },
      { id: '3', component: (<Segment schema={{ id: '3', endpoint: '9' }} triggerScrollDown={() => this.triggerScrollDown()} onDone={(original_id, endpoint) => this.done(original_id, endpoint)} segmentStyles={{ }} />) },
      { id: '9', component: (<CounterSegment incrementerOptions={{ max: 2, min: 1, step: 1 }} schema={{ id: '3', endpoint: '4' }} initialData={{ count: 1 }} onDone={(original_id, endpoint) => this.done(original_id, endpoint)} segmentStyles={{ }} />) },
      { id: '4', component: (<CounterSegment incrementerOptions={{ max: 3, min: 0, step: 1 }} schema={{ id: '4', endpoint: '5' }} onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)} segmentStyles={{ padding: '30px 0px 0px 0px' }} />) },
      { id: '5', component: (<CounterSegment incrementerOptions={{ max: 10, min: 0, step: 1 }} schema={{ id: '5', endpoint: '6' }} onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)} segmentStyles={{ }} />) },
      { id: '6', component: (<CounterSegment incrementerOptions={{ max: 3, min: 0, step: 1 }} schema={{ id: '6', endpoint: null }} onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)} segmentStyles={{ }} />) }
    ])
    this.shown_segments = this.shown_segments.concat(this.all_segments.slice(0, 1))
    this.setState({ lastUpdated: moment().unix() })
  }

  done(original_id, endpoint, data) {
    let original_id_index = this.shown_segments.length - 1
    this.shown_segments.forEach((seg, index) => {
      if (seg.id === original_id) {
        original_id_index = index
      }
    })
    if (original_id_index + 1 >= this.shown_segments.length) {
      this.shown_segments = this.shown_segments.slice(0, original_id_index + 1).concat(this.all_segments.filter(seg => seg.id === endpoint))
      this.setState({ lastUpdated: moment().unix() }, () => {
        history.pushState(null, null, `${this.props.location.pathname}#${endpoint}`)
        this.triggerScrollDown(endpoint)
      })
    } else {
      this.shown_segments = this.shown_segments.slice(0, original_id_index + 1)
      this.setState({ lastUpdated: moment().unix() }, () => {
        history.pushState(null, null, `${this.props.location.pathname}#${endpoint}`)
        setTimeout(() => {
          this.shown_segments = this.shown_segments.concat(this.all_segments.filter(seg => seg.id === endpoint))
          this.setState({ lastUpdated: moment().unix() }, () => {
            this.triggerScrollDown(endpoint)
          })
        }, 700)
      })
    }
  }

  triggerScrollDown(endpoint, duration = 500) {
    if (endpoint && $(`#${endpoint}`)) {
      $('#scrollable').animate({
          scrollTop: document.getElementById("scrollable").scrollHeight - $(`#${endpoint}`).position().top
      }, duration);
    } else {
      $('#scrollable').animate({
          scrollTop: document.getElementById("scrollable").scrollHeight
      }, duration);
    }
  }

	render() {
		return (
			<div id='AdvisorUI' onClick={() => this.props.toggleInstantCharsSegmentID(this.shown_segments[this.shown_segments.length - 1].id)} style={comStyles().container}>
        <div id='scroll' style={comStyles().scroll}>
          <div id='scrollable' style={comStyles().scrollable}>
            {
              this.shown_segments.map((seg) => {
                return (<div id={seg.id}>{seg.component}</div>)
              })
            }
          </div>
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
AdvisorUI.propTypes = {
	history: PropTypes.object.isRequired,
  toggleInstantCharsSegmentID: PropTypes.func.isRequired,
}

// for all optional props, define a default value
AdvisorUI.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AdvisorUI)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    toggleInstantCharsSegmentID,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      justifyContent: 'flex-start',
      alignItems: 'center',
			background: '#00c6ff', /* fallback for old browsers */
		  background: '-webkit-linear-gradient(to right, #00c6ff, #0072ff)', /* Chrome 10-25, Safari 5.1-6 */
		  background: 'linear-gradient(to right, #00c6ff, #0072ff)' /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
		},
    scroll: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
			bottom: '0px',
      width: '100vw',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: '0px 20px 0px 20px',
    },
		scrollable: {
      // display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
			overflowY: 'scroll',
		}
	}
}
