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
import { updatePreferences } from '../../../actions/prefs/prefs_actions'
import { savePreferences } from '../../../api/prefs/prefs_api'
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


class MoveInDialog extends Component {

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
        id: 'intro_movein',
        component: (<MessageSegment
                               schema={{ id: 'intro_movein', endpoint: 'movein_urgency' }}
                               triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                               onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                               texts={[
                                 ...this.addAnyPreMessages('intro_movein'),
                                 { id: '1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, containerStyles: { margin: '30px 0px 0px 20px' }, text: `Let's talk about move-in dates.` },
                               ]}
                               action={{ enabled: true, label: 'Continue', actionStyles: { width: '100%' } }}
                               segmentStyles={{ justifyContent: 'space-between' }}
                             />) },
      {
        id: 'movein_urgency',
        component: (<MultiOptionsSegment
              title='Move-In Urgency'
              schema={{
                id: 'movein_urgency',
                endpoint: 'ideal_movein',
                choices: [
                  { id: 'urgent', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Urgent', value: false, endpoint: 'ideal_movein', tooltip: (<p>You need to move in less than 1 month.</p>) },
                  { id: 'flexible', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'Flexible', value: false, endpoint: 'ideal_movein', tooltip: (<p>You are flexible to move-in anytime between now and 4 months from now.</p>) },
                  { id: 'browsing', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'Just Browsing', value: false, endpoint: 'ideal_movein', tooltip: (<p>You are more than 4 months away from move-in, so just looking for now.</p>)},
                  { id: 'exact', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'Moving on an Exact Date', value: false, endpoint: 'ideal_movein', tooltip: (<p>You have an exact date you need to move-in on.</p>)}
                ]
              }}
              texts={[
                { id: '1', scrollDown: true, text: `How soon do you need to move-in? Is it urgent, or are you just browsing ahead of time?` },
              ]}
              preselected={this.props.prefs.MOVEIN.URGENCY_AS_SCHEMAS}
              onDone={(original_id, endpoint, data) => this.doneMoveInUrgency(original_id, endpoint, data)}
              triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
           />) },
      {
      id: 'ideal_movein',
      scrollStyles: { scroll_styles: { backgroundImage: `url('https://www.apartmentguide.com/blog/wp-content/uploads/2011/09/moving-truck-Christina-Richards-original.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.5)' } },
      component: (<DatePickerSegment
                      title='Ideal Move-In Date'
                      schema={{ id: 'ideal_movein', endpoint: 'movein_range' }}
                      triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                      onDone={(original_id, endpoint, data) => this.doneIdealMoveIn(original_id, endpoint, data)}
                      texts={[
                        { id: '1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'What is your ideal move-in date?' }
                      ]}
                      initialData={{
                        date: this.props.prefs.MOVEIN.IDEAL_MOVEIN_DATE ? moment(this.props.prefs.MOVEIN.IDEAL_MOVEIN_DATE).toDate() : new Date()
                      }}
                   /> )},
        {
          id: 'movein_range',
          component: (<DateRangeSegment
                           title='Date Range'
                           schema={{ id: 'movein_range', endpoint: 'moving_from' }}
                           triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                           onDone={(original_id, endpoint, data) => this.doneMoveInRange(original_id, endpoint, data)}
                           texts={[
                             { id: '1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'If you are flexible with your move-in range, you will have better options.' },
                             { id: '2', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'When is the earliest and latest date you can move-in?' },
                           ]}
                           initialData={{
                             dateRange: {
                               selection: {
                                 startDate: this.props.prefs.MOVEIN.MIN_MOVEIN_DATE ? moment(this.props.prefs.MOVEIN.MIN_MOVEIN_DATE).toDate() : new Date(),
                                 endDate: this.props.prefs.MOVEIN.MAX_MOVEIN_DATE ? moment(this.props.prefs.MOVEIN.MAX_MOVEIN_DATE).toDate() : null,
                                 key: 'selection',
                               },
                             },
                           }}
                        /> )},
        {
          id: 'moving_from',
          scrollStyles: { scroll_styles: { backgroundImage: `url('https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/land_ocean_ice_2048.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.5)' } },
          component: (<MapSegment
                            title='Your Current City'
                            schema={{ id: 'moving_from', endpoint: 'current_housing_situation' }}
                            triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                            onDone={(original_id, endpoint, data) => this.doneMovingFrom(original_id, endpoint, data)}
                            texts={[
                              { id: '1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: `Where are you moving from? What is your current city?` }
                            ]}
                            mapOptions={{ componentRestrictions: {} }}
                            initialData={{
                              address_components: [],
                              address_lat: this.props.prefs.MOVEIN.FROM_CITY_GEOPOINT.split(',')[0],
                              address_lng: this.props.prefs.MOVEIN.FROM_CITY_GEOPOINT.split(',')[1],
                              address_place_id: '',
                              address: this.props.prefs.MOVEIN.FROM_CITY,
                            }}
                         /> )},
        {
          id: 'arrival_flight_time',
          scrollStyles: { scroll_styles: { backgroundImage: `url('https://onemileatatime.com/wp-content/uploads/2015/06/Window.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.5)' } },
          component: (<DatePickerSegment
                    title='Arrival Flight Time'
                    schema={{ id: 'arrival_flight_time', endpoint: 'needs_representative' }}
                    triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                    onDone={(original_id, endpoint, data) => this.doneTourReadyDate(original_id, endpoint, data)}
                    texts={[
                      { id: '1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'When will you arrive in Ontario and be ready to go on tours?' }
                    ]}
                    initialData={{
                      date: this.props.prefs.MOVEIN.TOUR_READY_DATE ? moment(this.props.prefs.MOVEIN.TOUR_READY_DATE).toDate() : new Date()
                    }}
                 /> )},
       {
         id: 'current_housing_situation',
         scrollStyles: { scroll_styles: { backgroundImage: `url('https://images.homedepot-static.com/productImages/a5754483-c06d-4976-b6d6-f31d00bd18d4/svn/heritage-mill-engineered-hardwood-pf9710-64_1000.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.5)' } },
         component: (<MultiOptionsSegment
                                   title='Current Housing Situation'
                                   schema={{
                                     id: 'current_housing_situation',
                                     endpoint: 'needs_representative',
                                     choices: [
                                       { id: 'leaving_lease', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'I am leaving a lease', value: false, endpoint: 'two_months_notice', tooltip: (<p>You signed a lease for the place you are currently living in but now plan to move.</p>) },
                                       { id: 'escape_lease', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'I want to escape a lease', value: false, endpoint: 'lease_end', tooltip: (<p>You signed a 12 month lease for your current place but now want to terminate the lease contract.</p>) },
                                       { id: 'sublet', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'Short term sublet', value: false, endpoint: 'needs_representative', tooltip: (<p>You signed a short term sublet for less than 12 months. You pay rent to another tenant, not the property owner.</p>)},
                                       { id: 'no_lease', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'No lease', value: false, endpoint: 'needs_representative', tooltip: (<p>You do not have a lease because you live for free with friends or social assistance.</p>)},
                                       { id: 'with_family', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'I live with family', value: false, endpoint: 'needs_representative', tooltip: (<p>You live with your parents or relatives, without a lease contract.</p>)},
                                     ]
                                   }}
                                   texts={[
                                     { id: '1', text: `I see you are currently living in Ontario.` },
                                     { id: '2', scrollDown: true, text: `What is your current housing situation?` },
                                   ]}
                                   onDone={(original_id, endpoint, data) => this.doneCurrentLeaseSituation(original_id, endpoint, data)}
                                   triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                   other
                                   preselected={this.props.prefs.MOVEIN.CURRENT_LEASE_AS_SCHEMAS}
                                />) },
        {
          id: 'two_months_notice',
          component: (<MultiOptionsSegment
                                    title='Ontario Move-Out Notice'
                                    schema={{
                                      id: 'two_months_notice',
                                      endpoint: 'needs_representative',
                                      choices: [
                                        { id: 'notice_not_given', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Not Yet, Secure Next Home First', value: false, endpoint: 'needs_representative', tooltip: (<p>You are still looking for a new home, so you have not yet given the 2 months notice to your landlord yet.</p>) },
                                        { id: 'did_not_know', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Not Yet, I Did Not Know About That', value: false, endpoint: 'needs_representative', tooltip: (<p>You were unaware of the 2 months notice rule.</p>) },
                                        { id: 'notice_given', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Yes I Have Given My Notice', value: false, endpoint: 'needs_representative', tooltip: (<p>You have given the 2 months notice to your landlord already.</p>) },
                                        { id: 'dont_care', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: `My Landlord Doesn't Care`, value: false, endpoint: 'needs_representative', tooltip: (<p>You have given the 2 months notice to your landlord and they don't care. You are free to move anytime.</p>)},
                                      ]
                                    }}
                                    texts={[
                                      { id: '1', text: `In Ontario, tenants must give landlords a minimum of 2 months notice before leaving a lease contract.` },
                                      { id: '2', scrollDown: true, text: `Have you given your 2 months lease yet?` },
                                    ]}
                                    onDone={(original_id, endpoint, data) => this.doneMoveOutNoticeGiven(original_id, endpoint, data)}
                                    triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                    preselected={this.props.prefs.MOVEIN.NOTICE_GIVEN_AS_SCHEMAS}
                                 />) },
          {
            id: 'lease_end',
            component: (<DatePickerSegment
                                title='Existing Lease End'
                                schema={{ id: 'lease_end', endpoint: 'needs_representative' }}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                onDone={(original_id, endpoint, data) => this.doneExistingLeaseEnd(original_id, endpoint, data)}
                                texts={[
                                  { id: '1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'When does your current lease end?' }
                                ]}
                                initialData={{
                                  date: this.props.prefs.MOVEIN.CURRENT_LEASE_END_DATE ? moment(this.props.prefs.MOVEIN.CURRENT_LEASE_END_DATE).toDate() : null
                                }}
                             /> )},
           {
             id: 'needs_representative',
             scrollStyles: { scroll_styles: { backgroundImage: `url('https://s3-ap-southeast-1.amazonaws.com/storage.propsocial.com/topic/post_picture/7348/what-should-you-do-when-viewing-a-house-4.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.5)' } },
             component: (<MultiOptionsSegment
                                       title='Tenant Representative'
                                       schema={{
                                         id: 'needs_representative',
                                         endpoint: 'moving_reason',
                                         choices: [
                                           { id: 'self_visit', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'I can visit myself', value: false, endpoint: 'moving_reason', tooltip: (<p>You will be in Ontario before you sign a lease, so you have time to visit properties yourself.</p>) },
                                           { id: 'friend_family_rep', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Friends or family will visit', value: false, endpoint: 'moving_reason', tooltip: (<p>You want to sign a lease before arriving in Ontario, so you cannot visit in person. However you have a friend or family member who can help visit places for you.</p>) },
                                           { id: 'realtor_rep', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'I need a real estate agent', value: false, endpoint: 'moving_reason', tooltip: (<p>You do not have family or friends who can help you visit places, and will need the help of a real estate agent to visit for you.</p>)},
                                         ]
                                       }}
                                       texts={[
                                         { id: '1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: `Will you be able to visit properties in person?` },
                                         { id: '2', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: `Or will you need a representative to visit on your behalf such as a friend, family, or real estate agent?` },
                                         { id: '3', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, scrollDown: true, text: `We highly encourage that you see places in person before signing a rental property. It's a big decision so always see it in real life!` },
                                       ]}
                                       multi
                                       onDone={(original_id, endpoint, data) => this.doneTourRepresentative(original_id, endpoint, data)}
                                       triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                       other
                                       preselected={this.props.prefs.MOVEIN.TOUR_REP_AS_SCHEMAS}
                                    />) },
         {
           id: 'moving_reason',
           scrollStyles: { scroll_styles: { backgroundImage: `url('https://www.shift8stock.com/wp-content/uploads/edd/2016/12/DSCF3496-1560x1040.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.4)' } },
           component: (<InputSegment
                                 title='Reason for Moving'
                                 schema={{ id: 'moving_reason', endpoint: 'lease_length' }}
                                 triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                 onDone={(original_id, endpoint, data) => this.doneMovingReason(original_id, endpoint, data)}
                                 texts={[
                                   { id: '1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: `Can you tell me a little bit about why you are moving?` },
                                 ]}
                                 inputType={'textarea'}
                                 stringInputPlaceholder={'Tell me as much as you are comfortable sharing'}
                                 initialData={{
                                   input_string: this.props.prefs.MOVEIN.MOVING_REASON
                                 }}
                              /> )},
        {
         id: 'lease_length',
         scrollStyles: { scroll_styles: { backgroundImage: `url('https://www.growingagreenerworld.com/wp-content/uploads/2013/08/Tree-fall-for-web.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
         component: (<CounterSegment
                                 schema={{ id: 'lease_length', endpoint: 'moving_choice_factor' }}
                                 triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                 onDone={(original_id, endpoint, data) => this.doneDesiredLeaseLength(original_id, endpoint, data)}
                                 texts={[
                                   { id: '1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'How long of a lease are you looking for?' }
                                 ]}
                                 incrementerOptions={{
                                   max: 19,
                                   min: 1,
                                   step: 1,
                                   default: 12
                                 }}
                                 renderCountValue={(c) => {
                                   if (c == 1) {
                                     return 'monthly'
                                   } else if (c > 18) {
                                     return 'multi-year'
                                   } else if (c == 12) {
                                     return '1 year'
                                   } else {
                                     return (<span style={{ fontSize: '1.5rem' }}>{`${c} months`}</span>)
                                   }
                                 }}
                                 initialData={{
                                   count: this.props.prefs.MOVEIN.LEASE_LENGTH
                                 }}
                              /> )},
      {
        id: 'moving_choice_factor',
        scrollStyles: { scroll_styles: { backgroundImage: `url('https://cdn-images-1.medium.com/max/2000/1*q4Y5rlqAX_Pr5g83cOCoyg.jpeg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
        component: (<MultiOptionsSegment
                                  title='Decision Making Factors'
                                  schema={{
                                    id: 'moving_choice_factor',
                                    endpoint: 'finish',
                                    choices: [
                                      { id: 'good_deal', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'If I Find A Good Deal', value: false, endpoint: 'finish', tooltip: (<p>You are flexible with move-in, so the price, location, quality mix will determine your final decision.</p>) },
                                      { id: 'available_in_time', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: `If It's Available In Time`, value: false, endpoint: 'finish', tooltip: (<p>Time is of top importance. Price, location and quality can be flexible.</p>) },
                                      { id: 'group_members', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'Depends On My Group', value: false, endpoint: 'finish', tooltip: (<p>You're waiting on your group members to commit or make a choice.</p>) },
                                      { id: 'enough_money', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'Saved Enough Money', value: false, endpoint: 'finish', tooltip: (<p>You are saving enough money before moving in.</p>) },
                                      { id: 'when_employed', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'When I Get A Job', value: false, endpoint: 'finish', tooltip: (<p>You are confident to move-in when you secure a job with steady pay.</p>) },
                                    ]
                                  }}
                                  texts={[
                                    { id: '1', scrollDown: true, text: `Which of these is the biggest factor to your final decision?` },
                                  ]}
                                  onDone={(original_id, endpoint, data) => this.doneMovingChoiceFactor(original_id, endpoint, data)}
                                  triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                  multi
                                  other
                                  preselected={this.props.prefs.MOVEIN.DECISION_FACTORS_AS_SCHEMAS}
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
                                   { id: '1', text: `Ok I've filtered out the rentals that fit your move-in preferences.` },
                                   { id: '2', text: `Many online ads don't mention the move-in date or lease length, so I will still show those.` },
                                   { id: '3', scrollDown: true, text: `Ready to see your matches?` },
                                 ]}
                                 triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                 onDone={(original_id, endpoint, data) => this.action(original_id, endpoint, data)}
                               />) },
    ]
    this.setState({ lastUpdated: moment().unix() })
  }

  doneMoveInUrgency(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.MOVEIN.KEY,
      URGENCY_AS: data.selected_choices.map(s => s.text).join(', '),
      URGENCY_AS_SCHEMAS: data.selected_choices.map(s => {
        return {
          id: s.id,
          text: s.text,
          value: s.value
        }
      }),
    }).then((MOVEIN) => {
      this.props.updatePreferences(MOVEIN)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneIdealMoveIn(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.MOVEIN.KEY,
      IDEAL_MOVEIN_DATE: moment(data.date).toISOString()
    }).then((MOVEIN) => {
      this.props.updatePreferences(MOVEIN)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneMoveInRange(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.MOVEIN.KEY,
      MIN_MOVEIN_DATE: moment(data.dateRange.selection.startDate).toISOString(),
      MAX_MOVEIN_DATE: moment(data.dateRange.selection.endDate).toISOString(),
    }).then((MOVEIN) => {
      this.props.updatePreferences(MOVEIN)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneMovingFrom(original_id, endpoint, data) {
    if (data.address.indexOf('ON, Canada') > -1) {
      this.done(original_id, 'current_housing_situation', data)
    } else {
      this.done(original_id, 'arrival_flight_time', data)
    }
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.MOVEIN.KEY,
      FROM_CITY: data.address,
      FROM_CITY_GEOPOINT: `${data.address_lat},${data.address_lng}`
    }).then((MOVEIN) => {
      this.props.updatePreferences(MOVEIN)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneTourReadyDate(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.MOVEIN.KEY,
      TOUR_READY_DATE: moment(data.date).toISOString(),
    }).then((MOVEIN) => {
      this.props.updatePreferences(MOVEIN)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneCurrentLeaseSituation(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.MOVEIN.KEY,
      CURRENT_LEASE_AS: data.selected_choices.map(s => s.text).join(', '),
      CURRENT_LEASE_AS_SCHEMAS: data.selected_choices.map(s => {
        return {
          id: s.id,
          text: s.text,
          value: s.value
        }
      }),
    }).then((MOVEIN) => {
      this.props.updatePreferences(MOVEIN)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneMoveOutNoticeGiven(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.MOVEIN.KEY,
      NOTICE_GIVEN_AS: data.selected_choices.map(s => s.text).join(', '),
      NOTICE_GIVEN_AS_SCHEMAS: data.selected_choices.map(s => {
        return {
          id: s.id,
          text: s.text,
          value: s.value
        }
      }),
    }).then((MOVEIN) => {
      this.props.updatePreferences(MOVEIN)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneExistingLeaseEnd(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.MOVEIN.KEY,
      CURRENT_LEASE_END_DATE: moment(data.date).toISOString(),
    }).then((MOVEIN) => {
      this.props.updatePreferences(MOVEIN)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneTourRepresentative(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.MOVEIN.KEY,
      TOUR_REP_AS: data.selected_choices.map(s => s.text).join(', '),
      TOUR_REP_AS_SCHEMAS: data.selected_choices.map(s => {
        return {
          id: s.id,
          text: s.text,
          value: s.value
        }
      }),
    }).then((MOVEIN) => {
      this.props.updatePreferences(MOVEIN)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneMovingReason(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.MOVEIN.KEY,
      MOVING_REASON: data.input_string,
    }).then((MOVEIN) => {
      this.props.updatePreferences(MOVEIN)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneDesiredLeaseLength(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.MOVEIN.KEY,
      LEASE_LENGTH: data.count,
    }).then((MOVEIN) => {
      this.props.updatePreferences(MOVEIN)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneMovingChoiceFactor(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.MOVEIN.KEY,
      DECISION_FACTORS_AS: data.selected_choices.map(s => s.text).join(', '),
      DECISION_FACTORS_AS_SCHEMAS: data.selected_choices.map(s => {
        return {
          id: s.id,
          text: s.text,
          value: s.value
        }
      }),
    }).then((MOVEIN) => {
      this.props.updatePreferences(MOVEIN)
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
			<div id='MoveInDialog' onClick={() => this.props.toggleInstantCharsSegmentID(this.shown_segments[this.shown_segments.length - 1].id)} style={comStyles().container}>
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
MoveInDialog.propTypes = {
	history: PropTypes.object.isRequired,
  toggleInstantCharsSegmentID: PropTypes.func.isRequired,
  updatePreferences: PropTypes.func.isRequired,
  prefs: PropTypes.object.isRequired,
  tenant_id: PropTypes.string.isRequired,
}

// for all optional props, define a default value
MoveInDialog.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MoveInDialog)

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
