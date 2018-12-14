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
import uuid from 'uuid'
import {
  Icon,
} from 'antd-mobile'
import { toggleInstantCharsSegmentID } from '../../../actions/app/app_actions'
import { savePreferences } from '../../../api/prefs/prefs_api'
import { updatePreferences } from '../../../actions/prefs/prefs_actions'
import SegmentTemplate from '../../modules/AdvisorUI_v2/Segments/SegmentTemplate'
import MapSegment from '../../modules/AdvisorUI_v2/Segments/MapSegment'
import CounterSegment from '../../modules/AdvisorUI_v2/Segments/CounterSegment'
import MultiOptionsSegment from '../../modules/AdvisorUI_v2/Segments/MultiOptionsSegment'
import MultiInputSegment from '../../modules/AdvisorUI_v2/Segments/MultiInputSegment'
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
      premessages: [
        // { segment_id: 'someSegment', texts: [{ id, textStyles, delay, scrollDown, text, component }] }
      ]
    }
    this.all_segments = []
    this.shown_segments = []
    this.bed_choices = [
      { id: 'den', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Only a Den', value: 0.5, endpoint: 'finish', tooltip: (<p>Tip</p>) },
      { id: 'just_room', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Just Rooms', value: 0.9, endpoint: 'finish', tooltip: (<p>Tip</p>) },
      { id: 'studio', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Studio', value: 1, endpoint: 'finish', tooltip: (<p>Tip</p>) },
      { id: '1_bed', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: '1 Bed', value: 1, endpoint: 'finish', tooltip: (<p>Tip</p>) },
      { id: '1+den', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: '1 + Den', value: 1.5, endpoint: 'finish', tooltip: (<p>Tip</p>) },
      { id: '2_bed', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: '2 Bed', value: 2, endpoint: 'finish', tooltip: (<p>Tip</p>) },
      { id: '2+den', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: '2 + Den', value: 2.5, endpoint: 'finish', tooltip: (<p>Tip</p>) },
      { id: '3_bed', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: '3 Bed', value: 3, endpoint: 'finish', tooltip: (<p>Tip</p>) },
      { id: '3+den', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: '3 + Den', value: 4.5, endpoint: 'finish', tooltip: (<p>Tip</p>) },
      { id: '4_bed', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: '4 Bed', value: 4, endpoint: 'finish', tooltip: (<p>Tip</p>) },
      { id: '5_bed', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: '5 Bed', value: 5, endpoint: 'finish', tooltip: (<p>Tip</p>) },
      { id: '5+bed', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: '5+ Beds', value: 6, endpoint: 'finish', tooltip: (<p>Tip</p>) },
    ]
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
        id: 'intro_message',
        component: (<MessageSegment
          schema={{ id: 'intro_message', endpoint: 'group_members' }}
          triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
          onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
          texts={[
            ...this.addAnyPreMessages('intro_message'),
            { id: '1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, containerStyles: { margin: '30px 0px 0px 20px' }, text: `Let's get more specific on what kind of rentals are suitable for your group!` },
          ]}
          action={{ enabled: true, label: 'Continue', actionStyles: { width: '100%' } }}
          segmentStyles={{ justifyContent: 'space-between' }}
        />) },
      {
        id: 'group_members',
        component: (<MultiOptionsSegment
              title='GROUP SIZE'
              schema={{
                id: 'group_members',
                endpoint: 'members_certain_uncertain',
                choices: [
                  { id: 'myself', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Just Myself', value: 'myself', endpoint: 'entire_place_or_roommates' },
                  { id: '2_friends', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: '2 Friends', value: '2_friends', endpoint: 'members_certain_uncertain' },
                  { id: '3+_friends', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: '3+ Friends', value: '3+_friends', endpoint: 'members_certain_uncertain' },
                  { id: 'couple', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Couple of 2', value: 'couple', endpoint: 'entire_place_or_roommates' },
                  { id: '3+_family', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: '3+ Family Members', value: '3+_family', endpoint: 'meet_the_family', tooltip: (<p>Including parents, children and elderly.</p>) },
                ]
              }}
              texts={[
                { id: '1', scrollDown: true, text: `Who are you searching with?` },
              ]}
              preselected={this.props.prefs.GROUP.SEARCHING_AS_SCHEMAS}
              onDone={(original_id, endpoint, data) => this.doneSearchingAs(original_id, endpoint, data)}
              triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
           />) },
     {
       id: 'meet_the_family',
       scrollStyles: { scroll_styles: { backgroundImage: `url('https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/mado5ne/birthday-party-family-eating-cake-in-the-park-next-to-inscription-happy-birthday_4jlwyrudxl__F0000.png')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.8)' } },
       component: (<MultiCounterSegment
               title='MEET THE FAMILY'
               schema={{ id: 'meet_the_family', endpoint: 'furry_friends' }}
               triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
               onDone={(original_id, endpoint, data) => this.doneMeetingFamily(original_id, endpoint, data)}
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
               initialData={{
                 counters: this.props.prefs.GROUP.FAMILY_MEMBERS_AS_SCHEMAS
               }}
            /> )},
     {
       id: 'members_certain_uncertain',
       scrollStyles: { scroll_styles: { backgroundImage: `url('https://www.newstatesman.com/sites/default/files/images/2014%2B36_Friends_Cast_Poker(1).jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.8)' } },
       component: (<MultiCounterSegment
                 title='ROOMMATE COMMITMENT'
                 schema={{ id: 'members_certain_uncertain', endpoint: 'meet_the_group' }}
                 triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                 onDone={(original_id, endpoint, data) => this.doneMembersCertainUncertain(original_id, endpoint, data)}
                 texts={[
                   { id: '1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'How many people are 100% certain they want to live together, and how many are uncertain? ℹ️id[uncertain]', tooltips: [{ id: 'uncertain', tooltip: (<div>Depending on price, property or timing.</div>) }] },
                 ]}
                 counters={[
                   { id: 'CERTAIN_MEMBERS', renderCountValue: (c) => c, incrementerOptions: { min: 0, max: 10, step: 1, default: this.props.prefs.GROUP.CERTAIN_MEMBERS }, text: 'Certain', value: this.props.prefs.GROUP.CERTAIN_MEMBERS, tooltip: (<p>100% certain we want to live together/</p>) },
                   { id: 'UNCERTAIN_MEMBERS', renderCountValue: (c) => c, incrementerOptions: { min: 0, max: 10, step: 1, default: this.props.prefs.GROUP.UNCERTAIN_MEMBERS }, text: 'Not Certain', value: this.props.prefs.GROUP.UNCERTAIN_MEMBERS, tooltip: (<p>Might live together if a good deal is found.</p>) },
                 ]}
              /> )},
      {
         id: 'meet_the_group',
         component: (<MultiInputSegment
                             title='Meet The Group'
                             schema={{ id: 'meet_the_group', endpoint: 'entire_place_or_roommates' }}
                             triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                             onDone={(original_id, endpoint, data) => this.doneMeetingGroup(original_id, endpoint, data)}
                             texts={[
                               ...this.addAnyPreMessages('meet_the_group'),
                               { id: '1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'What are the names of your certain group members?' },
                             ]}
                             inputType={'text'}
                             minChars={1}
                             inputs={this.props.prefs.GROUP.GROUP_MEMBERS_AS_SCHEMAS}
                          /> )},
      {
        id: 'entire_place_or_roommates',
        component: (<MultiOptionsSegment
                                title='ENTIRE PLACE OR JUST ROOMS'
                                schema={{
                                  id: 'entire_place_or_roommates',
                                  endpoint: 'furry_friends',
                                  choices: [
                                    { id: 'only_want_entire_place', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Only Show Entire Place', value: false, endpoint: 'furry_friends', tooltip: (<p>Just your group, no unknown roommates.</p>) },
                                    { id: 'only_roommates_no_entire_place', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Only Show Partial Places with Roommates', value: false, endpoint: 'max_total_roommates', tooltip: (<p>Possibily live with new random roommates in exchange for cheaper rent.</p>) },
                                    { id: 'show_both', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Show Me Both', value: false, endpoint: 'max_total_roommates' },
                                  ]
                                }}
                                texts={[
                                  { id: '1', text: `Do you want to live in one place all to yourselves, or are you ok with meeting new roommates who are also searching?` },
                                  { id: '2', scrollDown: true, text: `Roommates mean less space for cheaper rent.` },
                                ]}
                                preselected={this.props.prefs.GROUP.WHOLE_OR_RANDOMS_AS_SCHEMAS}
                                onDone={(original_id, endpoint, data) => this.doneEntireOrRoommates(original_id, endpoint, data)}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                             />) },
       {
         id: 'max_total_roommates',
         component: (<CounterSegment
                                 title='MAX ROOMMATES'
                                 schema={{ id: 'max_total_roommates', endpoint: 'ok_with_dens' }}
                                 triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                 onDone={(original_id, endpoint, data) => this.doneMaxTotalGroup(original_id, endpoint, data)}
                                 texts={[
                                   { id: '1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'At most how many people are you ok living with. Including yourself.' }
                                 ]}
                                 incrementerOptions={{
                                   max: 10,
                                   min: 2,
                                   step: 1,
                                   default: 4
                                 }}
                                 initialData={{
                                   count: this.props.prefs.GROUP.MAX_TOTAL_GROUP
                                 }}
                              /> )},
      {
        id: 'ok_with_dens',
        scrollStyles: { scroll_styles: { backgroundImage: `url('https://i.pinimg.com/originals/13/9c/a0/139ca00c8fe547473f798a4dbd6c3045.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
        component: (<MultiOptionsSegment
                                title='PARTIAL ROOMS'
                                schema={{
                                  id: 'ok_with_dens',
                                  endpoint: 'group_name',
                                  choices: [
                                    { id: 'own_rooms', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Only Real Rooms', value: false, endpoint: 'group_name', tooltip: (<p>A real bedroom is defined as a room with a lockable door and at least 1 window.</p>) },
                                    { id: 'ok_den', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Ok With Den', value: false, endpoint: 'group_name', tooltip: (<p>Dens may be a seperate office room or a semi-seperate living room, and rarely has a door or wall. It can be liveable but cramped. Always visit in person to see the reality!</p>) },
                                    { id: 'show_both', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Show Me Both', value: false, endpoint: 'group_name' },
                                  ]
                                }}
                                texts={[
                                  { id: '1', text: `Rent can be expensive. Do any roommates want to save money and live in a den?` },
                                  { id: '2', scrollDown: true, text: `I can show you places with that possibility, but the max limit is 1 person in a den.` },
                                ]}
                                preselected={this.props.prefs.GROUP.LIVE_IN_DEN_AS_SCHEMAS}
                                onDone={(original_id, endpoint, data) => this.doneDenOrPrivate(original_id, endpoint, data)}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                             />) },
       {
         id: 'group_name',
         scrollStyles: { scroll_styles: { backgroundImage: `url('http://www.gohaus.com/wp-content/uploads/2015/12/living-room-floor-design-ideas.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.6)' } },
         component: (<InputSegment
                                 title='Group Name'
                                 schema={{ id: 'group_name', endpoint: 'furry_friends' }}
                                 triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                 onDone={(original_id, endpoint, data) => this.doneGroupName(original_id, endpoint, data)}
                                 texts={[
                                   ...this.addAnyPreMessages('group_name'),
                                   { id: '0-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: "What would you like to call your group?" },
                                 ]}
                                 initialData={{
                                   input_string: this.props.prefs.GROUP.GROUP_NAME
                                 }}
                                 inputType={'text'}
                                 stringInputPlaceholder={'Group Name'}
                              />)},
     {
       id: 'furry_friends',
       scrollStyles: { scroll_styles: { backgroundImage: `url('https://images.mentalfloss.com/sites/default/files/styles/mf_image_16x9/public/doge.png?itok=3mQ7N3-a&resize=1100x1100')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
       component: (<MultiCounterSegment
                     title='PETS'
                     schema={{ id: 'furry_friends', endpoint: 'desired_rooms' }}
                     triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                     onDone={(original_id, endpoint, data) => this.doneFurryFriends(original_id, endpoint, data)}
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
                     initialData={{
                       counters: this.props.prefs.GROUP.PETS_AS_SCHEMAS
                     }}
                     defaultRenderCountValue={(c) => c}
                  /> )},
      {
        id: 'desired_rooms',
        scrollStyles: { scroll_styles: { backgroundImage: `url('https://s7d4.scene7.com/is/image/roomandboard/ella_259692_17e_g?$str_g$&size=1968,1450&scl=1')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
        component: (<MultiOptionsSegment
                                title='ACCEPTABLE TYPES OF UNITS'
                                schema={{
                                  id: 'desired_rooms',
                                  endpoint: 'finish',
                                  choices: this.bed_choices
                                }}
                                texts={[
                                  { id: '1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Select all the types of housing you would like to look at.' },
                                ]}
                                multi
                                preselected={this.props.prefs.GROUP.ACCEPTABLE_UNITS_AS_SCHEMAS}
                                onDone={(original_id, endpoint, data) => this.doneAcceptableUnitTypes(original_id, endpoint, data)}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                other
                             />) },
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

  doneSearchingAs(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.GROUP.KEY,
      SEARCHING_AS: data.selected_choices.map(c => c.text).join(', '),
      SEARCHING_AS_SCHEMAS: data.selected_choices.map(s => {
        return {
          id: s.id,
          text: s.text,
          value: s.value
        }
      }),
    }).then((GROUP) => {
      this.props.updatePreferences(GROUP)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneMeetingFamily(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.GROUP.KEY,
      FAMILY_MEMBERS_AS: data.counters.map(c => c.text).join(', '),
      FAMILY_MEMBERS_AS_SCHEMAS: data.counters.map(s => {
        return {
          id: s.id,
          text: s.text,
          value: s.value
        }
      }),
    }).then((GROUP) => {
      this.props.updatePreferences(GROUP)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneMembersCertainUncertain(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    const certain = data.counters.filter(c => c.id === 'CERTAIN_MEMBERS')
    const uncertain = data.counters.filter(c => c.id === 'UNCERTAIN_MEMBERS')
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.GROUP.KEY,
      CERTAIN_MEMBERS: certain[0] && certain[0].value ? certain[0].value : 0,
      UNCERTAIN_MEMBERS: uncertain[0] && uncertain[0].value ? uncertain[0].value : 0,
    }).then((GROUP) => {
      this.props.updatePreferences(GROUP)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneMeetingGroup(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.GROUP.KEY,
      GROUP_MEMBERS_AS: data.inputs.map(c => c.text).join(', '),
      GROUP_MEMBERS_AS_SCHEMAS: data.inputs.map(s => {
        return {
          id: s.id,
          text: s.text,
          value: s.value
        }
      }),
    }).then((GROUP) => {
      this.props.updatePreferences(GROUP)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneEntireOrRoommates(original_id, endpoint, data) {
    // the endpoint coming in from <MultiOptionsSegment> is the default
    // the data.selected_choices are fed in from schema.choices, which has endpoints associated with them
    // so we go to the first employment type endpoint, and when we finish an employment type we can go to any others (see doneProofs)
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.GROUP.KEY,
      WHOLE_OR_RANDOM_AS: data.selected_choices.map(s => s.text).join(', '),
      WHOLE_OR_RANDOMS_AS_SCHEMAS: data.selected_choices.map(s => {
        return {
          id: s.id,
          text: s.text,
          value: s.value
        }
      }),
    }).then((GROUP) => {
      this.props.updatePreferences(GROUP)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneDenOrPrivate(original_id, endpoint, data) {
    // the endpoint coming in from <MultiOptionsSegment> is the default
    // the data.selected_choices are fed in from schema.choices, which has endpoints associated with them
    // so we go to the first employment type endpoint, and when we finish an employment type we can go to any others (see doneProofs)
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.GROUP.KEY,
      LIVE_IN_DEN_AS: data.selected_choices.map(s => s.text).join(', '),
      LIVE_IN_DEN_AS_SCHEMAS: data.selected_choices.map(s => {
        return {
          id: s.id,
          text: s.text,
          value: s.value
        }
      }),
    }).then((GROUP) => {
      this.props.updatePreferences(GROUP)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneGroupName(original_id, endpoint, data) {
    // the endpoint coming in from <MultiOptionsSegment> is the default
    // the data.selected_choices are fed in from schema.choices, which has endpoints associated with them
    // so we go to the first employment type endpoint, and when we finish an employment type we can go to any others (see doneProofs)
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.GROUP.KEY,
      GROUP_ID: this.props.prefs.GROUP.GROUP_ID ? this.props.prefs.GROUP.GROUP_ID : uuid.v4(),
      GROUP_NAME: data.input_string,
    }).then((GROUP) => {
      this.props.updatePreferences(GROUP)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneFurryFriends(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.GROUP.KEY,
      PETS_AS: data.counters.map(c => c.text).join(', '),
      PETS_AS_SCHEMAS: data.counters.map(s => {
        return {
          id: s.id,
          text: s.text,
          value: s.value
        }
      }),
    }).then((GROUP) => {
      this.props.updatePreferences(GROUP)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneMaxTotalGroup(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.GROUP.KEY,
      MAX_TOTAL_GROUP: data.count,
    }).then((GROUP) => {
      this.props.updatePreferences(GROUP)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneAcceptableUnitTypes(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.GROUP.KEY,
      ACCEPTABLE_UNITS_AS: data.selected_choices.map(s => s.text).join(', '),
      ACCEPTABLE_UNITS_AS_SCHEMAS: data.selected_choices.map(s => {
        return {
          id: s.id,
          text: s.text,
          value: s.value
        }
      }),
    }).then((GROUP) => {
      this.props.updatePreferences(GROUP)
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
  prefs: PropTypes.object.isRequired,
  updatePreferences: PropTypes.func.isRequired,
  tenant_id: PropTypes.string.isRequired,
}

// for all optional props, define a default value
GroupDialog.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(GroupDialog)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    prefs: redux.prefs,
    tenant_id: redux.tenant.tenant_id,
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
