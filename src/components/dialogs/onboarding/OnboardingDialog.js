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
import MessageSegment from '../../modules/AdvisorUI_v2/Segments/MessageSegment'
import ActionSegment from '../../modules/AdvisorUI_v2/Segments/ActionSegment'
import InputSegment from '../../modules/AdvisorUI_v2/Segments/InputSegment'
import MapSegment from '../../modules/AdvisorUI_v2/Segments/MapSegment'
import CounterSegment from '../../modules/AdvisorUI_v2/Segments/CounterSegment'
import MultiOptionsSegment from '../../modules/AdvisorUI_v2/Segments/MultiOptionsSegment'
import {
  Icon,
} from 'antd-mobile'
import { toggleInstantCharsSegmentID } from '../../../actions/app/app_actions'
import { ACCENT_COLOR, FONT_COLOR, BACKGROUND_COLOR, BACKGROUND_WEBKIT, BACKGROUND_MODERN, FONT_FAMILY, FONT_FAMILY_ACCENT } from '../../modules/AdvisorUI_v2/styles/advisor_ui_styles'


class OnboardingDialog extends Component {

  constructor() {
    super()
    this.state = {
      lastUpdated: 0,
      scrollStyles: {
        scroll_styles: {},
        scrollable_styles: {},
      },
      data: {
        name: '',
        group_size: 1,
        budget_per_person: 1000,
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
        id: '1',
        component: (<MessageSegment
                               schema={{ id: '1', endpoint: '2' }}
                               triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                               onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                               texts={[
                                 { id: '0-1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, containerStyles: { margin: '30px 0px 0px 20px' }, text: 'Hello 👋 My name is RentHero' },
                                 { id: '0-2', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: `I'm an A.I. real estate agent here to help you find your next home! Here's what I can do for you:` },
                                 { id: '0-3', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY, margin: '10px 0px 5px 0px', textAlign: 'center' }, text: `🔍 Browse Online Rentals` },
                                 { id: '0-4', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY, margin: '5px 0px 5px 0px', textAlign: 'center' }, text: `👆 Narrow Your Selection` },
                                 { id: '0-5', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY, margin: '5px 0px 10px 0px', textAlign: 'center' }, text: `📜 Handle The Paperwork` },
                                 { id: '0-6', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: `Ready to get started? 🤓` },
                               ]}
                               action={{ enabled: true, label: 'Get Started', actionStyles: { width: '100%' } }}
                             />) },
     {
       id: '2',
       scrollStyles: { scroll_styles: { backgroundImage: `url('http://www.gohaus.com/wp-content/uploads/2015/12/living-room-floor-design-ideas.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.6)' } },
       component: (<InputSegment
                               title='Introductions'
                               schema={{ id: '2', endpoint: '3' }}
                               triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                               onDone={(original_id, endpoint, data) => this.doneName(original_id, endpoint, data)}
                               texts={[
                                 { id: '0-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: "Let's get to know each other better 😊 What's your name?" },
                               ]}
                               inputType={'text'}
                               stringInputPlaceholder={'Full Name'}
                            />)},
      {
        id: '3',
        scrollStyles: { scroll_styles: { backgroundImage: `url('https://connectassetmanagement.com/wp-content/uploads/2016/04/toronto-sunset-city-view.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.4)' } },
        component: (<MapSegment
                                title='Frequently Travelled'
                                schema={{ id: '3', endpoint: '4' }}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                texts={[
                                  { id: '0-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: `Nice to meet you ${this.state.data.name} 🤝 Where do you commute to most often? I'll find rentals close to it.` }
                                ]}
                             /> )},
      {
        id: '4',
        scrollStyles: { scroll_styles: { backgroundImage: `url('https://i.ytimg.com/vi/FqOAKHzVpaw/maxresdefault.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
        component: (<MultiOptionsSegment
                                title='Travel Mode'
                                schema={{
                                  id: '4',
                                  endpoint: '5',
                                  choices: [
                                    { id: '4-1', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'DRIVING', value: 'DRIVING', endpoint: '5' },
                                    { id: '4-2', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'TRANSIT', value: 'TRANSIT', endpoint: '5' },
                                    { id: '4-3', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'WALKING', value: 'WALKING', endpoint: '5' },
                                    { id: '4-4', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'BICYCLING', value: 'BICYCLING', endpoint: '5' }
                                  ]
                                }}
                                texts={[
                                  { id: '4-1', scrollDown: true, text: 'What is your primary means of transportation?' },
                                ]}
                                onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                             />) },
       {
         id: '5',
         scrollStyles: { scroll_styles: { backgroundImage: `url('https://byba.co.uk/wp-content/uploads/bella-london-concrete-lazio.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.6)' } },
         component: (<CounterSegment
                                 title='Group Size'
                                 schema={{ id: '5', endpoint: '6' }}
                                 triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                 onDone={(original_id, endpoint, data) => this.donePersons(original_id, endpoint, data)}
                                 texts={[
                                   { id: '0-1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'And how many people are looking for a rental? 🙋 Just you, or more?' },
                                   { id: '0-2', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: `It's ok if you're not sure. We can get less specific later.` }
                                 ]}
                                 incrementerOptions={{
                                   max: 7,
                                   min: 1,
                                   step: 1
                                 }}
                              /> )},
      {
        id: '6',
        scrollStyles: { scroll_styles: { backgroundImage: `url('http://www.globexdevelopments.com/Custom-Homes-Photo-Portfolio/14-Casa/big/Hallway-EntryDoor.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.4)' } },
        component: (<MultiOptionsSegment
                                title='Suites or Rooms'
                                schema={{
                                  id: '6',
                                  endpoint: '7',
                                  choices: [
                                    { id: '6-1', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'ENTIRE PLACE', value: 'entireplace', endpoint: '7', tooltip: (<p>An entire place means you have no random roommates, just the people in your group.</p>) },
                                    { id: '6-2', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'JUST ROOMS', value: 'rooms', endpoint: '7', tooltip: (<p>Rooms mean you are willing to have new random roommates. Often for a cheaper rent, as the whole place can be expensive.</p>) }
                                  ]
                                }}
                                texts={[
                                  { id: '6-1', scrollDown: true, text: `And are you looking to rent an entire place, or just ${this.state.data.group_size} rooms (possibly with other new roommates)?` },
                                ]}
                                onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                             />) },
     {
       id: '7',
       scrollStyles: { scroll_styles: { backgroundImage: `url('https://i.ytimg.com/vi/yzWqIH9NBZE/maxresdefault.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
       component: (<CounterSegment
                               title='Budget Per Person'
                               schema={{ id: '7', endpoint: '8' }}
                               triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                               onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                               texts={[
                                 { id: '7-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'What is your ideal budget per person? 💵' }
                               ]}
                               incrementerOptions={{
                                 max: 3000,
                                 min: 300,
                                 step: 25,
                                 default: 1000,
                               }}
                               slider
                               sliderOptions={{
                                 min: 300,
                                 max: 3000,
                                 step: 50,
                                 vertical: false,
                               }}
                               renderCountValue={(count) => `$ ${count}`}
                            /> )},
     {
       id: '8',
       scrollStyles: { scroll_styles: { backgroundImage: `url('https://s3.amazonaws.com/renthero-public-assets/images/Screen+Shot+2018-12-05+at+11.05.09+PM.png')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
       component: (<ActionSegment
                               title='FINISH'
                               schema={{
                                 id: '8',
                                 endpoint: null,
                                 choices: [
                                   { id: 'ok', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'VIEW MATCHES', value: 'abort', endpoint: '/matches' },
                                 ]
                               }}
                               texts={[
                                 { id: '1-1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: `And that's it! Ready to see your matches? 👀` },
                                 { id: '1-2', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: `( By the way, these aren't your matches. That part isn't hooked up yet 😅 )` }
                               ]}
                               triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                               onDone={(original_id, endpoint, data) => this.action(original_id, endpoint, data)}
                             />) },
    ]
    this.setState({ lastUpdated: moment().unix() })
  }

  doneName(original_id, endpoint, data) {
    this.setState({
      data: {
        ...this.state.data,
        name: data.input_string
      }
    }, () => this.done(original_id, endpoint, data))
  }

  donePersons(original_id, endpoint, data) {
    this.setState({
      data: {
        ...this.state.data,
        group_size: data.count
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
			<div id='OnboardingDialog' onClick={() => this.props.toggleInstantCharsSegmentID(this.shown_segments[this.shown_segments.length - 1].id)} style={comStyles().container}>
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
OnboardingDialog.propTypes = {
	history: PropTypes.object.isRequired,
  toggleInstantCharsSegmentID: PropTypes.func.isRequired,
}

// for all optional props, define a default value
OnboardingDialog.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(OnboardingDialog)

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
