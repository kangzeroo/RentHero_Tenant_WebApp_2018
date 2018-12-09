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
import SegmentTemplate from '../../modules/AdvisorUI_v2/Segments/SegmentTemplate'
import MapSegment from '../../modules/AdvisorUI_v2/Segments/MapSegment'
import CounterSegment from '../../modules/AdvisorUI_v2/Segments/CounterSegment'
import MultiOptionsSegment from '../../modules/AdvisorUI_v2/Segments/MultiOptionsSegment'
import DatePickerSegment from '../../modules/AdvisorUI_v2/Segments/DatePickerSegment'
import DateRangeSegment from '../../modules/AdvisorUI_v2/Segments/DateRangeSegment'
import InputSegment from '../../modules/AdvisorUI_v2/Segments/InputSegment'
import MessageSegment from '../../modules/AdvisorUI_v2/Segments/MessageSegment'
import ActionSegment from '../../modules/AdvisorUI_v2/Segments/ActionSegment'
import FileUploadSegment from '../../modules/AdvisorUI_v2/Segments/FileUploadSegment'
import ShareUrlSegment from '../../modules/AdvisorUI_v2/Segments/ShareUrlSegment'
import { ACCENT_COLOR, FONT_COLOR, BACKGROUND_COLOR, BACKGROUND_WEBKIT, BACKGROUND_MODERN, FONT_FAMILY, FONT_FAMILY_ACCENT } from '../../modules/AdvisorUI_v2/styles/advisor_ui_styles'


class GuarantorDialog extends Component {

  constructor() {
    super()
    this.state = {
      lastUpdated: 0,
      scrollStyles: {
        scroll_styles: {},
        scrollable_styles: {},
      },
      data: {
        name: ''
      }
    }
    this.all_segments = []
    this.shown_segments = []
  }

  componentWillMount() {
    this.rehydrateSegments()
    this.shown_segments = this.shown_segments.concat(this.all_segments.slice(0, 1))
    this.setState({ lastUpdated: moment().unix() })
  }

