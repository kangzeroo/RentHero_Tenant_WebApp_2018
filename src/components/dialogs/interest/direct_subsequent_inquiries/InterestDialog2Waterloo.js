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
import auth0 from 'auth0-js'
import { saveTenantPreferences } from '../../../../api/prefs/prefs_api'
import { updatePreferences } from '../../../../actions/prefs/prefs_actions'
import { toggleInstantCharsSegmentID } from '../../../../actions/app/app_actions'
import { getCurrentListingByReference } from '../../../../api/listings/listings_api'
import { setCurrentListing } from '../../../../actions/listings/listings_actions'
import SegmentTemplate from '../../../modules/AdvisorUI_v2/Segments/SegmentTemplate'
import MapSegment from '../../../modules/AdvisorUI_v2/Segments/MapSegment'
import CounterSegment from '../../../modules/AdvisorUI_v2/Segments/CounterSegment'
import MultiOptionsSegment from '../../../modules/AdvisorUI_v2/Segments/MultiOptionsSegment'
import MultiInputSegment from '../../../modules/AdvisorUI_v2/Segments/MultiInputSegment'
import DatePickerSegment from '../../../modules/AdvisorUI_v2/Segments/DatePickerSegment'
import DateRangeSegment from '../../../modules/AdvisorUI_v2/Segments/DateRangeSegment'
import InputSegment from '../../../modules/AdvisorUI_v2/Segments/InputSegment'
import MessageSegment from '../../../modules/AdvisorUI_v2/Segments/MessageSegment'
import PhoneOrEmailRegister from '../../../modules/AdvisorUI_v2/Segments/PhoneOrEmailRegister'
import VerifyCodeSegment from '../../../modules/AdvisorUI_v2/Segments/VerifyCodeSegment'
import ActionSegment from '../../../modules/AdvisorUI_v2/Segments/ActionSegment'
import FileUploadSegment from '../../../modules/AdvisorUI_v2/Segments/FileUploadSegment'
import ShareUrlSegment from '../../../modules/AdvisorUI_v2/Segments/ShareUrlSegment'
import { PASSWORDLESS_LOGIN_REDIRECT, AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '../../../../api/ENV_CREDs'
import { verifyPhone } from '../../../../api/phone/phone_api'
import { ACCENT_COLOR, FONT_COLOR, BACKGROUND_COLOR, BACKGROUND_WEBKIT, BACKGROUND_MODERN, FONT_FAMILY, FONT_FAMILY_ACCENT } from '../../../modules/AdvisorUI_v2/styles/advisor_ui_styles'


class InterestDialog2Waterloo extends Component {

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
      },
      premessages: [
        // { segment_id: 'someSegment', texts: [{ id, textStyles, delay, scrollDown, text, component }] }
      ],
      chosen_action_endpoint: '',
    }
    this.all_segments = []
    this.shown_segments = []
  }

  componentWillMount() {
    this.rehydrateSegments()
    this.shown_segments = this.shown_segments.concat(this.all_segments.slice(0, 1))
    this.setState({
      lastUpdated: moment().unix(),
      scrollStyles: {
        ...this.state.scrollStyles,
        ...this.props.scrollStyles
      }
    })
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
          id: 'message_to_seller',
          // scrollStyles: { scroll_styles: { backgroundImage: `url('http://www.gohaus.com/wp-content/uploads/2015/12/living-room-floor-design-ideas.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.6)' } },
          component: (<InputSegment
                                title='Message Seller'
                                schema={{ id: 'message_to_seller', endpoint: 'finish' }}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                onDone={(original_id, endpoint, data) => this.messageToSeller(original_id, endpoint, data)}
                                texts={[
                                  ...this.addAnyPreMessages('message_to_seller'),
                                  { id: '0-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: "What would you like to tell the seller?" },
                                  { id: '0-2', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: "Please include times you are available to tour." },
                                ]}
                                initialData={{
                                  input_string: localStorage.getItem('message_to_seller') || ''
                                }}
                                inputType={'textarea'}
                             />)},
      {
        id: 'redirect',
        component: (<ActionSegment
                     title='SEE ORIGINAL'
                     schema={{
                       id: 'redirect',
                       endpoint: null,
                       choices: [
                         { id: 'see_matches', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'SEE ORIGINAL', value: 'abort', endpoint: null },
                       ]
                     }}
                     texts={[
                       ...this.addAnyPreMessages('redirect'),
                       { id: '1', scrollDown: true, text: `Oh no, this seller did not provide a phone number, but you can still contact them directly via the original ad.` }
                     ]}
                     triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                     onDone={(original_id, endpoint, data) => this.seeOriginal(original_id, endpoint, data)}
                   />) },
      {
        id: 'finish',
        component: (<ActionSegment
                     title='DONE'
                     schema={{
                       id: 'finish',
                       endpoint: null,
                       choices: [
                         { id: 'see_matches', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Finish', value: 'abort', endpoint: null },
                       ]
                     }}
                     texts={[
                       ...this.addAnyPreMessages('see_matches'),
                       { id: '1', scrollDown: true, text: `Message Sent! You have been connected via SMS and email.` }
                     ]}
                     triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                     onDone={(original_id, endpoint, data) => this.doneAll(original_id, endpoint, data)}
                   />) },
    ]
    this.setState({ lastUpdated: moment().unix() })
  }

  doneAll(original_id, endpoint, data) {
    this.props.closeModal()
  }

  doneEducationalBackground(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    saveTenantPreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.FINANCIALS.KEY,
      STUDIED_AS: data.inputs.map(s => s.text).join(', '),
      STUDIED_AS_SCHEMAS: data.inputs.map(s => {
        return {
          id: s.id,
          text: s.text,
          value: s.value
        }
      }),
    }).then((FINANCIALS) => {
      this.props.updatePreferences(FINANCIALS)
    }).catch((err) => {
      console.log(err)
    })
  }

  messageToSeller(original_id, endpoint, data) {
    if (this.props.current_listing.PHONE && this.props.current_listing.PHONE !== 'none') {
      this.done(original_id, endpoint, data)
    } else {
      this.done(original_id, 'redirect', data)
    }
    localStorage.setItem('message_to_seller', data.input_string)
    console.log(data.input_string)
  }

  getNextSegment(original_id, endpoint, data) {
    console.log(data)
    console.log(this.props.prefs.FINANCIALS.EMPLOYED_AS_SCHEMAS.filter(sch => sch.endpoint).map(sch => sch.endpoint))
    console.log(this.shown_segments.map(seg => seg.id))
    let nextEndpoint = endpoint
    this.props.prefs.FINANCIALS.EMPLOYED_AS_SCHEMAS.filter(sch => sch.endpoint).forEach((sch) => {
      let doneAlready = false
      this.shown_segments.forEach((seg) => {
        if (seg.id === sch.endpoint) {
          doneAlready = true
        }
      })
      if (!doneAlready) {
        let exists = false
        this.all_segments.forEach((seg) => {
          if (seg.id === sch.endpoint) {
            exists = true
          }
        })
        if (exists) {
          nextEndpoint = sch.endpoint
        }
      }
    })
    console.log(nextEndpoint)
    return nextEndpoint
  }

  mergeLists(list1, list2) {
    const trimmedList2 = [].concat(list2)
    list1.forEach((item1) => {
      let exists = false
      list2.forEach((item2) => {
        if (item1.id === item2.id) {
          exists = true
        }
      })
      if (!exists) {
        trimmedList2.push(item1)
      }
    })
    return trimmedList2
  }

  doneDisclaimer(original_id, endpoint, data) {
    const nextEndpoint = this.getNextSegment(original_id, endpoint, data)
    if (nextEndpoint && nextEndpoint !== original_id) {
      this.done(original_id, nextEndpoint, data)
    } else {
      this.done(original_id, endpoint, data)
    }
  }

  doneGuarantors(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    saveTenantPreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.FINANCIALS.KEY,
      GUARANTOR_STATUS_AS: data.selected_choices.map(s => s.text).join(', '),
      GUARANTOR_STATUS_AS_SCHEMAS: data.selected_choices.map(s => {
        return {
          id: s.id,
          text: s.text,
          value: s.value
        }
      }),
    }).then((FINANCIALS) => {
      this.props.updatePreferences(FINANCIALS)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneInterest(original_id, endpoint, data) {
    this.setState({
      chosen_action_endpoint: endpoint
    })
    if (this.props.tenant_profile.authenticated) {
      // if logged in and yes phone
      this.done(original_id, 'educational_background', data)
    } else {
      // if logged in but no phone
      this.done(original_id, 'phone', data)
    }
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
    const self = this
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
      if (err) {
        console.log(err)
      } else {
        console.log(res)
        self.done(original_id, endpoint, data)
      }
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
			<div id='InterestDialog2Waterloo' onClick={() => this.props.toggleInstantCharsSegmentID(this.shown_segments[this.shown_segments.length - 1].id)} style={comStyles().container}>
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
InterestDialog2Waterloo.propTypes = {
	history: PropTypes.object.isRequired,
  toggleInstantCharsSegmentID: PropTypes.func.isRequired,
  prefs: PropTypes.object.isRequired,
  updatePreferences: PropTypes.func.isRequired,
  tenant_id: PropTypes.string.isRequired,
  setCurrentListing: PropTypes.func.isRequired,
  current_listing: PropTypes.object.isRequired,
  tenant_profile: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,          // passed in
}

// for all optional props, define a default value
InterestDialog2Waterloo.defaultProps = {
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(InterestDialog2Waterloo)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    prefs: redux.prefs,
    tenant_profile: redux.auth.tenant_profile,
    tenant_id: redux.auth.tenant_profile.tenant_id,
    current_listing: redux.listings.current_listing,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    toggleInstantCharsSegmentID,
    updatePreferences,
    setCurrentListing,
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
      // position: 'fixed',
			bottom: '0px',
      width: '100%',
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
