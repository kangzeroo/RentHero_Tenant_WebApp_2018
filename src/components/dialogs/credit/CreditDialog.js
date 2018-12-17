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
import { saveTenantPreferences } from '../../../api/prefs/prefs_api'
import { updatePreferences } from '../../../actions/prefs/prefs_actions'
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


class CreditDialog extends Component {

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
      ]
    }
    this.all_segments = []
    this.shown_segments = []
  }

  componentWillMount() {
    this.rehydrateSegments()
    this.shown_segments = this.shown_segments.concat(this.all_segments.slice(0, 1))
    this.setState({ lastUpdated: moment().unix() })
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
        id: 'intro_to_credit',
        component: (<MessageSegment
                         schema={{ id: 'intro_to_credit', endpoint: 'ever_done_credit' }}
                         triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                         onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                         texts={[
                           { id: '1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, containerStyles: { margin: '30px 0px 0px 20px' }, text: `Let's talk about credit reports.` },
                           { id: '2', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: `Don't worry, this is short!` },
                         ]}
                         action={{ enabled: true, label: 'Begin', actionStyles: { width: '100%' } }}
                         segmentStyles={{ justifyContent: 'space-between' }}
                       />) },
         {
           id: 'ever_done_credit',
           component: (<MultiOptionsSegment
                 schema={{
                   id: 'ever_done_credit',
                   endpoint: 'past_credit_brand',
                   choices: [
                     { id: 'yes_recently', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Yes, recently', value: false, endpoint: 'past_credit_brand' },
                     { id: 'yes_but_forgot', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Yes, but I forgot', value: false, endpoint: 'past_credit_brand' },
                     { id: 'no_never', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'No, Never', value: false, endpoint: 'learn_more' },
                   ]
                 }}
                 texts={[
                   { id: '1', text: `Have you ever done a credit report ever?` },
                 ]}
                 preselected={this.props.prefs.CREDIT.PAST_CREDIT_EXP_AS_SCHEMAS}
                 onDone={(original_id, endpoint, data) => this.donePastCredit(original_id, endpoint, data)}
                 triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
              />) },
     {
       id: 'past_credit_brand',
       component: (<MultiOptionsSegment
             title='ABOUT CREDIT SCORES'
             schema={{
               id: 'past_credit_brand',
               endpoint: 'estimated_credit_score',
               choices: [
                 { id: 'canadian_report', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Canadian', value: false, endpoint: 'estimated_credit_score' },
                 { id: 'american_report', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'American', value: false, endpoint: 'estimated_credit_score' },
                 { id: 'uk_report', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'United Kingdom', value: false, endpoint: 'estimated_credit_score' },
                 { id: 'non_english_report', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Non-English', value: false, endpoint: 'estimated_credit_score' },
                 { id: 'none', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'None', value: false, endpoint: 'estimated_credit_score', tooltip: (<p>Including parents, children and elderly.</p>) },
               ]
             }}
             texts={[
               { id: '1', text: `A credit score is a measurement of how well you pay back your debts.` },
               { id: '2', text: `It is mandatory, all landlords expect it as security and reassurance.` },
               { id: '3', text: `A credit report is a detailed breakdown of what debts your have on record, and your payment history.` },
               { id: '4', text: `Have you ever gotten any of the below credit reports done before?` },
             ]}
             preselected={this.props.prefs.CREDIT.PAST_CREDIT_BRANDS_AS_SCHEMAS}
             onDone={(original_id, endpoint, data) => this.donePastBrands(original_id, endpoint, data)}
             triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
          />) },
    {
      id: 'estimated_credit_score',
      component: (<CounterSegment
                              title='ESTIMATED CREDIT SCORE'
                              schema={{ id: 'estimated_credit_score', endpoint: 'learn_more' }}
                              triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                              onDone={(original_id, endpoint, data) => this.doneEstimatingCredit(original_id, endpoint, data)}
                              texts={[
                                { id: '1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: `What is your credit score? It's ok to guess!` }
                              ]}
                              incrementerOptions={{
                                min: 500,
                                max: 900,
                                step: 20,
                                default: 650
                              }}
                              slider
                              sliderOptions={{
                                min: 500,
                                max: 900,
                                step: 20,
                                vertical: false,
                              }}
                              initialData={{
                                count: this.props.prefs.CREDIT.GUESSED_CREDIT_SCORE
                              }}
                           /> )},
  {
    id: 'learn_more',
    component: (<MultiOptionsSegment
          title='LEARN MORE'
          schema={{
            id: 'learn_more',
            endpoint: 'finish',
            choices: [
              { id: 'read_the_guide', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'DO IT NOW', value: false, endpoint: 'finish' },
              { id: 'skip_for_now', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'LATER', value: false, endpoint: 'finish' },
            ]
          }}
          texts={[
            { id: '1', text: `In Toronto, landlords only accept Equifax credit reports within the last 3 months.` },
            { id: '2', text: `Anyone in your group paying the rent needs to have one, as well as any guarantors.` },
            { id: '3', text: `Would you like to learn how to do your credit report now or later?.` },
          ]}
          onDone={(original_id, endpoint, data) => this.doneLearnMore(original_id, endpoint, data)}
          triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
       />) },
  {
    id: 'finish',
    component: (<ActionSegment
                 title='DONE'
                 schema={{
                   id: 'finish',
                   endpoint: null,
                   choices: [
                     { id: 'see_matches', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'View Matches', value: 'abort', endpoint: null },
                   ]
                 }}
                 texts={[
                   ...this.addAnyPreMessages('see_matches'),
                   { id: '1', scrollDown: true, text: `View Matches` }
                 ]}
                 triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                 onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
               />) },
    ]
    this.setState({ lastUpdated: moment().unix() })
  }

  donePastCredit(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    saveTenantPreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.CREDIT.KEY,
      PAST_CREDIT_EXP_AS: data.selected_choices.map(s => s.text).join(', '),
      PAST_CREDIT_EXP_AS_SCHEMAS: data.selected_choices.map(s => {
        return {
          id: s.id,
          text: s.text,
          value: s.value
        }
      }),
    }).then((CREDIT) => {
      this.props.updatePreferences(CREDIT)
    }).catch((err) => {
      console.log(err)
    })
  }

  donePastBrands(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    saveTenantPreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.CREDIT.KEY,
      PAST_CREDIT_BRANDS_AS: data.selected_choices.map(s => s.text).join(', '),
      PAST_CREDIT_BRANDS_AS_SCHEMAS: data.selected_choices.map(s => {
        return {
          id: s.id,
          text: s.text,
          value: s.value
        }
      }),
    }).then((CREDIT) => {
      this.props.updatePreferences(CREDIT)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneEstimatingCredit(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    saveTenantPreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.CREDIT.KEY,
      GUESSED_CREDIT_SCORE: data.count,
    }).then((CREDIT) => {
      this.props.updatePreferences(CREDIT)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneLearnMore(original_id, endpoint, data) {
    if (data.selected_choices.filter(s => s.id === 'read_the_guide').length) {
      window.open('https://renthero.fyi/rent-basics/how-to-do-credit-checks-as-tenants', '_blank')
      this.done(original_id, endpoint, data)
    } else if (data.selected_choices.filter(s => s.id === 'skip_for_now').length) {
      this.done(original_id, endpoint, data)
    }
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
			<div id='CreditDialog' onClick={() => this.props.toggleInstantCharsSegmentID(this.shown_segments[this.shown_segments.length - 1].id)} style={comStyles().container}>
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
CreditDialog.propTypes = {
	history: PropTypes.object.isRequired,
  toggleInstantCharsSegmentID: PropTypes.func.isRequired,
  prefs: PropTypes.object.isRequired,
  updatePreferences: PropTypes.func.isRequired,
  tenant_id: PropTypes.string.isRequired,
}

// for all optional props, define a default value
CreditDialog.defaultProps = {
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(CreditDialog)

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
