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
import MultiCounterSegment from '../../modules/AdvisorUI_v2/Segments/MultiCounterSegment'
import { ACCENT_COLOR, FONT_COLOR, BACKGROUND_COLOR, BACKGROUND_WEBKIT, BACKGROUND_MODERN, FONT_FAMILY, FONT_FAMILY_ACCENT } from '../../modules/AdvisorUI_v2/styles/advisor_ui_styles'


class GroupDialog extends Component {

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
        id: 'group_members',
        component: (<MultiOptionsSegment
              title='GROUP SIZE'
              schema={{
                id: 'group_members',
                endpoint: 'members_certain_uncertain',
                choices: [
                  { id: 'myself', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Just Myself', value: 'myself', endpoint: 'furry_friends' },
                  { id: '2_friends', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: '2 Friends', value: '2_friends', endpoint: 'members_certain_uncertain' },
                  { id: '3+_friends', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: '3+ Friends', value: '3+_friends', endpoint: 'members_certain_uncertain' },
                  { id: 'couple', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Couple of 2', value: 'couple', endpoint: 'furry_friends' },
                  { id: '3+_family', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: '3+ Family Members', value: '3+_family', endpoint: 'meet_the_family', tooltip: (<p>Including parents, children and elderly.</p>) },
                ]
              }}
              texts={[
                { id: '1', scrollDown: true, text: `Who are you searching with?` },
              ]}
              onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
              triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
           />) },
     {
     id: 'meet_the_family',
     scrollStyles: { scroll_styles: { backgroundImage: `url('https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/mado5ne/birthday-party-family-eating-cake-in-the-park-next-to-inscription-happy-birthday_4jlwyrudxl__F0000.png')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.8)' } },
     component: (<MultiCounterSegment
               title='MEET THE FAMILY'
               schema={{ id: 'meet_the_family', endpoint: 'furry_friends' }}
               triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
               onDone={(original_id, endpoint, data) => this.doneName(original_id, endpoint, data)}
               texts={[
                 { id: '1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'I am happy to serve your family 😊' },
                 { id: '2', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'How many people are you in total? Please include everyone who will sleep there.' },
               ]}
               counters={[
                 { id: 'adult_male', renderCountValue: (c) => c, incrementerOptions: { min: 0, max: 10, step: 1, default: 0 }, text: 'Adult Male', value: 0, tooltip: (<p>Age 18 - 60</p>) },
                 { id: 'adult_female', renderCountValue: (c) => c, incrementerOptions: { min: 0, max: 10, step: 1, default: 0 }, text: 'Adult Female', value: 0, tooltip: (<p>Age 18 - 60</p>) },
                 { id: 'child_male', renderCountValue: (c) => c, incrementerOptions: { min: 0, max: 10, step: 1, default: 0 }, text: 'Child Male', value: 0, tooltip: (<p>Younger than 18</p>) },
                 { id: 'child_female', renderCountValue: (c) => c, incrementerOptions: { min: 0, max: 10, step: 1, default: 0 }, text: 'Child Female', value: 0, tooltip: (<p>Younger than 18</p>) },
                 { id: 'elderly_male', renderCountValue: (c) => c, incrementerOptions: { min: 0, max: 10, step: 1, default: 0 }, text: 'Elderly Male', value: 0, tooltip: (<p>Older than 60</p>) },
                 { id: 'elderly_female', renderCountValue: (c) => c, incrementerOptions: { min: 0, max: 10, step: 1, default: 0 }, text: 'Elderly Female', value: 0, tooltip: (<p>Older than 60</p>) },
               ]}
            /> )},
     {
     id: 'members_certain_uncertain',
     scrollStyles: { scroll_styles: { backgroundImage: `url('https://www.newstatesman.com/sites/default/files/images/2014%2B36_Friends_Cast_Poker(1).jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.8)' } },
     component: (<MultiCounterSegment
               title='ROOMMATE COMMITMENT'
               schema={{ id: 'members_certain_uncertain', endpoint: 'entire_place_or_roommates' }}
               triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
               onDone={(original_id, endpoint, data) => this.doneName(original_id, endpoint, data)}
               texts={[
                 { id: '1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'How many people are 100% certain they want to live together, and how many are uncertain? ℹ️id[uncertain]', tooltips: [{ id: 'uncertain', tooltip: (<div>Depending on price, property or timing.</div>) }] },
               ]}
               counters={[
                 { id: 'certain', renderCountValue: (c) => c, incrementerOptions: { min: 0, max: 10, step: 1, default: 0 }, text: 'Certain', value: 0, tooltip: (<p>100% certain we want to live together/</p>) },
                 { id: 'uncertain', renderCountValue: (c) => c, incrementerOptions: { min: 0, max: 10, step: 1, default: 0 }, text: 'Not Certain', value: 0, tooltip: (<p>Might live together if a good deal is found.</p>) },
               ]}
            /> )},
      {
        id: 'entire_place_or_roommates',
        component: (<MultiOptionsSegment
                                title='ENTIRE PLACE OR JUST ROOMS'
                                schema={{
                                  id: 'entire_place_or_roommates',
                                  endpoint: 'furry_friends',
                                  choices: [
                                    { id: 'want_entire_place', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Entire Place', value: 'want_entire_place', endpoint: 'furry_friends', tooltip: (<p>Just your group, no unknown roommates.</p>) },
                                    { id: 'open_to_roommates', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Ok With New Roommates', value: 'open_to_roommates', endpoint: 'max_total_roommates', tooltip: (<p>Possibily live with new random roommates in exchange for cheaper rent.</p>) },
                                  ]
                                }}
                                texts={[
                                  { id: '1', text: `Do you want to live in one place all to yourselves, or are you ok with meeting new roommates who are also searching?` },
                                  { id: '2', scrollDown: true, text: `Roommates mean less space for cheaper rent.` },
                                ]}
                                onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                             />) },
       {
         id: 'max_total_roommates',
         component: (<CounterSegment
                                 title='MAX ROOMMATES'
                                 schema={{ id: 'max_total_roommates', endpoint: 'ok_with_dens' }}
                                 triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                 onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                 texts={[
                                   { id: '1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'At most how many roommates are you ok with?' }
                                 ]}
                                 incrementerOptions={{
                                   max: 10,
                                   min: 2,
                                   step: 1,
                                   default: 4
                                 }}
                              /> )},
      {
        id: 'ok_with_dens',
        scrollStyles: { scroll_styles: { backgroundImage: `url('https://i.pinimg.com/originals/13/9c/a0/139ca00c8fe547473f798a4dbd6c3045.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
        component: (<MultiOptionsSegment
                                title='PARTIAL ROOMS'
                                schema={{
                                  id: 'ok_with_dens',
                                  endpoint: 'furry_friends',
                                  choices: [
                                    { id: 'own_rooms', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Only Real Rooms', value: 'own_rooms', endpoint: 'furry_friends', tooltip: (<p>A real bedroom is defined as a room with a lockable door and at least 1 window.</p>) },
                                    { id: 'ok_den', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Ok With Den', value: 'ok_den', endpoint: 'furry_friends', tooltip: (<p>Dens may be a seperate office room or a semi-seperate living room, and rarely has a door or wall. It can be liveable but cramped. Always visit in person to see the reality!</p>) },
                                  ]
                                }}
                                texts={[
                                  { id: '1', text: `Rent can be expensive. Do any roommates want to save money and live in a den?` },
                                  { id: '2', scrollDown: true, text: `I can show you places with that possibility, but the max limit is 1 person in a den.` },
                                ]}
                                onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                             />) },
     {
       id: 'furry_friends',
       scrollStyles: { scroll_styles: { backgroundImage: `url('https://images.mentalfloss.com/sites/default/files/styles/mf_image_16x9/public/doge.png?itok=3mQ7N3-a&resize=1100x1100')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
       component: (<MultiCounterSegment
                 title='PETS'
                 schema={{ id: 'furry_friends', endpoint: 'desired_rooms' }}
                 triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                 onDone={(original_id, endpoint, data) => this.doneName(original_id, endpoint, data)}
                 texts={[
                   { id: '1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Do you have any pets?' },
                 ]}
                 counters={[
                   { id: 'large_dogs', renderCountValue: (c) => c, incrementerOptions: { min: 0, max: 5, step: 1, default: 0 }, text: 'Large Dogs', value: 0, tooltip: (<p>Large dogs are over 25 lbs (12kg)</p>) },
                   { id: 'small_dogs', renderCountValue: (c) => c, incrementerOptions: { min: 0, max: 5, step: 1, default: 0 }, text: 'Small Dogs', value: 0, tooltip: (<p>Small dogs are under 25 lbs (12kg).</p>) },
                   { id: 'cats', renderCountValue: (c) => c, incrementerOptions: { min: 0, max: 10, step: 1, default: 0 }, text: 'Cats', value: 0 },
                 ]}
                 other
                 otherIncrementerOptions={{
                   min: 0,
                   max: 5,
                   default: 0,
                   step: 1,
                 }}
              /> )},
      {
        id: 'desired_rooms',
        scrollStyles: { scroll_styles: { backgroundImage: `url('https://s7d4.scene7.com/is/image/roomandboard/ella_259692_17e_g?$str_g$&size=1968,1450&scl=1')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
        component: (<CounterSegment
                          title='NUMBER OF ROOMS'
                          schema={{ id: 'desired_rooms', endpoint: 'finish' }}
                          triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                          onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                          texts={[
                            { id: '1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'How many individual bedrooms does your group want?' },
                            { id: '2', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'A real bedroom has a lockable door with at least one window.' }
                          ]}
                          incrementerOptions={{
                            max: 10,
                            min: 0,
                            step: 1,
                            default: 1
                          }}
                       /> )},
     {
       id: 'finish',
       scrollStyles: { scroll_styles: { backgroundImage: `url('https://s3.amazonaws.com/renthero-public-assets/images/Screen+Shot+2018-12-05+at+11.05.09+PM.png')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
       component: (<ActionSegment
                               title='FINISH'
                               schema={{
                                 id: 'finish',
                                 endpoint: null,
                                 choices: [
                                   { id: 'view_matches', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'VIEW MATCHES', value: 'view_matches', endpoint: '/matches' }
                                 ]
                               }}
                               texts={[
                                 { id: '1', scrollDown: true, text: `Ok I've filtered out the rentals that fit your group preferences.` },
                                 { id: '2', scrollDown: true, text: `Ready to see your matches?` },
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
			<div id='GroupDialog' onClick={() => this.props.toggleInstantCharsSegmentID(this.shown_segments[this.shown_segments.length - 1].id)} style={comStyles().container}>
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
GroupDialog.propTypes = {
	history: PropTypes.object.isRequired,
  toggleInstantCharsSegmentID: PropTypes.func.isRequired,
}

// for all optional props, define a default value
GroupDialog.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(GroupDialog)

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
