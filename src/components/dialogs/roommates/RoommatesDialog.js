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


class RoommatesDialog extends Component {

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
 {
   id: 'roommate_gender',
   scrollStyles: { scroll_styles: { backgroundImage: `url('https://cdn.freshome.com/wp-content/uploads/2018/07/balcony-how.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
   component: (<MultiOptionsSegment
                           title='ROOMMATE GENDERS'
                           schema={{
                             id: 'roommate_gender',
                             endpoint: 'roommate_age_limits',
                             choices: [
                               { id: 'female_only', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Females Only', value: 'female_only', endpoint: 'roommate_age_limits' },
                               { id: 'male_only', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Males Only', value: 'male_only', endpoint: 'roommate_age_limits' },
                               { id: 'mixed', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Any Gender', value: 'mixed', endpoint: 'roommate_age_limits' },
                             ]
                           }}
                           texts={[
                             { id: '1', text: `What gender of roommates are you comfortable living with?` },
                           ]}
                           onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                           triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                        />) },
{
  id: 'roommate_age_limits',
  component: (<MultiCounterSegment
            title='ROOMMATE AGES'
            schema={{ id: 'roommate_age_limits', endpoint: 'lgbt_friendly' }}
            triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
            onDone={(original_id, endpoint, data) => this.doneName(original_id, endpoint, data)}
            texts={[
              { id: '1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'What age range of roommates are you comfortable with?' },
            ]}
            counters={[
              { id: 'min_age', renderCountValue: (c) => c, incrementerOptions: { min: 18, max: 99, step: 1, default: 20 }, text: 'Min Age', value: 20 },
              { id: 'max_age', renderCountValue: (c) => c, incrementerOptions: { min: 18, max: 99, step: 1, default: 30 }, text: 'Max Age', value: 30 },
            ]}
         /> )},
// {
//  id: 'lgbt_friendly',
//  component: (<MultiOptionsSegment
//        title='LGBT Friendliness'
//        schema={{
//          id: 'lgbt_friendly',
//          endpoint: 'allergies_medical_conditions',
//          choices: [
//            { id: 'yes', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Yes', value: 'yes', endpoint: 'allergies_medical_conditions' },
//            { id: 'no', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'No', value: 'no', endpoint: 'allergies_medical_conditions' },
//          ]
//        }}
//        texts={[
//          { id: '1', scrollDown: true, text: `Are you LGBT friendly?` },
//        ]}
//        onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
//        triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
//        other
//     />) },
// {
//   id: 'allergies_medical_conditions',
//   scrollStyles: { scroll_styles: { backgroundImage: `url('https://foodrevolution.org/wp-content/uploads/2018/04/blog-featured-diabetes-20180406-1330.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.4)' } },
//   component: (<InputSegment
//          title='Allergies & Medical'
//          schema={{ id: 'allergies_medical_conditions', endpoint: 'furry_friends' }}
//          triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
//          onDone={(original_id, endpoint, data) => this.doneName(original_id, endpoint, data)}
//          texts={[
//            { id: '1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: `Do you have any allergies or medical conditions?` },
//          ]}
//          inputType={'textarea'}
//          stringInputPlaceholder={'Tell me as much as you are comfortable sharing'}
//       /> )},
//       {
//         id: 'first_time_renting',
//         scrollStyles: { scroll_styles: { backgroundImage: `url('https://www.utoronto.ca/sites/default/files/zia-syed-Toronto-unsplash%28weblead0.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
//         component: (<MultiOptionsSegment
//
//                         schema={{
//                           id: 'first_time_renting',
//                           endpoint: 'how_long_searching',
//                           choices: [
//                             { id: 'first_time_ever', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'First Time Ever', value: 'first_time_ever', endpoint: 'how_long_searching' },
//                             { id: 'first_time_in_city', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'First Time in Toronto', value: 'first_time_in_city', endpoint: 'how_long_searching' },
//                             { id: 'no', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'No', value: 'no', endpoint: 'how_long_searching' },
//                           ]
//                         }}
//                         texts={[
//                           { id: '1', scrollDown: true, text: `Is this your first time renting?` },
//                         ]}
//                         onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
//                         triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
//                      />) },
      {
        id: 'how_long_searching',
        scrollStyles: { scroll_styles: { backgroundImage: `url('https://www.theglobeandmail.com/resizer/E5UhKkd9oC1MiABKrCh5VYjADG8=/1200x0/filters:quality(80)/arc-anglerfish-tgam-prod-tgam.s3.amazonaws.com/public/ESXSYJOCIBAOPEMRC2KIKRMOSY')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
        component: (<CounterSegment
                                schema={{ id: 'how_long_searching', endpoint: 'how_many_tours' }}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                texts={[
                                  { id: '1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'How long have you been searching for?' }
                                ]}
                                incrementerOptions={{
                                  max: 13,
                                  min: 0,
                                  step: 1,
                                  default: 0
                                }}
                                renderCountValue={(c) => {
                                  if (c > 12) {
                                    return `3+ months`
                                  } else if (c === 12) {
                                    return `3 months`
                                  } else if (c === 8) {
                                    return `2 months`
                                  } else if (c === 4) {
                                    return `1 month`
                                  } else {
                                    return `${c} weeks`
                                  }
                                }}
                                slider
                                sliderOptions={{
                                  min: 0,
                                  max: 13,
                                  step: 1,
                                  vertical: false,
                                }}
                             /> )},
        {
          id: 'how_many_tours',
          component: (<CounterSegment
                                  schema={{ id: 'how_many_tours', endpoint: 'current_realtor' }}
                                  triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                  onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                  texts={[
                                    { id: '1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'How many property tours have you gone on so far?' }
                                  ]}
                                  incrementerOptions={{
                                    max: 11,
                                    min: 0,
                                    step: 1,
                                    default: 0
                                  }}
                                  renderCountValue={(c) => {
                                    if (c > 10) {
                                      return `10+`
                                    } else {
                                      return c
                                    }
                                  }}
                                  slider
                                  sliderOptions={{
                                    min: 0,
                                    max: 11,
                                    step: 1,
                                  }}
                                  canBeZero
                               /> )},
        {
          id: 'current_realtor',
          scrollStyles: { scroll_styles: { backgroundImage: `url('https://maryanneveldkamp.com/wp-content/uploads/2016/09/iStock_90650295_LARGE.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
          component: (<MultiOptionsSegment

                                    schema={{
                                      id: 'current_realtor',
                                      endpoint: 'age',
                                      choices: [
                                        { id: 'yes_current', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Yes Currently', value: 'yes_current', endpoint: 'age', tooltip: (<p>You currently have a realtor helping you.</p>) },
                                        { id: 'not_anymore', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Not Anymore', value: 'not_anymore', endpoint: 'why_leave_realtor', tooltip: (<p>You worked with one for your current rental search, but are no longer working with them.</p>) },
                                        { id: 'no', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'No', value: 'no', endpoint: 'age', tooltip: (<p>You have not worked with a real estate agent for your current rental search.</p>) },
                                      ]
                                    }}
                                    texts={[
                                      { id: '1', scrollDown: true, text: `Are you currently working with a realtor?` },
                                    ]}
                                    onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                    triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                 />) },
         {
           id: 'why_leave_realtor',
           component: (<MultiOptionsSegment
                                     schema={{
                                       id: 'why_leave_realtor',
                                       endpoint: 'age',
                                       choices: [
                                         { id: 'hassle', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Too Much of a Hassle', value: 'hassle', endpoint: 'age' },
                                         { id: 'not_helpful', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Not Helpful', value: 'not_helpful', endpoint: 'age' },
                                         { id: 'pushy', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Too Pushy', value: 'pushy', endpoint: 'age' },
                                         { id: 'not_prioritized', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Did Not Prioritize Me', value: 'not_prioritized', endpoint: 'age' },
                                         { id: 'unprofessional', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Unprofessional', value: 'unprofessional', endpoint: 'age' },
                                       ]
                                     }}
                                     texts={[
                                       { id: '1', text: `Why are you no longer working with them?` },
                                     ]}
                                     onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                     triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                     other
                                     multi
                                  />) },
        {
         id: 'age',
         scrollStyles: { scroll_styles: { backgroundImage: `url('https://nlfv12e18e1jzs2fc7s3q7v4-wpengine.netdna-ssl.com/wp-content/uploads/2018/04/people-working_185293590_l-2015.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
         component: (<CounterSegment
                                 schema={{ id: 'age', endpoint: 'gender' }}
                                 triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                 onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                 texts={[
                                   { id: '1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'What is your age?' }
                                 ]}
                                 incrementerOptions={{
                                   max: 101,
                                   min: 18,
                                   step: 1,
                                   default: 25
                                 }}
                                 renderCountValue={(c) => {
                                   if (c > 100) {
                                     return '100+'
                                   } else {
                                     return c
                                   }
                                 }}
                                 slider
                                 sliderOptions={{
                                   min: 18,
                                   max: 101,
                                   step: 1,
                                 }}
                              /> )},
       {
         id: 'gender',
         scrollStyles: { scroll_styles: { backgroundImage: `url('http://www.ottawaoutdoorflooring.com/img/ottawa-condo-flooring-slide.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.5)' } },
         component: (<MultiOptionsSegment

                                       schema={{
                                         id: 'gender',
                                         endpoint: 'lgbt',
                                         choices: [
                                           { id: 'female', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Male', value: 'female', endpoint: 'lgbt' },
                                           { id: 'male', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Female', value: 'male', endpoint: 'lgbt' },
                                         ]
                                       }}
                                       texts={[
                                         { id: '1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, scrollDown: true, text: `What gender do you identify with?` },
                                       ]}
                                       onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                       triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                       other
                                    />) },
       {
         id: 'lgbt',
         component: (<MultiOptionsSegment

                                       schema={{
                                         id: 'lgbt',
                                         endpoint: 'religion',
                                         choices: [
                                           { id: 'yes', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Yes', value: 'yes', endpoint: 'religion' },
                                           { id: 'no', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'No', value: 'no', endpoint: 'religion' },
                                         ]
                                       }}
                                       texts={[
                                         { id: '1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, scrollDown: true, text: `Do you identify with any LGBT orientations?` },
                                       ]}
                                       onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                       triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                       other
                                    />) },
      {
        id: 'religion',
        scrollStyles: { scroll_styles: { backgroundImage: `url('https://cdn.dnaindia.com/sites/default/files/styles/full/public/2018/09/12/730590-504437-guru-granth-sahib.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
        component: (<MultiOptionsSegment

                                schema={{
                                  id: 'religion',
                                  endpoint: 'ethnicity',
                                  choices: [
                                    { id: 'muslim', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Muslim', value: 'muslim', endpoint: 'ethnicity' },
                                    { id: 'christian', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: `Christian`, value: 'christian', endpoint: 'ethnicity' },
                                    { id: 'hindu', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Hindu', value: 'hindu', endpoint: 'ethnicity' },
                                    { id: 'buddist', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Buddist', value: 'buddist', endpoint: 'ethnicity' },
                                    { id: 'sikh', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Sikh', value: 'sikh', endpoint: 'ethnicity' },
                                    { id: 'judaism', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Judaism', value: 'judaism', endpoint: 'ethnicity' },
                                    { id: 'agnostic', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Agnostic', value: 'agnostic', endpoint: 'ethnicity' },
                                  ]
                                }}
                                texts={[
                                  { id: '1', text: `Canada welcomes its diversity of religions.` },
                                  { id: '2', scrollDown: true, text: `Do you identify with any of these faiths?` },
                                ]}
                                onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                multi
                                other
                             />) },
      {
       id: 'ethnicity',
       scrollStyles: { scroll_styles: { backgroundImage: `url('http://img.src.ca/2016/06/27/635x357/PC_160627_6f2pc_rci-trudeau-multiculturalim2_sn635.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.85)' } },
       component: (<MultiOptionsSegment

                               schema={{
                                 id: 'ethnicity',
                                 endpoint: 'education_levels',
                                 choices: [
                                   { id: 'white', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'White', value: 'white', endpoint: 'education_levels' },
                                   { id: 'black', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Black', value: 'black', endpoint: 'education_levels' },
                                   { id: 'caribbean', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Caribbean', value: 'caribbean', endpoint: 'education_levels' },
                                   { id: 'african', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'African', value: 'african', endpoint: 'education_levels' },
                                   { id: 'east_asian', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'East Asian', value: 'east_asian', endpoint: 'education_levels' },
                                   { id: 'south_asian', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'South Asian', value: 'south_asian', endpoint: 'education_levels' },
                                   { id: 'southeast_asian', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'SouthEast Asian', value: 'southeast_asian', endpoint: 'education_levels' },
                                   { id: 'central_asian', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Central Asian', value: 'central_asian', endpoint: 'education_levels' },
                                   { id: 'polynesian', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Polynesian', value: 'polynesian', endpoint: 'education_levels' },
                                   { id: 'hispanic', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Hispanic', value: 'hispanic', endpoint: 'education_levels' },
                                   { id: 'arabic', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Arabic', value: 'arabic', endpoint: 'education_levels' },
                                   { id: 'iranian', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Iranian', value: 'iranian', endpoint: 'education_levels' },
                                   { id: 'turkish', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Turkish', value: 'turkish', endpoint: 'education_levels' },
                                   { id: 'jewish', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Jewish', value: 'jewish', endpoint: 'education_levels' },
                                   { id: 'native', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Native American', value: 'native', endpoint: 'education_levels' },
                                   { id: 'west_european', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Western European', value: 'west_european', endpoint: 'education_levels' },
                                   { id: 'east_european', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Eastern European', value: 'east_european', endpoint: 'education_levels' },
                                 ]
                               }}
                               texts={[
                                 { id: '1', text: `Canada welcomes its diversity of ethnicities.` },
                                 { id: '2', scrollDown: true, text: `Do you identify with any of these ethnic backgrounds?` },
                               ]}
                               onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                               triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                               multi
                               other
                            />) },
        {
          id: 'education_levels',
          scrollStyles: { scroll_styles: { backgroundImage: `url('https://2018aatk.files.wordpress.com/2018/02/122d-20161117-uoft-resize_then_crop-_frame_bg_color_fff-h_1365-gravity_center-q_70-preserve_ratio_true-w_2048_.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
          component: (<MultiOptionsSegment
                                  schema={{
                                    id: 'education_levels',
                                    endpoint: 'place_of_study',
                                    choices: [
                                      { id: 'high_school', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'High School', value: 'high_school', endpoint: 'finish', tooltip: (<p>You are flexible with move-in, so the price, location, quality mix will determine your final decision.</p>) },
                                      { id: 'apprenticeship', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Apprenticeship', value: 'apprenticeship', endpoint: 'place_of_study', tooltip: (<p>You are flexible with move-in, so the price, location, quality mix will determine your final decision.</p>) },
                                      { id: 'undergraduate', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Undergraduate', value: 'undergraduate', endpoint: 'place_of_study', tooltip: (<p>You are flexible with move-in, so the price, location, quality mix will determine your final decision.</p>) },
                                      { id: 'graduate', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Graduate', value: 'graduate', endpoint: 'place_of_study', tooltip: (<p>You are flexible with move-in, so the price, location, quality mix will determine your final decision.</p>) },
                                      { id: 'phd', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'PhD', value: 'phd', endpoint: 'place_of_study', tooltip: (<p>You are flexible with move-in, so the price, location, quality mix will determine your final decision.</p>) },
                                      { id: 'prof_cert', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Professional Certification', value: 'prof_cert', endpoint: 'place_of_study', tooltip: (<p>You are flexible with move-in, so the price, location, quality mix will determine your final decision.</p>) },
                                    ]
                                  }}
                                  texts={[
                                    { id: '1', scrollDown: true, text: `Select all the levels of education you have completed or in process of completing.` },
                                  ]}
                                  onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                  triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                  multi
                                  other
                               />) },
       {
         id: 'place_of_study',
         component: (<InputSegment
                                 schema={{ id: 'place_of_study', endpoint: 'finish' }}
                                 triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                 onDone={(original_id, endpoint, data) => this.doneName(original_id, endpoint, data)}
                                 texts={[
                                   { id: '1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: "What did you study and where?" },
                                 ]}
                                 inputType={'text'}
                              />)},
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
                                   { id: '1', scrollDown: true, text: `Ok I've filtered out the rentals that fit your move-in preferences.` },
                                   { id: '2', scrollDown: true, text: `Many online ads don't mention the move-in date or lease length, so I will still show those.` },
                                   { id: '3', scrollDown: true, text: `Ready to see your matches?` },
                                 ]}
                                 triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                 onDone={(original_id, endpoint, data) => this.action(original_id, endpoint, data)}
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
			<div id='RoommatesDialog' onClick={() => this.props.toggleInstantCharsSegmentID(this.shown_segments[this.shown_segments.length - 1].id)} style={comStyles().container}>
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
RoommatesDialog.propTypes = {
	history: PropTypes.object.isRequired,
  toggleInstantCharsSegmentID: PropTypes.func.isRequired,
}

// for all optional props, define a default value
RoommatesDialog.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(RoommatesDialog)

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
