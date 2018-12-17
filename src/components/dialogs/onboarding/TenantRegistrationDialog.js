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
import PhoneOrEmailRegister from '../../modules/AdvisorUI_v2/Segments/PhoneOrEmailRegister'
import MapSegment from '../../modules/AdvisorUI_v2/Segments/MapSegment'
import CounterSegment from '../../modules/AdvisorUI_v2/Segments/CounterSegment'
import MultiOptionsSegment from '../../modules/AdvisorUI_v2/Segments/MultiOptionsSegment'
import VerifyCodeSegment from '../../modules/AdvisorUI_v2/Segments/VerifyCodeSegment'
import { Progress } from 'antd'
import {
  Icon,
} from 'antd-mobile'
import {
  message,
} from 'antd'
import { toggleInstantCharsSegmentID } from '../../../actions/app/app_actions'
import { ACCENT_COLOR, FONT_COLOR, BACKGROUND_COLOR, BACKGROUND_WEBKIT, BACKGROUND_MODERN, FONT_FAMILY, FONT_FAMILY_ACCENT } from '../../modules/AdvisorUI_v2/styles/advisor_ui_styles'
import { PASSWORDLESS_LOGIN_REDIRECT, AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '../../../api/ENV_CREDs'
import { verifyPhone } from '../../../api/phone/phone_api'
import auth0 from 'auth0-js'

class TenantRegistrationDialoag extends Component {

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
      email: '',
      register_option: '',
    }
    this.all_segments = []
    this.shown_segments = []
    this.lastScrollTop = 0
  }

  componentWillMount() {
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

  // {
  //   id: '1',
  //   component: (<MessageSegment
  //                          schema={{ id: '1', endpoint: '2' }}
  //                          triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
  //                          onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
  //                          texts={[
  //                            ...this.addAnyPreMessages('1'),
  //                            { id: '0-1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, containerStyles: { margin: '30px 0px 0px 20px' }, text: 'Hello 👋 My name is RentHero' },
  //                            { id: '0-2', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: `I'm an A.I. real estate agent here to help you find your next home! Here's what I can do for you:` },
  //                            { id: '0-3', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY, margin: '10px 0px 5px 0px', textAlign: 'center' }, text: `🔍 Browse Online Rentals` },
  //                            { id: '0-4', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY, margin: '5px 0px 5px 0px', textAlign: 'center' }, text: `👆 Narrow Your Selection` },
  //                            { id: '0-5', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY, margin: '5px 0px 10px 0px', textAlign: 'center' }, text: `📜 Handle The Paperwork` },
  //                            { id: '0-6', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: `Ready to get started? 🤓` },
  //                          ]}
  //                          action={{ enabled: true, label: 'Get Started', actionStyles: { width: '100%' } }}
  //                          segmentStyles={{ justifyContent: 'space-between' }}
  //                        />) },

  rehydrateSegments() {
    this.all_segments = [
       {
         id: '1',
         scrollStyles: { scroll_styles: { backgroundImage: `url('http://www.gohaus.com/wp-content/uploads/2015/12/living-room-floor-design-ideas.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.6)' } },
         component: (<PhoneOrEmailRegister
                                 title='Registration'
                                 schema={{ id: '1', endpoint: '2' }}
                                 triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                 onDone={(original_id, endpoint, data) => this.doneRegister(original_id, endpoint, data)}
                                 texts={[
                                   ...this.addAnyPreMessages('1'),
                                   { id: '0-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: "My Number is" },
                                 ]}
                                 inputType={'tel'}
                                 initialData={{
                                   input_string: this.props.prefs.DOCUMENTS.PREFERRED_NAME
                                 }}
                                 skippable={true}
                                 skipEndpoint={'3'}
                              />)},
      {
        id: '2',
        scrollStyles: { scroll_styles: { backgroundImage: `url('http://www.gohaus.com/wp-content/uploads/2015/12/living-room-floor-design-ideas.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.6)' } },
        component: (<VerifyCodeSegment
                                title='Verification'
                                schema={{ id: '2', endpoint: '3' }}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                onDone={(original_id, endpoint, data) => this.doneVerify(original_id, endpoint, data)}
                                texts={[
                                  ...this.addAnyPreMessages('2'),
                                  { id: '0-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: "My Code is" },
                                ]}
                                inputType={'number'}
                                stringInputPlaceholder={'Verification Code'}
                                initialData={{
                                  // input_string: this.props.prefs.DOCUMENTS.PREFERRED_NAME
                                }}
                                resendCode={() => this.resendCode()}
                             />)},
    ]
    this.setState({ lastUpdated: moment().unix() })
  }

  doneRegister(original_id, endpoint, data) {
    // this.done(original_id, endpoint, data)
    const self = this
    const webAuth = new auth0.WebAuth({
       domain:       AUTH0_DOMAIN,
       clientID:     AUTH0_CLIENT_ID,
       responseType: 'token id_token'
    })

    if (data.register_option === 'phone') {
      verifyPhone(data.input_string)
        .then((data) => {
          console.log(data)
          localStorage.setItem('phone', JSON.stringify(data))
          self.setState({
            phone: data.phoneNumber,
            register_option: data.register_option,
          })
          webAuth.passwordlessStart({
            connection: 'sms',
            send: 'code',
            phoneNumber: data.phoneNumber
          }, function (err,res) {
            console.log(err)
            console.log(res)
            self.done(original_id, endpoint, data)
            // handle errors or continue
          })
        })
        .catch((err) => {
          console.log(err)
          message.error('Invalid Phone Number')
        })
    } else {
      const email = data.input_string
      self.setState({
        email: data.input_string,
        register_option: data.register_option,
      })
      localStorage.setItem('email', data.input_string)
      // Send a link using email
       webAuth.passwordlessStart({
           connection: 'email',
           send: 'link',
           email: email,
         }, function (err,res) {
           if (err) {
             console.log(err)
           }
           console.log(res)
           self.props.history.push('/verifyingemail')
           // self.done(original_id, endpoint, data)
         }
       )
    }
  }

  doneVerify(original_id, endpoint, data) {
    // this.done(original_id, endpoint, data)
    const webAuth = new auth0.WebAuth({
       domain:       AUTH0_DOMAIN,
       clientID:     AUTH0_CLIENT_ID,
       responseType: 'token id_token',
       redirectUri: PASSWORDLESS_LOGIN_REDIRECT
    })

    webAuth.passwordlessLogin({
      connection: 'sms',
      phoneNumber: this.state.phone,
      verificationCode: data.input_string
    }, function (err,res) {
      // handle errors or continue
      console.log(err)
      console.log(res)
    })
  }

  resendCode() {
    const webAuth = new auth0.WebAuth({
       domain:       AUTH0_DOMAIN,
       clientID:     AUTH0_CLIENT_ID,
       responseType: 'token id_token'
    })

    webAuth.passwordlessStart({
      connection: 'sms',
      send: 'code',
      phoneNumber: this.state.phone,
    }, function (err,res) {
      console.log(err)
      console.log(res)
    })
  }


  doneName(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    saveTenantPreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.DOCUMENTS.KEY,
      PREFERRED_NAME: data.input_string,
    }).then((DOCUMENTS) => {
      console.log(DOCUMENTS)
      this.props.updatePreferences(DOCUMENTS)
    }).catch((err) => {
      console.log(err)
    })
  }

  mapDone(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    saveTenantPreferences({
      TENANT_ID: this.props.tenant_id,
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
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.LOCATION.KEY,
      TRANSPORT_MODES_AS: data.selected_choices.map(s => s.text).join(', '),
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
      TENANT_ID: this.props.tenant_id,
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
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.GROUP.KEY,
      WHOLE_OR_RANDOM_AS: data.selected_choices.map(s => s.text).join(', '),
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
      TENANT_ID: this.props.tenant_id,
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
			<div id='TenantRegistrationDialoag' onClick={() => this.props.toggleInstantCharsSegmentID(this.shown_segments[this.shown_segments.length - 1].id)} style={comStyles(this.props.width).container}>
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
TenantRegistrationDialoag.propTypes = {
	history: PropTypes.object.isRequired,
  toggleInstantCharsSegmentID: PropTypes.func.isRequired,
  updatePreferences: PropTypes.func.isRequired,
  prefs: PropTypes.object.isRequired,
  tenant_id: PropTypes.string.isRequired,
  width: PropTypes.string,                  // passed in
}

// for all optional props, define a default value
TenantRegistrationDialoag.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(TenantRegistrationDialoag)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    prefs: redux.prefs,
    tenant_id: redux.auth.tenant_profile.tenant_id,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    toggleInstantCharsSegmentID,
    updatePreferences,
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