  rehydrateSegments() {
    this.all_segments = [
      {
        id: 'notice',
        component: (<MessageSegment
                         schema={{ id: 'notice', endpoint: 'first_time_renting' }}
                         triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                         onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                         texts={[
                           { id: '0-1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, containerStyles: { margin: '30px 0px 0px 20px' }, text: 'I am about to ask you some personal questions.' },
                           { id: '0-2', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: `None of these will be shared with a landlord, they are only used to help us understand and serve your needs better.` },
                           { id: '0-6', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: `Answering is optional, but we encourage you to answer as many as possible.` },
                         ]}
                         action={{ enabled: true, label: 'Begin', actionStyles: { width: '100%' } }}
                       />) },
    ]
    this.setState({ lastUpdated: moment().unix() })
  }

  doneMovingFrom(original_id, endpoint, data) {
    if (data.address.indexOf('ON, Canada') > -1) {
      this.done(original_id, 'current_housing_situation', data)
    } else {
      this.done(original_id, 'arrival_flight_time', data)
    }
  }

  doneName(original_id, endpoint, data) {
    this.setState({
      data: {
        ...this.state.data,
        name: data.input_string,
      }
    }, () => this.done(original_id, endpoint, data))
  }

  done(original_id, endpoint, data) {
    console.log('original_id: ', original_id)
    let original_id_index = this.shown_segments.length - 1
    this.shown_segments.forEach((seg, index) => {
      if (seg && seg.id === original_id) {
        original_id_index = index
      }
    })
    this.rehydrateSegments()
    // If we are adding more segments to this.shown_segments, or if we are backtracking on a past segment
    if (original_id_index + 1 >= this.shown_segments.length) {
      // add next segment
      this.shown_segments = this.shown_segments.slice(0, original_id_index + 1).concat(this.all_segments.filter(seg => seg.id === endpoint))
      this.setState({ lastUpdated: moment().unix() }, () => {
        history.pushState(null, null, `${this.props.location.pathname}#${endpoint}`)
        this.redrawContainer()
      })
    // Backtracking on a past segment
    } else {
      // cut off past convo branch
      this.shown_segments = this.shown_segments.slice(0, original_id_index + 1)
      // rerender react this.shown_segments
      this.setState({ lastUpdated: moment().unix() }, () => {
        history.pushState(null, null, `${this.props.location.pathname}#${endpoint}`)
        setTimeout(() => {
          // add next segment
          this.shown_segments = this.shown_segments.concat(this.all_segments.filter(seg => seg.id === endpoint))
          this.setState({ lastUpdated: moment().unix() }, () => this.redrawContainer())
        }, 700)
      })
    }
  }

  action(original_id, urlDestination, data) {
    if (urlDestination) {
      this.props.history.push(urlDestination)
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

  extractRGBA(cssString) {
    return cssString.replace('rgba(', '').replace(')', '').split(',')
  }

  redrawContainer(duration = 500) {
    // scroll down
    const prevScrollHeight = document.getElementById('containment').offsetHeight
    const screenHeight = document.documentElement.clientHeight
    const nextHeight = prevScrollHeight + screenHeight
    document.getElementById('containment').style.height = `${nextHeight}px`
    $('#scrollable').animate({
        scrollTop: prevScrollHeight
    }, duration);
    // change background image if applicable
    const current_segment = this.shown_segments[this.shown_segments.length - 1]
    if (current_segment.scrollStyles && current_segment.scrollStyles.scroll_styles && current_segment.scrollStyles.scrollable_styles) {
      let darkenCount = 0
      const darken = setInterval(() => {
        this.setState({
          scrollStyles: {
            ...this.state.scrollStyles,
            scrollable_styles: {
              ...this.state.scrollStyles.scrollable_styles,
              backgroundColor: `rgba(
                ${this.extractRGBA(current_segment.scrollStyles.scrollable_styles.backgroundColor)[0]},
                ${this.extractRGBA(current_segment.scrollStyles.scrollable_styles.backgroundColor)[1]},
                ${this.extractRGBA(current_segment.scrollStyles.scrollable_styles.backgroundColor)[2]},
                ${darkenCount/duration}
              )`
            }
          }
        })
        darkenCount += 25
        if (darkenCount > duration) {
          clearInterval(darken)
        }
      }, 25)
      setTimeout(() => {
        let lightenCount = duration
        this.setState({
          scrollStyles: {
            ...this.state.scrollStyles,
            scroll_styles: current_segment.scrollStyles.scroll_styles
          }
        })
        const lighten = setInterval(() => {
          this.setState({
            scrollStyles: {
              ...this.state.scrollStyles,
              scrollable_styles: {
                ...this.state.scrollStyles.scrollable_styles,
                backgroundColor: `rgba(
                  ${this.extractRGBA(current_segment.scrollStyles.scrollable_styles.backgroundColor)[0]},
                  ${this.extractRGBA(current_segment.scrollStyles.scrollable_styles.backgroundColor)[1]},
                  ${this.extractRGBA(current_segment.scrollStyles.scrollable_styles.backgroundColor)[2]},
                  ${lightenCount/duration}
                )`
              }
            }
          })
          lightenCount -= 25
          if (lightenCount < duration * parseFloat(this.extractRGBA(current_segment.scrollStyles.scrollable_styles.backgroundColor)[3])) {
            clearInterval(lighten)
            this.setState({
              scrollStyles: {
                ...this.state.scrollStyles,
                scrollable_styles: this.state.scrollStyles.scrollable_styles
              }
            })
          }
        }, 25)
      }, duration + 250)
    }
  }

	render() {
		return (
			<div id='GuarantorDialog' onClick={() => this.props.toggleInstantCharsSegmentID(this.shown_segments[this.shown_segments.length - 1].id)} style={comStyles().container}>
        <div id='scroll' style={scrollStyles(this.state.scrollStyles).scroll}>
          <div id='scrollable' style={scrollStyles(this.state.scrollStyles).scrollable}>
            <div id='containment' style={{ maxWidth: '800px', width: '100%', padding: '0px 20px 0px 20px' }}>
              {
                this.shown_segments.map((seg) => {
                  return (<div id={seg.id}>{seg.component}</div>)
                })
              }
            </div>
          </div>
        </div>
        {
          this.all_segments.filter((seg) => {
            return seg.scrollStyles && seg.scrollStyles.scroll_styles && seg.scrollStyles.scroll_styles.backgroundImage
          }).map((seg) => {
            const cssURL = seg.scrollStyles.scroll_styles.backgroundImage.replace('url(', '').replace(')', '').replace(/(\"?\'?)/igm, '')
            return (<img src={cssURL} style={{ display: 'none' }} />)
          })
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
GuarantorDialog.propTypes = {
	history: PropTypes.object.isRequired,
  toggleInstantCharsSegmentID: PropTypes.func.isRequired,
}

// for all optional props, define a default value
GuarantorDialog.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(GuarantorDialog)

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
      minHeight: '100%',
      justifyContent: 'flex-start',
      alignItems: 'center',
			background: BACKGROUND_COLOR,
		  background: BACKGROUND_WEBKIT,
		  background: BACKGROUND_MODERN
		},
	}
}

const scrollStyles = ({ scroll_styles, scrollable_styles }) => {
  return {
    scroll: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      position: 'fixed',
			bottom: '0px',
      width: '100vw',
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      ...scroll_styles
    },
		scrollable: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'center',
			overflowY: 'scroll',
      backgroundBlendMode: 'darken',
      // opacity: 1,
      // webkitTransition: 'opacity 3s ease-in-out',
      // transition: 'opacity 3s ease-in-out',
      ...scrollable_styles
		}
  }
}
