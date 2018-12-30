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
import { saveTenantPreferences } from '../../../../api/prefs/prefs_api'
import { updatePreferences } from '../../../../actions/prefs/prefs_actions'
import { toggleInstantCharsSegmentID } from '../../../../actions/app/app_actions'
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
import ActionSegment from '../../../modules/AdvisorUI_v2/Segments/ActionSegment'
import FileUploadSegment from '../../../modules/AdvisorUI_v2/Segments/FileUploadSegment'
import ShareUrlSegment from '../../../modules/AdvisorUI_v2/Segments/ShareUrlSegment'
import PhoneOrEmailRegister from '../../../modules/AdvisorUI_v2/Segments/PhoneOrEmailRegister'
import VerifyCodeSegment from '../../../modules/AdvisorUI_v2/Segments/VerifyCodeSegment'
import { ACCENT_COLOR, FONT_COLOR, BACKGROUND_COLOR, BACKGROUND_WEBKIT, BACKGROUND_MODERN, FONT_FAMILY, FONT_FAMILY_ACCENT } from '../../../modules/AdvisorUI_v2/styles/advisor_ui_styles'
import { PASSWORDLESS_LOGIN_REDIRECT, AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '../../../../api/ENV_CREDs'
import { verifyPhone } from '../../../../api/phone/phone_api'
import { saveTenantProfileToRedux } from '../../../../actions/auth/auth_actions'
import { setTenantID } from '../../../../actions/tenant/tenant_actions'
import { unauthRoleTenant } from '../../../../api/aws/aws-cognito'
import { updateTenantName } from '../../../../api/tenant/tenant_api'
import { getCurrentListingByReference } from '../../../../api/listings/listings_api'
import auth0 from 'auth0-js'


class InterestDialog0 extends Component {

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
          id: 'thanks_for_interest',
          component: (<ActionSegment
                          title='RentHero'
                          schema={{
                            id: 'thanks_for_interest',
                            endpoint: 'name',
                            choices: [
                              { id: 'leave_message', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Message Seller', value: true, endpoint: 'name' },
                              { id: 'tour', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Book A Tour', value: true, endpoint: 'name' },
                            ]
                          }}
                          texts={[
                            { id: '1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, containerStyles: { margin: '30px 0px 0px 20px' }, text: `Thanks for you interest in ${this.props.current_listing ? this.props.current_listing.ADDRESS : 'this property.' }` },
                            // { id: 'img', component: (<img src={this.props.current_listing.IMAGES[0].url} style={{ width: '300px', height: 'auto' }} />) },
                            { id: '2', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: `${this.props.current_listing.BEDS} Beds, ${this.props.current_listing.BATHS} Baths` },
                            { id: '3', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: `$${this.props.current_listing.PRICE} on a ${this.props.current_listing.LEASE_LENGTH} month lease` },
                            { id: '4', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: `Prospective tenants are asked to answer some brief questions.` },
                          ]}
                          triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                          onDone={(original_id, endpoint, data) => this.doneInterest(original_id, endpoint, data)}
                          />) },
        // {
        //   id: 'thanks_for_interest',
        //   component: (<MessageSegment
        //                  schema={{ id: 'thanks_for_interest', endpoint: 'name' }}
        //                  triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
        //                  onDone={(original_id, endpoint, data) => this.doneInterest(original_id, endpoint, data)}
        //                  texts={[
        //                    { id: '1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, containerStyles: { margin: '30px 0px 0px 20px' }, text: `Thanks for you interest in ${this.props.current_listing ? this.props.current_listing.ADDRESS : 'this property.' }` },
        //                    { id: '2', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: `${this.props.current_listing.BEDS} Beds, ${this.props.current_listing.BATHS} Baths` },
        //                    { id: '3', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: `$${this.props.current_listing.PRICE} on a ${this.props.current_listing.LEASE_LENGTH} month lease` },
        //                    { id: '4', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: `Prospective tenants are asked to answer some brief questions.` },
        //                  ]}
        //                  action={{ enabled: true, label: 'Begin Application', actionStyles: { width: '100%' } }}
        //                  segmentStyles={{ justifyContent: 'space-between' }}
        //                />) },
      {
        id: 'name',
        comment: 'whats your name',
        // scrollStyles: { scroll_styles: { backgroundImage: `url('http://www.gohaus.com/wp-content/uploads/2015/12/living-room-floor-design-ideas.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.6)' } },
        component: (<InputSegment
                                title='Introductions'
                                schema={{ id: 'name', endpoint: 'ideal_movein' }}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                onDone={(original_id, endpoint, data) => this.doneName(original_id, endpoint, data)}
                                texts={[
                                  ...this.addAnyPreMessages('name'),
                                  { id: '0-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: "First things first, what is your name? 😊" },
                                ]}
                                inputType={'text'}
                                stringInputPlaceholder={'First Name'}
                                initialData={{
                                  input_string: this.props.prefs.DOCUMENTS.PREFERRED_NAME
                                }}
                             />)},
       {
         id: 'phone',
         // scrollStyles: { scroll_styles: { backgroundImage: `url('http://www.gohaus.com/wp-content/uploads/2015/12/living-room-floor-design-ideas.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.6)' } },
         component: (<PhoneOrEmailRegister
                                 title='Phone Number'
                                 schema={{ id: 'phone', endpoint: 'verify_phone' }}
                                 triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                 onDone={(original_id, endpoint, data) => this.doneRegister(original_id, endpoint, data)}
                                 texts={[
                                   ...this.addAnyPreMessages('phone'),
                                   { id: '0-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: `Nice to meet you ${this.state.first_name} 🤝 What is your phone number?` },
                                 ]}
                                 inputType={'tel'}
                                 initialData={{
                                   input_string: this.props.prefs.DOCUMENTS.PREFERRED_NAME
                                 }}
                              />)},
      {
        id: 'verify_phone',
        // scrollStyles: { scroll_styles: { backgroundImage: `url('http://www.gohaus.com/wp-content/uploads/2015/12/living-room-floor-design-ideas.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.6)' } },
        component: (<VerifyCodeSegment
                                title='Verification'
                                schema={{ id: 'verify_phone', endpoint: 'ideal_movein' }}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                onDone={(original_id, endpoint, data) => this.doneVerify(original_id, endpoint, data)}
                                texts={[
                                  ...this.addAnyPreMessages('verify_phone'),
                                  { id: '0-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: "I sent a verification code to you. Please enter it below 🔒" },
                                ]}
                                inputType={'number'}
                                stringInputPlaceholder={'Verification Code'}
                                initialData={{
                                  // input_string: this.props.prefs.DOCUMENTS.PREFERRED_NAME
                                }}
                                resendCode={() => this.resendCode()}
                             />)},
        {
          id: 'ideal_movein',
          // scrollStyles: { scroll_styles: { backgroundImage: `url('https://www.apartmentguide.com/blog/wp-content/uploads/2011/09/moving-truck-Christina-Richards-original.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.5)' } },
          component: (<DatePickerSegment
                          title='Ideal Move-In Date'
                          schema={{ id: 'ideal_movein', endpoint: 'working_studying' }}
                          triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                          onDone={(original_id, endpoint, data) => this.doneIdealMoveIn(original_id, endpoint, data)}
                          texts={[
                            { id: '1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Awesome! Just a couple of questions now 🤓' },
                            { id: '2', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'What is your ideal move-in date? 📅' }
                          ]}
                          initialData={{
                            date: this.props.prefs.MOVEIN.IDEAL_MOVEIN_DATE ? moment(this.props.prefs.MOVEIN.IDEAL_MOVEIN_DATE).toDate() : new Date()
                          }}
                       /> )},
       {
          id: 'working_studying',
          component: (<MultiOptionsSegment
                                title='Working or Studying'
                                schema={{
                                  id: 'working_studying',
                                  endpoint: 'job_titles',
                                  choices: [
                                    { id: 'employed_full_time', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Employed Full Time', value: false, endpoint: 'job_titles' },
                                    { id: 'employed_part_time', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Employed Part Time', value: false, endpoint: 'job_titles' },
                                    { id: 'student', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Student', value: false, endpoint: 'proof_of_student' },
                                    { id: 'self_employed', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Self Employed', value: false, endpoint: 'type_of_self_employed' },
                                    { id: 'unemployed', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Unemployed', value: false, endpoint: 'welfare_assistance' },
                                    { id: 'retired', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Retired', value: false, endpoint: 'welfare_assistance' },
                                  ]
                                }}
                                texts={[
                                  ...this.addAnyPreMessages('working_studying'),
                                  { id: '1', scrollDown: true, text: 'Are you currently working or studying? Select all that apply.' },
                                ]}
                                onDone={(original_id, endpoint, data) => this.employedAsDone(original_id, endpoint, data)}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                preselected={this.props.prefs.FINANCIALS.EMPLOYED_AS_SCHEMAS}
                                multi
                             />) },
       {
          id: 'job_titles',
          component: (<MultiInputSegment
                              title='Job Titles'
                              schema={{ id: 'job_titles', endpoint: 'finish' }}
                              triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                              onDone={(original_id, endpoint, data) => this.jobTitlesDone(original_id, endpoint, data)}
                              texts={[
                                ...this.addAnyPreMessages('job_titles'),
                                { id: '1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'What is your job title at what company? You can put multiple.' },
                                { id: '2', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'eg. Front Desk support at Toledo Systems' },
                              ]}
                              inputs={this.props.prefs.FINANCIALS.JOB_TITLES_AS_SCHEMAS}
                              inputType={'text'}
                              minChars={1}
                           /> )},
       {
          id: 'proof_of_student',
          component: (<MultiOptionsSegment
                            title='Proof of Student Status'
                            schema={{
                              id: 'proof_of_student',
                              endpoint: 'any_guarantors',
                              choices: [
                                { id: 'student_card', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Student Card', value: false, endpoint: 'any_guarantors', tooltip: (<p>Tooltip A</p>) },
                                { id: 'course_transcript', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Course Transcript', value: false, endpoint: 'any_guarantors', tooltip: (<p>Tooltip A</p>) },
                                { id: 'tuition_bill', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Tuition Bill', value: false, endpoint: 'any_guarantors', tooltip: (<p>Tooltip A</p>) },
                              ]
                            }}
                            texts={[
                              ...this.addAnyPreMessages('proof_of_student'),
                              { id: '1', text: `Are you able to provide proof of income your student status?` },
                              { id: '2', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Select all that you can obtain.' },
                            ]}
                            preselected={this.props.prefs.FINANCIALS.PROOF_OF_INCOMES_AS_SCHEMAS}
                            onDone={(original_id, endpoint, data) => this.doneProofs(original_id, endpoint, data)}
                            triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                            multi
                            other
                         />) },
      {
        id: 'any_guarantors',
        component: (<MultiOptionsSegment
                       title='Guarantors'
                       schema={{
                         id: 'any_guarantors',
                         endpoint: 'finish',
                         choices: [
                           { id: 'canadian_guarantor', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Yes, I have a Canadian Guarantor', value: false, endpoint: 'finish', tooltip: (<p>Tooltip A</p>) },
                           { id: 'international_guarantor', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'I have an International Guarantor', value: false, endpoint: 'finish', tooltip: (<p>Tooltip A</p>) },
                           { id: 'no_guarantor', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'No Guarantor', value: false, endpoint: 'finish', tooltip: (<p>Tooltip A</p>) },
                         ]
                       }}
                       texts={[
                         ...this.addAnyPreMessages('any_guarantors'),
                         { id: '1', text: `If your rent is too high to personally pay, is your family willing to sign your lease as a guarantor?` },
                         { id: '2', text: `This means they are legally liable for rent if you do not pay it.` },
                         { id: '3', text: `In order to be your guarantor, that family member has to be a Canadian Citizen or Permanent Resident.` },
                       ]}
                       preselected={this.props.prefs.FINANCIALS.GUARANTOR_STATUS_AS_SCHEMAS}
                       onDone={(original_id, endpoint, data) => this.doneGuarantors(original_id, endpoint, data)}
                       triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                       other
                       skippable
                       skipEndpoint='names_on_lease'
                    />) },
      {
        id: 'type_of_self_employed',
        component: (<MultiOptionsSegment
                          title='Self Employed Status'
                          schema={{
                            id: 'type_of_self_employed',
                            endpoint: 'any_guarantors',
                            choices: [
                              { id: 'gig_job', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Gig Job', value: false, endpoint: 'any_guarantors', tooltip: (<p>Tooltip A</p>) },
                              { id: 'small_business', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Small Business', value: false, endpoint: 'any_guarantors', tooltip: (<p>Tooltip A</p>) },
                              { id: 'professional_services', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Professional Services', value: false, endpoint: 'any_guarantors', tooltip: (<p>Tooltip A</p>) },
                              { id: 'tech_startup', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Tech Startup', value: false, endpoint: 'any_guarantors', tooltip: (<p>Tooltip A</p>) },
                              { id: 'content_creator', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Content Creator', value: false, endpoint: 'any_guarantors', tooltip: (<p>Tooltip A</p>) },
                            ]
                          }}
                          texts={[
                            ...this.addAnyPreMessages('type_of_self_employed'),
                            { id: '1', text: `What type of self employed best describes your current situation?` },
                          ]}
                          preselected={this.props.prefs.FINANCIALS.SELF_EMPLOYED_AS_SCHEMAS}
                          onDone={(original_id, endpoint, data) => this.doneTypeSelfEmployed(original_id, endpoint, data)}
                          triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                          multi
                          other
                       />) },
       {
          id: 'welfare_assistance',
          component: (<MultiOptionsSegment
                            title='Social Assistance'
                            schema={{
                              id: 'welfare_assistance',
                              endpoint: 'any_guarantors',
                              choices: [
                                { id: 'odsp', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'ODSP - Ontario Disability', value: false, endpoint: 'any_guarantors', tooltip: (<p>Tooltip A</p>) },
                                { id: 'osap', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'OSAP - Student Assistance', value: false, endpoint: 'any_guarantors', tooltip: (<p>Tooltip A</p>) },
                                { id: 'ontario_works', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Ontario Works - Unemployment', value: false, endpoint: 'any_guarantors', tooltip: (<p>Tooltip A</p>) },
                                { id: 'retirement_pension', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Retirement Pension', value: false, endpoint: 'any_guarantors', tooltip: (<p>Tooltip A</p>) },
                                { id: 'none', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'None', value: false, endpoint: 'any_guarantors', tooltip: (<p>Tooltip A</p>) },
                              ]
                            }}
                            texts={[
                              ...this.addAnyPreMessages('welfare_assistance'),
                              { id: '1', text: `Do you receive any corporate, government or social assistance payments?` },
                            ]}
                            preselected={this.props.prefs.FINANCIALS.WELFARE_AS_SCHEMAS}
                            onDone={(original_id, endpoint, data) => this.doneTypeWelfare(original_id, endpoint, data)}
                            triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                            multi
                            other
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
                       { id: '1', scrollDown: true, text: `Thanks for your application! The property manager will review your application and be in contact shortly.` }
                     ]}
                     triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                     onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
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
      this.props.saveTenantProfileToRedux(data.tenant)
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

  registerUnAuthRole() {
    unauthRoleTenant()
      .then((data) => {
        console.log(data)
        this.props.saveTenantProfileToRedux(data)
        this.props.setTenantID(data.tenant_id)
      })
  }

  employedAsDone(original_id, endpoint, data) {
    // the endpoint coming in from <MultiOptionsSegment> is the default
    // the data.selected_choices are fed in from schema.choices, which has endpoints associated with them
    // so we go to the first employment type endpoint, and when we finish an employment type we can go to any others (see doneProofs)
    const nextEndpoint = this.getNextSegment(original_id, endpoint, data)
    if (nextEndpoint && nextEndpoint !== original_id) {
      this.done(original_id, nextEndpoint, data)
    } else {
      this.done(original_id, endpoint, data)
    }
    saveTenantPreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.FINANCIALS.KEY,
      EMPLOYED_AS: data.selected_choices.map(s => s.text).join(', '),
      EMPLOYED_AS_SCHEMAS: data.selected_choices.map(s => {
        return {
          id: s.id,
          text: s.text,
          value: s.value,
          endpoint: s.endpoint,
        }
      }),
    }).then((FINANCIALS) => {
      this.props.updatePreferences(FINANCIALS)
    }).catch((err) => {
      console.log(err)
    })
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

  jobTitlesDone(original_id, endpoint, data) {
    const nextEndpoint = this.getNextSegment(original_id, endpoint, data)
    if (nextEndpoint && nextEndpoint !== original_id) {
      this.done(original_id, nextEndpoint, data)
    } else {
      this.done(original_id, endpoint, data)
    }
    saveTenantPreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.FINANCIALS.KEY,
      JOB_TITLES_AS: data.inputs.map(i => i.text).join(', '),
      JOB_TITLES_AS_SCHEMAS: data.inputs.map(s => {
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

  doneProofs(original_id, endpoint, data) {
    const nextEndpoint = this.getNextSegment(original_id, endpoint, data)
    if (nextEndpoint && nextEndpoint !== original_id) {
      this.done(original_id, nextEndpoint, data)
    } else {
      this.done(original_id, endpoint, data)
    }
    const newProofs = this.mergeLists(this.props.prefs.FINANCIALS.PROOF_OF_INCOMES_AS_SCHEMAS, data.selected_choices)
    saveTenantPreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.FINANCIALS.KEY,
      PROOF_OF_INCOMES_AS: newProofs.map(s => s.text).join(', '),
      PROOF_OF_INCOMES_AS_SCHEMAS: newProofs,
    }).then((FINANCIALS) => {
      this.props.updatePreferences(FINANCIALS)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneTypeSelfEmployed(original_id, endpoint, data) {
    const nextEndpoint = this.getNextSegment(original_id, endpoint, data)
    if (nextEndpoint && nextEndpoint !== original_id) {
      this.done(original_id, nextEndpoint, data)
    } else {
      this.done(original_id, endpoint, data)
    }
    saveTenantPreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.FINANCIALS.KEY,
      SELF_EMPLOYED_AS: data.selected_choices.map(s => s.text).join(', '),
      SELF_EMPLOYED_AS_SCHEMAS: data.selected_choices.map(s => {
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

  doneTypeWelfare(original_id, endpoint, data) {
    const nextEndpoint = this.getNextSegment(original_id, endpoint, data)
    if (nextEndpoint && nextEndpoint !== original_id) {
      this.done(original_id, nextEndpoint, data)
    } else {
      this.done(original_id, endpoint, data)
    }
    saveTenantPreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.FINANCIALS.KEY,
      WELFARE_AS: data.selected_choices.map(s => s.text).join(', '),
      WELFARE_AS_SCHEMAS: data.selected_choices.map(s => {
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

  doneIdealMoveIn(original_id, endpoint, data) {
    const nextEndpoint = this.getNextSegment(original_id, endpoint, data)
    if (nextEndpoint && nextEndpoint !== original_id) {
      this.done(original_id, nextEndpoint, data)
    } else {
      this.done(original_id, endpoint, data)
    }
    saveTenantPreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.MOVEIN.KEY,
      IDEAL_MOVEIN_DATE: moment(data.date).toISOString()
    }).then((MOVEIN) => {
      this.props.updatePreferences(MOVEIN)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneInterest(original_id, endpoint, data) {
    this.done(endpoint, endpoint, data)
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
			<div id='InterestDialog0' onClick={() => this.props.toggleInstantCharsSegmentID(this.shown_segments[this.shown_segments.length - 1].id)} style={comStyles().container}>
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
InterestDialog0.propTypes = {
	history: PropTypes.object.isRequired,
  toggleInstantCharsSegmentID: PropTypes.func.isRequired,
  prefs: PropTypes.object.isRequired,
  updatePreferences: PropTypes.func.isRequired,
  tenant_id: PropTypes.string.isRequired,
  tenant_profile: PropTypes.object.isRequired,
  setCurrentListing: PropTypes.func.isRequired,
  current_listing: PropTypes.object.isRequired,
}

// for all optional props, define a default value
InterestDialog0.defaultProps = {
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(InterestDialog0)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    prefs: redux.prefs,
    tenant_id: redux.auth.tenant_profile.tenant_id,
    tenant_profile: redux.auth.tenant_profile,
    current_listing: redux.listings.current_listing,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    toggleInstantCharsSegmentID,
    updatePreferences,
    saveTenantProfileToRedux,
		setTenantID,
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
      position: 'fixed',
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
