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
import { updatePreferences } from '../../../actions/prefs/prefs_actions'
import { saveTenantPreferences } from '../../../api/prefs/prefs_api'
import MessageSegment from '../../modules/AdvisorUI_v2/Segments/MessageSegment'
import ActionSegment from '../../modules/AdvisorUI_v2/Segments/ActionSegment'
import InputSegment from '../../modules/AdvisorUI_v2/Segments/InputSegment'
import MapSegment from '../../modules/AdvisorUI_v2/Segments/MapSegment'
import CounterSegment from '../../modules/AdvisorUI_v2/Segments/CounterSegment'
import MultiOptionsSegment from '../../modules/AdvisorUI_v2/Segments/MultiOptionsSegment'
import { Progress } from 'antd'
import {
  Icon,
} from 'antd-mobile'
import { toggleInstantCharsSegmentID } from '../../../actions/app/app_actions'
import { updateTenantName } from '../../../api/tenant/tenant_api'
import { saveTenantProfileToRedux } from '../../../actions/auth/auth_actions'
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
      premessages: [
        // { segment_id: 'someSegment', texts: [{ id, textStyles, delay, scrollDown, text, component }] }
      ],
      show_progress: false,
      progress_percent: 0,
      phone: '',
      first_name: '',
    }
    this.all_segments = []
    this.shown_segments = []
    this.lastScrollTop = 0
  }

  componentWillMount() {
    this.retrieveTenantFromLocalStorage()
    this.rehydrateSegments()
    this.shown_segments = this.shown_segments.concat(this.all_segments.slice(0, 1))
    this.setState({ lastUpdated: moment().unix() })
  }

  componentDidMount() {
    const scrollable = document.getElementById('scrollable')
    if (scrollable) {
      scrollable.addEventListener("scroll", () => { // or window.addEventListener("scroll"....
         const st = scrollable.scrollTop
         if (st > this.lastScrollTop){
            this.setState({
              show_progress: false
            })
         } else {
            this.setState({
              show_progress: true
            })
         }
         this.lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
      }, false);
    }
  }

  retrieveTenantFromLocalStorage() {
    if (this.props.tenant_profile && this.props.tenant_profile.tenant_id) {
      console.log('TENANT PROFILE EXISTS... MOVING ON')
    } else {
      const tenant_id = localStorage.getItem('tenant_id')
      if (tenant_id) {
        this.props.saveTenantProfileToRedux({
          tenant_id: tenant_id,
          authenticated: false,
        })
      } else {
        console.log('NO TENANT ID')
      }
    }
  }

  addAnyPreMessages(segment_id) {
    const prem = this.state.premessages.filter((pre) => {
      return pre.segment_id === segment_id
    })[0]
    if (prem && prem.texts) {
      return prem.texts
    } else {
      return []
    }
  }

  rehydrateSegments() {
    this.all_segments = [
     {
       id: '1',
       comment: 'whats your name',
       scrollStyles: { scroll_styles: { backgroundImage: `url('http://www.gohaus.com/wp-content/uploads/2015/12/living-room-floor-design-ideas.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.6)' } },
       component: (<InputSegment
                               title='Introductions'
                               schema={{ id: '1', endpoint: '2' }}
                               triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                               onDone={(original_id, endpoint, data) => this.doneName(original_id, endpoint, data)}
                               texts={[
                                 ...this.addAnyPreMessages('1'),
                                 { id: '0-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: "Let's get to know each other better 😊 What's your name?" },
                               ]}
                               inputType={'text'}
                               stringInputPlaceholder={'First Name'}
                               initialData={{
                                 input_string: this.props.prefs.DOCUMENTS.PREFERRED_NAME
                               }}
                            />)},
      {
        id: '2',
        comment: 'whats your destination',
        scrollStyles: { scroll_styles: { backgroundImage: `url('https://connectassetmanagement.com/wp-content/uploads/2016/04/toronto-sunset-city-view.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.4)' } },
        component: (<MapSegment
                                title='Frequently Travelled'
                                schema={{ id: '2', endpoint: '3' }}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                onDone={(original_id, endpoint, data) => this.mapDone(original_id, endpoint, data)}
                                texts={[
                                  ...this.addAnyPreMessages('2'),
                                  { id: '0-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: `Nice to meet you ${this.state.first_name} 🤝 Where do you commute to most often? I'll find rentals close to it.` }
                                ]}
                                initialData={{
                                  address_components: [],
                                  address_lat: this.props.prefs.LOCATION.DESTINATION_GEOPOINT.split(',')[0],
                                  address_lng: this.props.prefs.LOCATION.DESTINATION_GEOPOINT.split(',')[1],
                                  address_place_id: '',
                                  address: this.props.prefs.LOCATION.DESTINATION_ADDRESS,
                                }}
                             /> )},
      {
        id: '3',
        comment: 'how do you travel? bus, drive...etc',
        scrollStyles: { scroll_styles: { backgroundImage: `url('https://i.ytimg.com/vi/FqOAKHzVpaw/maxresdefault.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
        component: (<MultiOptionsSegment
                                title='Travel Mode'
                                schema={{
                                  id: '3',
                                  endpoint: '4',
                                  choices: [
                                    { id: '4-1', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'DRIVING', value: false, endpoint: '5' },
                                    { id: '4-2', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'TRANSIT', value: false, endpoint: '5' },
                                    { id: '4-3', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'WALKING', value: false, endpoint: '5' },
                                    { id: '4-4', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'BICYCLING', value: false, endpoint: '5' }
                                  ]
                                }}
                                texts={[
                                  ...this.addAnyPreMessages('3'),
                                  { id: '4-1', scrollDown: true, text: 'What is your primary means of transportation?' },
                                ]}
                                onDone={(original_id, endpoint, data) => this.travelModeDone(original_id, endpoint, data)}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                preselected={this.props.prefs.LOCATION.TRANSPORT_MODES_AS_SCHEMAS}
                             />) },
       {
         id: '4',
         comment: 'how big is your group?',
         scrollStyles: { scroll_styles: { backgroundImage: `url('https://byba.co.uk/wp-content/uploads/bella-london-concrete-lazio.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.6)' } },
         component: (<CounterSegment
                                 title='Group Size'
                                 schema={{ id: '4', endpoint: '5' }}
                                 triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                 onDone={(original_id, endpoint, data) => this.doneGroupSize(original_id, endpoint, data)}
                                 texts={[
                                   ...this.addAnyPreMessages('4'),
                                   { id: '0-1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'And how many people are looking for a rental? 🙋 Just you, or more?' },
                                   { id: '0-2', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: `It's ok if you're not sure. We can get less specific later.` }
                                 ]}
                                 incrementerOptions={{
                                   max: 7,
                                   min: 1,
                                   step: 1
                                 }}
                                 initialData={{
                                   count: parseFloat(this.props.prefs.GROUP.CERTAIN_MEMBERS)
                                 }}
                              /> )},
      {
        id: '5',
        comment: 'do you want suites or rooms?',
        scrollStyles: { scroll_styles: { backgroundImage: `url('http://www.globexdevelopments.com/Custom-Homes-Photo-Portfolio/14-Casa/big/Hallway-EntryDoor.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.4)' } },
        component: (<MultiOptionsSegment
                                title='Suites or Rooms'
                                schema={{
                                  id: '5',
                                  endpoint: '6',
                                  choices: [
                                    { id: 'entire_place', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'ENTIRE PLACE', value: false, endpoint: '6', tooltip: (<p>An entire place means you have no random roommates, just the people in your group.</p>) },
                                    { id: 'just_rooms', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'JUST ROOMS', value: false, endpoint: '6', tooltip: (<p>Rooms mean you are willing to have new random roommates. Often for a cheaper rent, as the whole place can be expensive.</p>) },
                                    { id: 'both_place_rooms', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'BOTH', value: false, endpoint: '6', tooltip: (<p>You are open to entire units and random roommates.</p>) },
                                  ]
                                }}
                                texts={[
                                  ...this.addAnyPreMessages('5'),
                                  { id: '6-1', scrollDown: true, text: `And are you looking to rent an entire place, or just ${this.props.prefs.GROUP.CERTAIN_MEMBERS} rooms (possibly with other new roommates)?` },
                                ]}
                                onDone={(original_id, endpoint, data) => this.suitesRoomsDone(original_id, endpoint, data)}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                preselected={this.props.prefs.GROUP.WHOLE_OR_RANDOMS_AS_SCHEMAS}
                             />) },
     {
       id: '6',
       comment: 'whast your budget per person?',
       scrollStyles: { scroll_styles: { backgroundImage: `url('https://i.ytimg.com/vi/yzWqIH9NBZE/maxresdefault.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
       component: (<CounterSegment
                               title='Budget Per Person'
                               schema={{ id: '6', endpoint: '7' }}
                               triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                               onDone={(original_id, endpoint, data) => this.budgetDone(original_id, endpoint, data)}
                               texts={[
                                 ...this.addAnyPreMessages('6'),
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
                               initialData={{
                                 count: this.props.prefs.FINANCIALS.IDEAL_PER_PERSON
                               }}
                            /> )},
     {
       id: '7',
       scrollStyles: { scroll_styles: { backgroundImage: `url('https://s3.amazonaws.com/renthero-public-assets/images/Screen+Shot+2018-12-05+at+11.05.09+PM.png')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
       component: (<ActionSegment
                               title='FINISH'
                               schema={{
                                 id: '7',
                                 endpoint: null,
                                 choices: [
                                   { id: 'ok', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'VIEW MATCHES', value: 'abort', endpoint: '/matches' },
                                 ]
                               }}
                               texts={[
                                 ...this.addAnyPreMessages('7'),
                                 { id: '1-1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: `And that's it! Ready to see your matches? 👀` },
                               ]}
                               triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                               onDone={(original_id, endpoint, data) => this.action(original_id, endpoint, data)}
                             />) },
    ]
    this.setState({ lastUpdated: moment().unix() })
  }

  doneName(original_id, endpoint, data) {
    const first_name = data.input_string
    this.setState({
      first_name: first_name,
    }, () => this.done(original_id, endpoint, data))

    updateTenantName({
      tenant_id: this.props.tenant_profile.tenant_id,
      first_name: first_name,
      authenticated: this.props.tenant_profile.authenticated ? this.props.tenant_profile.authenticated : null,
    })
    .then((data) => {
      console.log(data)
      return this.props.saveTenantProfileToRedux(data.tenant)
    })
    .then((data) => {
      return saveTenantPreferences({
              TENANT_ID: this.props.tenant_profile.tenant_id,
              KEY: this.props.prefs.DOCUMENTS.KEY,
              PREFERRED_NAME: first_name,
              })
    }).then((DOCUMENTS) => {
      console.log(DOCUMENTS)
      this.props.updatePreferences(DOCUMENTS)
    }).catch((err) => {
      console.log(err)
    })
  }

  mapDone(original_id, endpoint, data) {
    console.log(data)
    this.done(original_id, endpoint, data)
    saveTenantPreferences({
      TENANT_ID: this.props.tenant_profile.tenant_id,
      KEY: this.props.prefs.LOCATION.KEY,
      DESTINATION_ADDRESS: data.address,
      DESTINATION_GEOPOINT: `${data.address_lat},${data.address_lng}`
    }).then((LOCATION) => {
      console.log(LOCATION)
      this.props.updatePreferences(LOCATION)
    }).catch((err) => {
      console.log(err)
    })
  }

  travelModeDone(original_id, endpoint, data) {
    console.log(data)
    this.done(original_id, endpoint, data)
    saveTenantPreferences({
      TENANT_ID: this.props.tenant_profile.tenant_id,
      KEY: this.props.prefs.LOCATION.KEY,
      TRANSPORT_MODES_AS: data.selected_choices.map(s => s.text),
      TRANSPORT_MODES_AS_SCHEMAS: data.selected_choices.map(s => {
        return {
          id: s.id,
          text: s.text,
          value: s.value
        }
      })
    }).then((LOCATION) => {
      this.props.updatePreferences(LOCATION)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneGroupSize(original_id, endpoint, data) {
    console.log(data)
    this.done(original_id, endpoint, data)
    saveTenantPreferences({
      TENANT_ID: this.props.tenant_profile.tenant_id,
      KEY: this.props.prefs.GROUP.KEY,
      CERTAIN_MEMBERS: data.count,
      UNCERTAIN_MEMBERS: data.count
    }).then((GROUP) => {
      this.props.updatePreferences(GROUP)
    }).catch((err) => {
      console.log(err)
    })
  }

  suitesRoomsDone(original_id, endpoint, data) {
    console.log(data)
    this.done(original_id, endpoint, data)
    saveTenantPreferences({
      TENANT_ID: this.props.tenant_profile.tenant_id,
      KEY: this.props.prefs.GROUP.KEY,
      WHOLE_OR_RANDOM_AS: data.selected_choices.map(s => s.text),
      WHOLE_OR_RANDOMS_AS_SCHEMAS: data.selected_choices.map(s => {
        return {
          id: s.id,
          text: s.text,
          value: s.value
        }
      })
    }).then((GROUP) => {
      this.props.updatePreferences(GROUP)
    }).catch((err) => {
      console.log(err)
    })
  }

  budgetDone(original_id, endpoint, data) {
    console.log(data)
    this.done(original_id, endpoint, data)
    saveTenantPreferences({
      TENANT_ID: this.props.tenant_profile.tenant_id,
      KEY: this.props.prefs.FINANCIALS.KEY,
      IDEAL_PER_PERSON: data.count,
    }).then((FINANCIALS) => {
      this.props.updatePreferences(FINANCIALS)
    }).catch((err) => {
      console.log(err)
    })
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
          this.setState({ lastUpdated: moment().unix() }, () => {
            this.redrawContainer()
          })
        }, 700)
      })
    }
  }

  calcProgress() {
    return this.shown_segments.length/this.all_segments.length*100
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
    setTimeout(() => {
      this.setState({
        progress_percent: this.calcProgress(),
        show_progress: true
      })
      setTimeout(() => {
        this.setState({
          show_progress: false
        })
      }, 3000)
    }, duration + 250)
    // scroll down
    const prevScrollHeight = document.getElementById('containment').offsetHeight
    const screenHeight = document.documentElement.clientHeight
    const nextHeight = prevScrollHeight + screenHeight
    document.getElementById('containment').style.height = `${nextHeight}px`
    $('#scrollable').animate({
        scrollTop: prevScrollHeight
    }, duration);
    // change background image if applicable
    /*
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
    */
  }

	render() {
		return (
			<div id='OnboardingDialog' onClick={() => this.props.toggleInstantCharsSegmentID(this.shown_segments[this.shown_segments.length - 1].id)} style={comStyles(this.props.width).container}>
        <div id='scroll' style={scrollStyles(this.state.scrollStyles, this.props.width).scroll}>
          <div id='scrollable' style={scrollStyles(this.state.scrollStyles, this.props.width).scrollable}>
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
        {/*
          this.state.show_progress
          ?
          <Progress strokeColor='#2faded' percent={this.state.progress_percent} showInfo={false} style={{ position: 'fixed', bottom: '5px', width: '95%' }} />
          :
          null
        */}
			</div>
		)
	}
}

// defines the types of variables in this.props
OnboardingDialog.propTypes = {
	history: PropTypes.object.isRequired,
  toggleInstantCharsSegmentID: PropTypes.func.isRequired,
  updatePreferences: PropTypes.func.isRequired,
  prefs: PropTypes.object.isRequired,
  tenant_id: PropTypes.string.isRequired,
  width: PropTypes.string,                  // passed in
  tenant_profile: PropTypes.object.isRequired,
  saveTenantProfileToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
OnboardingDialog.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(OnboardingDialog)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    prefs: redux.prefs,
    tenant_id: redux.auth.tenant_profile.tenant_id,
    tenant_profile: redux.auth.tenant_profile,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    toggleInstantCharsSegmentID,
    updatePreferences,
    saveTenantProfileToRedux,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = (width) => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: width || '100%',
      justifyContent: 'flex-start',
      alignItems: 'center',
			background: BACKGROUND_COLOR,
		  background: BACKGROUND_WEBKIT,
		  background: BACKGROUND_MODERN
		},
	}
}

const scrollStyles = ({ scroll_styles, scrollable_styles }, width) => {
  return {
    scroll: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      position: 'fixed',
			bottom: '0px',
      width: width || '100%',
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
      width: width || '100%',
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
