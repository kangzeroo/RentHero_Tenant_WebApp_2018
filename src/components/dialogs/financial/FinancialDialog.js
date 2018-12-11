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
import { savePreferences } from '../../../api/prefs/prefs_api'
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
import MultiCounterSegment from '../../modules/AdvisorUI_v2/Segments/MultiCounterSegment'
import ActionSegment from '../../modules/AdvisorUI_v2/Segments/ActionSegment'
import MultiInputSegment from '../../modules/AdvisorUI_v2/Segments/MultiInputSegment'
import FileUploadSegment from '../../modules/AdvisorUI_v2/Segments/FileUploadSegment'
import ShareUrlSegment from '../../modules/AdvisorUI_v2/Segments/ShareUrlSegment'
import { ACCENT_COLOR, FONT_COLOR, BACKGROUND_COLOR, BACKGROUND_WEBKIT, BACKGROUND_MODERN, FONT_FAMILY, FONT_FAMILY_ACCENT } from '../../modules/AdvisorUI_v2/styles/advisor_ui_styles'


class FinancialDialog extends Component {

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
  }

  componentWillMount() {
    this.rehydrateSegments()
    this.shown_segments = this.shown_segments.concat(this.all_segments.slice(0, 1))
    this.setState({ lastUpdated: moment().unix() })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.prefs !== this.props.prefs) {
      this.rehydrateSegments()
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
        id: 'privacy_notice',
        component: (<MessageSegment
          schema={{ id: 'privacy_notice', endpoint: 'ideal_budget' }}
          triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
          onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
          texts={[
            ...this.addAnyPreMessages('privacy_notice'),
            { id: '1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, containerStyles: { margin: '30px 0px 0px 20px' }, text: 'I will help you calculate the affordability of different rentals based on your income.' },
            { id: '2', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: `These details will not be shared unless you choose to put it on your rent applications.` },
          ]}
          action={{ enabled: true, label: 'Continue', actionStyles: { width: '100%' } }}
          segmentStyles={{ justifyContent: 'space-between' }}
        />) },
      {
        id: 'ideal_budget',
        scrollStyles: { scroll_styles: { backgroundImage: `url('https://www.narcity.com/uploads/255957_a863b146f86b05303b1f5948bd320e656e2bf4e3.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
        component: (<CounterSegment
                                title='Ideal Budget'
                                schema={{ id: 'ideal_budget', endpoint: 'working_studying' }}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                onDone={(original_id, endpoint, data) => this.doneIdealBudget(original_id, endpoint, data)}
                                texts={[
                                  ...this.addAnyPreMessages('ideal_budget'),
                                  { id: '1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'What is your ideal price per person?' },
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
         id: 'working_studying',
         component: (<MultiOptionsSegment
                               title='Working or Studying'
                               schema={{
                                 id: 'working_studying',
                                 endpoint: 'educational_background',
                                 choices: [
                                   { id: 'employed_full_time', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Employed Full Time', value: false, endpoint: 'total_employment_income' },
                                   { id: 'employed_part_time', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Employed Part Time', value: false, endpoint: 'total_employment_income' },
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
          id: 'total_employment_income',
          component: (<CounterSegment
                              title='Employment Income'
                              schema={{ id: 'total_employment_income', endpoint: 'job_titles' }}
                              triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                              onDone={(original_id, endpoint, data) => this.doneIncomeReport(original_id, endpoint, data, 'EMPLOYED')}
                              texts={[
                                ...this.addAnyPreMessages('total_employment_income'),
                                { id: '1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'What is your monthly total income after tax from all your jobs? Employment income only!' },
                              ]}
                              incrementerOptions={{
                                max: 10000,
                                min: 0,
                                step: 250,
                                default: 0,
                              }}
                              slider
                              sliderOptions={{
                                max: 10000,
                                min: 0,
                                step: 500,
                              }}
                              renderCountValue={(count) => `$ ${count}`}
                              initialData={{
                                count: this.props.prefs.FINANCIALS.INCOME.EMPLOYED
                              }}
                         /> )},
      {
         id: 'job_titles',
         component: (<MultiInputSegment
                             title='Job Titles'
                             schema={{ id: 'job_titles', endpoint: 'proof_of_employment' }}
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
          id: 'proof_of_employment',
          component: (<MultiOptionsSegment
                                title='Proof of Employment'
                                schema={{
                                  id: 'proof_of_employment',
                                  endpoint: 'educational_background',
                                  choices: [
                                    { id: 'paycheque', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Employer Paycheque', value: false, endpoint: 'educational_background', tooltip: (<p>Tooltip A</p>) },
                                    { id: 'employment_letter', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Letter of Employment', value: false, endpoint: 'educational_background', tooltip: (<p>Tooltip A</p>) },
                                    { id: 'personal_tax', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Personal Income Tax Filing', value: false, endpoint: 'educational_background', tooltip: (<p>Tooltip A</p>) },
                                    { id: 'bank_deposit', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Bank Deposit Activity', value: false, endpoint: 'educational_background', tooltip: (<p>Tooltip A</p>) },
                                    { id: 'none', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'None', value: false, endpoint: 'educational_background', tooltip: (<p>Tooltip A</p>) },
                                  ]
                                }}
                                texts={[
                                  ...this.addAnyPreMessages('proof_of_employment'),
                                  { id: '1', text: `Are you able to provide proof of income from your job? ℹ️id[why_proof]`, tooltips: [{ id: 'why_proof', tooltip: (<div>Landlords require proof of income to reassure them that you are able to pay rent. It is a commonly expected document for anywhere you rent.</div>) }] },
                                  { id: '2', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Select all that you can obtain.' },
                                ]}
                                preselected={this.props.prefs.FINANCIALS.PROOF_OF_INCOMES_AS_SCHEMAS}
                                onDone={(original_id, endpoint, data) => this.doneProofs(original_id, endpoint, data)}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                multi
                                other
                             />) },
      {
         id: 'proof_of_student',
         component: (<MultiOptionsSegment
                             title='Proof of Student Status'
                             schema={{
                               id: 'proof_of_student',
                               endpoint: 'educational_background',
                               choices: [
                                 { id: 'student_card', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Student Card', value: false, endpoint: 'educational_background', tooltip: (<p>Tooltip A</p>) },
                                 { id: 'course_transcript', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Course Transcript', value: false, endpoint: 'educational_background', tooltip: (<p>Tooltip A</p>) },
                                 { id: 'tuition_bill', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Tuition Bill', value: false, endpoint: 'educational_background', tooltip: (<p>Tooltip A</p>) },
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
        id: 'type_of_self_employed',
        component: (<MultiOptionsSegment
                          title='Self Employed Status'
                          schema={{
                            id: 'type_of_self_employed',
                            endpoint: 'total_self_employed_income',
                            choices: [
                              { id: 'gig_job', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Gig Job', value: false, endpoint: 'total_self_employed_income', tooltip: (<p>Tooltip A</p>) },
                              { id: 'small_business', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Small Business', value: false, endpoint: 'total_self_employed_income', tooltip: (<p>Tooltip A</p>) },
                              { id: 'professional_services', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Professional Services', value: false, endpoint: 'total_self_employed_income', tooltip: (<p>Tooltip A</p>) },
                              { id: 'tech_startup', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Tech Startup', value: false, endpoint: 'total_self_employed_income', tooltip: (<p>Tooltip A</p>) },
                              { id: 'content_creator', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Content Creator', value: false, endpoint: 'total_self_employed_income', tooltip: (<p>Tooltip A</p>) },
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
         id: 'total_self_employed_income',
         component: (<CounterSegment
                         title='Self Employment Income'
                         schema={{ id: 'total_self_employed_income', endpoint: 'proof_of_self_employed' }}
                         triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                         onDone={(original_id, endpoint, data) => this.doneIncomeReport(original_id, endpoint, data, 'SELF_EMPLOYED')}
                         texts={[
                           ...this.addAnyPreMessages('total_self_employed_income'),
                           { id: '1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'What is your total montly income from your self employment?' },
                         ]}
                         incrementerOptions={{
                           max: 12000,
                           min: 0,
                           step: 250,
                           default: 0,
                         }}
                         slider
                         sliderOptions={{
                           max: 12000,
                           min: 0,
                           step: 500,
                         }}
                         renderCountValue={(count) => `$ ${count}`}
                         initialData={{
                           count: this.props.prefs.FINANCIALS.INCOME.SELF_EMPLOYED
                         }}
                    /> )},
      {
        id: 'proof_of_self_employed',
        component: (<MultiOptionsSegment
                            title='Proof of Self Employment'
                            schema={{
                              id: 'proof_of_self_employed',
                              endpoint: 'educational_background',
                              choices: [
                                { id: 'regular_payouts', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Regular Payouts', value: false, endpoint: 'educational_background', tooltip: (<p>Tooltip A</p>) },
                                { id: 'irregular_payouts', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Irregular Payouts', value: false, endpoint: 'educational_background', tooltip: (<p>Tooltip A</p>) },
                                { id: 'personal_income_tax_filing', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Personal Income Tax Filing', value: false, endpoint: 'educational_background', tooltip: (<p>Tooltip A</p>) },
                                { id: 'bank_deposits_activity', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Bank Deposit Activity', value: false, endpoint: 'educational_background', tooltip: (<p>Tooltip A</p>) },
                                { id: 'none', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'None', value: false, endpoint: 'educational_background', tooltip: (<p>Tooltip A</p>) },
                              ]
                            }}
                            texts={[
                              ...this.addAnyPreMessages('proof_of_self_employed'),
                              { id: '1', text: `Are you able to show consistent proof of income from your self employment, for at least the past 6 months? ℹ️id[why_proof]`, tooltips: [{ id: 'why_proof', tooltip: (<div>Landlords require proof of income to reassure them that you are able to pay rent. It is a commonly expected document for anywhere you rent.</div>) }] },
                              { id: '2', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Select all options for proof of income you are able to obtain.' },
                            ]}
                            preselected={this.props.prefs.FINANCIALS.PROOF_OF_INCOMES_AS_SCHEMAS}
                            onDone={(original_id, endpoint, data) => this.doneProofs(original_id, endpoint, data)}
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
                             endpoint: 'total_welfare_income',
                             choices: [
                               { id: 'odsp', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'ODSP - Ontario Disability', value: false, endpoint: 'total_welfare_income', tooltip: (<p>Tooltip A</p>) },
                               { id: 'osap', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'OSAP - Student Assistance', value: false, endpoint: 'total_welfare_income', tooltip: (<p>Tooltip A</p>) },
                               { id: 'ontario_works', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Ontario Works - Unemployment', value: false, endpoint: 'total_welfare_income', tooltip: (<p>Tooltip A</p>) },
                               { id: 'retirement_pension', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Retirement Pension', value: false, endpoint: 'total_welfare_income', tooltip: (<p>Tooltip A</p>) },
                               { id: 'none', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'None', value: false, endpoint: 'total_welfare_income', tooltip: (<p>Tooltip A</p>) },
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
        id: 'total_welfare_income',
        component: (<CounterSegment
                        title='Social Assistance Income'
                        schema={{ id: 'total_welfare_income', endpoint: 'proof_of_welfare' }}
                        triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                        onDone={(original_id, endpoint, data) => this.doneIncomeReport(original_id, endpoint, data, 'WELFARE')}
                        texts={[
                          ...this.addAnyPreMessages('total_welfare_income'),
                          { id: '1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'What is your monthly total from all those assistance programmes?' },
                        ]}
                        incrementerOptions={{
                          max:5000,
                          min: 0,
                          step: 100,
                          default: 0,
                        }}
                        slider
                        sliderOptions={{
                          max: 5000,
                          min: 0,
                          step: 250,
                        }}
                        renderCountValue={(count) => `$ ${count}`}
                        initialData={{
                          count: this.props.prefs.FINANCIALS.INCOME.WELFARE
                        }}
                   /> )},
      {
        id: 'proof_of_welfare',
        component: (<MultiOptionsSegment
                           title='Proof of Social Assistance Income'
                           schema={{
                             id: 'proof_of_welfare',
                             endpoint: 'educational_background',
                             choices: [
                               { id: 'bank_deposits_activity', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Bank Deposits Activity', value: false, endpoint: 'educational_background', tooltip: (<p>Tooltip A</p>) },
                               { id: 'official_govt_doc', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Official Government Document', value: false, endpoint: 'educational_background', tooltip: (<p>Tooltip A</p>) },
                               { id: 'regular_payouts', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Regular Payouts', value: false, endpoint: 'educational_background', tooltip: (<p>Tooltip A</p>) },
                               { id: 'none', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'None', value: false, endpoint: 'educational_background', tooltip: (<p>Tooltip A</p>) },
                             ]
                           }}
                           texts={[
                             ...this.addAnyPreMessages('proof_of_welfare'),
                             { id: '1', text: `Are you able to provide proof of income from your assistance payments? ℹ️id[why_proof]`, tooltips: [{ id: 'why_proof', tooltip: (<div>Landlords require proof of income to reassure them that you are able to pay rent. It is a commonly expected document for anywhere you rent.</div>) }] },
                           ]}
                           preselected={this.props.prefs.FINANCIALS.PROOF_OF_INCOMES_AS_SCHEMAS}
                           onDone={(original_id, endpoint, data) => this.doneProofs(original_id, endpoint, data)}
                           triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                           multi
                           other
                        />) },
     {
        id: 'educational_background',
        component: (<MultiInputSegment
                            title='Educational Background'
                            schema={{ id: 'educational_background', endpoint: 'other_cash_flows' }}
                            triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                            onDone={(original_id, endpoint, data) => this.doneEducationalBackground(original_id, endpoint, data)}
                            texts={[
                              ...this.addAnyPreMessages('educational_background'),
                              { id: '1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Enter any education you have completed or in process of completing.' },
                              { id: '2', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Include your status (current or graduated), level of education (eg. diploma or undergrad), school and field of study.' },
                              { id: '3', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'For example, "Current undergraduate at Ryerson Nursing"' },
                              { id: '4', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Professional designations such as CFA, General Practitioner and Certified Paralegal count too!' },
                            ]}
                            inputs={this.props.prefs.FINANCIALS.STUDIED_AS_SCHEMAS}
                            inputType={'text'}
                            minChars={5}
                         /> )},
      {
        id: 'other_cash_flows',
        component: (<MultiOptionsSegment
                          title='Other Income'
                          schema={{
                            id: 'other_cash_flows',
                            endpoint: 'total_other_cash_flows',
                            choices: [
                              { id: 'family_assistance', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Family Assistance', value: false, endpoint: 'total_other_cash_flows', tooltip: (<p>Tooltip A</p>) },
                              { id: 'investments', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Investments', value: false, endpoint: 'total_other_cash_flows', tooltip: (<p>Tooltip A</p>) },
                              { id: 'cash_jobs', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Cash Jobs', value: false, endpoint: 'total_other_cash_flows', tooltip: (<p>Tooltip A</p>) },
                            ]
                          }}
                          texts={[
                            ...this.addAnyPreMessages('other_cash_flows'),
                            { id: '1', text: `Do you receive any regular money from any other sources?` },
                          ]}
                          preselected={this.props.prefs.FINANCIALS.OTHER_INCOME_AS_SCHEMAS}
                          onDone={(original_id, endpoint, data) => this.doneTypeOtherIncome(original_id, endpoint, data)}
                          triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                          multi
                          other
                       />) },
      {
        id: 'total_other_cash_flows',
        component: (<CounterSegment
                       title='Total Other Income'
                       schema={{ id: 'total_other_cash_flows', endpoint: 'income_breakdown' }}
                       triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                       onDone={(original_id, endpoint, data) => this.doneIncomeReport(original_id, endpoint, data, 'OTHER')}
                       texts={[
                         ...this.addAnyPreMessages('total_other_cash_flows'),
                         { id: '1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'What is the monthly total of your family, investments and other income sources?' },
                       ]}
                       incrementerOptions={{
                         max:10000,
                         min: 0,
                         step: 500,
                         default: 0,
                       }}
                       slider
                       sliderOptions={{
                         max: 10000,
                         min: 0,
                         step: 500,
                       }}
                       initialData={{
                         count: this.props.prefs.FINANCIALS.INCOME.OTHER
                       }}
                       renderCountValue={(count) => `$ ${count}`}
                  /> )},
      {
        id: 'income_breakdown',
        component: (<MultiCounterSegment
                          title='Breakdown of Income'
                          schema={{ id: 'income_breakdown', endpoint: 'cash_deposit_banked' }}
                          triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                          onDone={(original_id, endpoint, data) => this.doneIncomeBreakdown(original_id, endpoint, data)}
                          texts={[
                            ...this.addAnyPreMessages('income_breakdown'),
                            { id: '1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Your monthly income is seperated into regular and adhoc income.' },
                            { id: '2', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Based on your answers, are these are your correct amounts? Please modify if necessary.' },
                          ]}
                          counters={[
                            { id: 'REPORTED_REGULAR', renderCountValue: (c) => c, incrementerOptions: { min: 0, max: 150000, step: 500, default: this.props.prefs.FINANCIALS.INCOME.REPORTED_REGULAR }, text: 'Regular Income', value: this.props.prefs.FINANCIALS.INCOME.REPORTED_REGULAR, tooltip: (<p>20 kg or less</p>) },
                            { id: 'REPORTED_ADHOC', renderCountValue: (c) => c, incrementerOptions: { min: 0, max: 150000, step: 500, default: this.props.prefs.FINANCIALS.INCOME.REPORTED_ADHOC }, text: 'Ad-hoc Income', value: this.props.prefs.FINANCIALS.INCOME.REPORTED_ADHOC, tooltip: (<p>20 kg or more</p>) },
                          ]}
                       /> )},
      {
        id: 'cash_deposit_banked',
        component: (<CounterSegment
                         title='Cash for Deposits'
                         schema={{ id: 'cash_deposit_banked', endpoint: 'cash_deposit_biddable' }}
                         triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                         onDone={(original_id, endpoint, data) => this.doneCashDeposit(original_id, endpoint, data)}
                         texts={[
                           ...this.addAnyPreMessages('cash_deposit_banked'),
                           { id: '1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Landlords in Ontario typically expect 2 months of rent as deposit.' },
                           { id: '2', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'How much cash do you have in your bank to cover your portion of the deposit? A guess is fine.' },
                         ]}
                         incrementerOptions={{
                           max:10000,
                           min: 0,
                           step: 250,
                           default: 0,
                         }}
                         slider
                         sliderOptions={{
                           max: 10000,
                           min: 0,
                           step: 250,
                         }}
                         initialData={{
                           count: this.props.prefs.FINANCIALS.DEPOSIT_CASH
                         }}
                         renderCountValue={(count) => `$ ${count}`}
                    /> )},
     {
       id: 'any_guarantors',
       component: (<MultiOptionsSegment
                        title='Guarantors'
                        schema={{
                          id: 'any_guarantors',
                          endpoint: 'cash_deposit_biddable',
                          choices: [
                            { id: 'canadian_guarantor', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Yes, I have a Canadian Guarantor', value: false, endpoint: 'cash_deposit_biddable', tooltip: (<p>Tooltip A</p>) },
                            { id: 'international_guarantor', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'I have an International Guarantor', value: false, endpoint: 'cash_deposit_biddable', tooltip: (<p>Tooltip A</p>) },
                            { id: 'no_guarantor', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'No Guarantor', value: false, endpoint: 'cash_deposit_biddable', tooltip: (<p>Tooltip A</p>) },
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
                     />) },
      {
        id: 'cash_deposit_biddable',
        component: (<CounterSegment
                    title='Higher Security Deposit'
                    schema={{ id: 'cash_deposit_biddable', endpoint: 'names_on_lease' }}
                    triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                    onDone={(original_id, endpoint, data) => this.doneDepositBid(original_id, endpoint, data)}
                    texts={[
                      ...this.addAnyPreMessages('cash_deposit_biddable'),
                      { id: '1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Since you have no income and no guarantor, landlords will expect a higher rent deposit as a form of security.' },
                      { id: '2', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'How many months of rent are you able to put for a cash deposit?' },
                    ]}
                    incrementerOptions={{
                      max:10000,
                      min: 0,
                      step: 250,
                      default: 0,
                    }}
                    slider
                    sliderOptions={{
                      max: 10000,
                      min: 0,
                      step: 250,
                    }}
                    initialData={{
                      count: this.props.prefs.FINANCIALS.DEPOSIT_CASH_BID
                    }}
                    renderCountValue={(count) => `$ ${count}`}
               /> )},
      {
        id: 'names_on_lease',
        component: (<MultiOptionsSegment
                      title='Names on Lease'
                      schema={{
                        id: 'names_on_lease',
                        endpoint: 'names_on_lease_disclaimer',
                        choices: [
                          { id: 'just_me_lease', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Just Me', value: false, endpoint: 'names_on_lease_disclaimer', tooltip: (<p>Tooltip A</p>) },
                          { id: 'select_people_in_group', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'A Few People In My Group', value: false, endpoint: 'names_on_lease_disclaimer', tooltip: (<p>Note</p>) },
                          { id: 'everyone_in_group', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Everyone in my Group', value: false, endpoint: 'names_on_lease_disclaimer', tooltip: (<p>Tooltip A</p>) },
                          { id: 'undecided', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Undecided', value: false, endpoint: 'names_on_lease_disclaimer', tooltip: (<p>Tooltip A</p>) },
                        ]
                      }}
                      texts={[
                        ...this.addAnyPreMessages('names_on_lease'),
                        { id: '1', text: `Whose name will be on the lease?` },
                        { id: '2', text: `Some rentals allow multiple names on the lease, but others only allow one.` },
                        { id: '3', text: `Lease signers and their guarantors will be legally responsible for rent payment, damages and legal responsibility.` },
                      ]}
                      preselected={this.props.prefs.FINANCIALS.SIGN_LEASE_AS_SCHEMAS}
                      onDone={(original_id, endpoint, data) => this.doneNamesOnLease(original_id, endpoint, data)}
                      triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                      other
                   />) },
      {
        id: 'names_on_lease_disclaimer',
        component: (<MessageSegment
                        title='Lease Disclaimer'
                        schema={{ id: 'names_on_lease_disclaimer', endpoint: 'option_to_readjust_budget' }}
                        triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                        onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                        action={{ enabled: true, label: 'Ok' }}
                        texts={[
                          ...this.addAnyPreMessages('names_on_lease_disclaimer'),
                          { id: '1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Some Important Things To Know' },
                          { id: '2', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'By signing the lease entirely in your name, any roommates that pay you rent are technically sublets. Click here to learn more about lease liability.' },
                          { id: '3', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'If your own personal income is not enough to cover the entire lease, you will need to tell the landlord that your roommates are paying you.' },
                          { id: '4', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'They will all need to provide proof of income too.' },
                        ]}
                      />) },
      {
        id: 'option_to_readjust_budget',
        component: (<MultiOptionsSegment
                     title='Financial Overview'
                     schema={{
                       id: 'option_to_readjust_budget',
                       endpoint: 'budget_flex',
                       choices: [
                         { id: 'change_budget', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Change My Budget', value: false, endpoint: 're_adjust_budget', tooltip: (<p>Tooltip A</p>) },
                         { id: 'keep_it', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Keep It', value: false, endpoint: 'budget_flex', tooltip: (<p>Note</p>) },
                       ]
                     }}
                     texts={[
                       ...this.addAnyPreMessages('financial_overflow'),
                       { id: '1', text: `Based on your financial status, your target rent price of $${this.props.prefs.FINANCIALS.IDEAL_PER_PERSON} is ${(this.props.prefs.FINANCIALS.IDEAL_PER_PERSON/this.props.prefs.FINANCIALS.INCOME.REPORTED_REGULAR*100).toFixed(0)}% of your regular monthly income.` },
                       { id: '2', text: `${this.calculateAffordability()}` },
                       { id: '3', text: `Would you like to change your budget or keep it?` },
                     ]}
                     onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                     triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                     other
                  />) },
      {
        id: 're_adjust_budget',
        component: (<CounterSegment
                      title='Adjust Budget'
                      schema={{ id: 're_adjust_budget', endpoint: 'budget_flex' }}
                      triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                      onDone={(original_id, endpoint, data) => this.doneIdealBudget(original_id, endpoint, data)}
                      texts={[
                        ...this.addAnyPreMessages('re_adjust_budget'),
                        { id: '0-1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Update your personal budget.' },
                      ]}
                      incrementerOptions={{
                        max: 10000,
                        min: 0,
                        step: 500,
                        default: 100,
                      }}
                      slider
                      sliderOptions={{
                        max: 10000,
                        min: 0,
                        step: 250,
                      }}
                      initialData={{
                        count: this.props.prefs.FINANCIALS.IDEAL_PER_PERSON
                      }}
                      renderCountValue={(count) => `$ ${count}`}
                 /> )},
      {
        id: 'budget_flex',
        component: (<CounterSegment
                     title='Budget Flexability'
                     schema={{ id: 'budget_flex', endpoint: 'see_matches' }}
                     triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                     onDone={(original_id, endpoint, data) => this.doneBudgetFlex(original_id, endpoint, data)}
                     texts={[
                       ...this.addAnyPreMessages('budget_flex'),
                       { id: '1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Sometimes the perfect place is a little bit outside your ideal budget.' },
                       { id: '2', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'How flexible are you in rent if the place is right?' },
                     ]}
                     incrementerOptions={{
                       max: 500,
                       min: 0,
                       step: 50,
                       default: 0,
                     }}
                     initialData={{
                       count: this.props.prefs.FINANCIALS.BUDGET_FLEXIBILITY
                     }}
                     renderCountValue={(count) => `$ ${count}`}
                /> )},
      {
        id: 'see_matches',
        component: (<ActionSegment
                      title='FINISH'
                      schema={{
                        id: 'see_matches',
                        endpoint: null,
                        choices: [
                          { id: 'see_matches', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'View Matches', value: 'abort', endpoint: null },
                          { id: 'update_housing_options', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Update Housing Options', value: 'abort', endpoint: null },
                        ]
                      }}
                      texts={[
                        ...this.addAnyPreMessages('see_matches'),
                        { id: '1', scrollDown: true, text: `Ok, I found some matches for you. Do you want to see them now, or would you like to update your group's housing options?` }
                      ]}
                      triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                      onDone={(original_id, endpoint, data) => this.action(original_id, endpoint, data)}
                    />) },
    ]
    this.setState({ lastUpdated: moment().unix() })
  }

  doneIdealBudget(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.FINANCIALS.KEY,
      IDEAL_PER_PERSON: data.count,
    }).then((FINANCIALS) => {
      this.props.updatePreferences(FINANCIALS)
    }).catch((err) => {
      console.log(err)
    })
  }

  employedAsDone(original_id, endpoint, data) {
    // the endpoint coming in from <MultiOptionsSegment> is the default
    // the data.selected_choices are fed in from schema.choices, which has endpoints associated with them
    // so we go to the first employment type endpoint, and when we finish an employment type we can go to any others (see doneProofs)
    const choices = data.selected_choices.filter(s => s.endpoint)
    if (choices[0] && choices[0].endpoint) {
      this.done(original_id, choices[0].endpoint, data)
    } else {
      this.done(original_id, endpoint, data)
    }
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.FINANCIALS.KEY,
      EMPLOYED_AS: data.selected_choices.map(s => s.text),
      EMPLOYED_AS_SCHEMAS: data.selected_choices,
    }).then((FINANCIALS) => {
      this.props.updatePreferences(FINANCIALS)
    }).catch((err) => {
      console.log(err)
    })
  }

  jobTitlesDone(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.FINANCIALS.KEY,
      JOB_TITLES_AS: data.inputs.map(i => i.text),
      JOB_TITLES_AS_SCHEMAS: data.inputs,
    }).then((FINANCIALS) => {
      this.props.updatePreferences(FINANCIALS)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneIncomeReport(original_id, endpoint, data, attr) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.FINANCIALS.KEY,
      INCOME: {
        ...this.props.prefs.FINANCIALS.INCOME,
        [attr]: data.count
      }
    }).then((FINANCIALS) => {
      this.props.updatePreferences(FINANCIALS)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneTypeSelfEmployed(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.FINANCIALS.KEY,
      SELF_EMPLOYED_AS: data.selected_choices.map(s => s.text),
      SELF_EMPLOYED_AS_SCHEMAS: data.selected_choices,
    }).then((FINANCIALS) => {
      this.props.updatePreferences(FINANCIALS)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneTypeWelfare(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.FINANCIALS.KEY,
      WELFARE_AS: data.selected_choices.map(s => s.text),
      WELFARE_AS_SCHEMAS: data.selected_choices,
    }).then((FINANCIALS) => {
      this.props.updatePreferences(FINANCIALS)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneTypeOtherIncome(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.FINANCIALS.KEY,
      OTHER_INCOME_AS: data.selected_choices.map(s => s.text),
      OTHER_INCOME_AS_SCHEMAS: data.selected_choices,
    }).then((FINANCIALS) => {
      this.props.updatePreferences(FINANCIALS)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneDepositBid(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.FINANCIALS.KEY,
      DEPOSIT_CASH_BID: data.count,
    }).then((FINANCIALS) => {
      this.props.updatePreferences(FINANCIALS)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneNamesOnLease(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.FINANCIALS.KEY,
      SIGN_LEASE_AS: data.selected_choices.map(s => s.text),
      SIGN_LEASE_AS_SCHEMAS: data.selected_choices,
    }).then((FINANCIALS) => {
      this.props.updatePreferences(FINANCIALS)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneEducationalBackground(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.FINANCIALS.KEY,
      STUDIED_AS: data.inputs.map(s => s.text),
      STUDIED_AS_SCHEMAS: data.inputs,
    }).then((FINANCIALS) => {
      this.props.updatePreferences(FINANCIALS)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneIncomeBreakdown(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    const regular = data.counters.filter(c => c.id === 'REPORTED_REGULAR')
    const adhoc = data.counters.filter(c => c.id === 'REPORTED_ADHOC')
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.FINANCIALS.KEY,
      INCOME: {
        ...this.props.prefs.FINANCIALS.INCOME,
        REPORTED_REGULAR: regular[0] && regular[0].value ? regular[0].value : 0,
        REPORTED_ADHOC: adhoc[0] && adhoc[0].value ? adhoc[0].value : 0,
      }
    }).then((FINANCIALS) => {
      this.props.updatePreferences(FINANCIALS)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneCashDeposit(original_id, endpoint, data) {
    if (this.props.prefs.FINANCIALS.INCOME.REPORTED_REGULAR/this.props.prefs.FINANCIALS.IDEAL_PER_PERSON > 0.35) {
      this.done(original_id, endpoint, data)
    } else {
      this.done(original_id, 'any_guarantors', data)
    }
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.FINANCIALS.KEY,
      DEPOSIT_CASH: data.count,
    }).then((FINANCIALS) => {
      this.props.updatePreferences(FINANCIALS)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneBudgetFlex(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.FINANCIALS.KEY,
      BUDGET_FLEXIBILITY: data.count,
    }).then((FINANCIALS) => {
      this.props.updatePreferences(FINANCIALS)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneGuarantors(original_id, endpoint, data) {
    this.done(original_id, endpoint, data)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.FINANCIALS.KEY,
      GUARANTOR_STATUS_AS: data.selected_choices.map(s => s.text),
      GUARANTOR_STATUS_AS_SCHEMAS: data.selected_choices,
    }).then((FINANCIALS) => {
      this.props.updatePreferences(FINANCIALS)
    }).catch((err) => {
      console.log(err)
    })
  }

  doneProofs(original_id, endpoint, data) {
    console.log(data)
    console.log(this.props.prefs.FINANCIALS.EMPLOYED_AS_SCHEMAS.filter(sch => sch.endpoint).map(sch => sch.endpoint))
    console.log(this.shown_segments.map(seg => seg.id))
    let nextEndpoint = ''
    this.props.prefs.FINANCIALS.EMPLOYED_AS_SCHEMAS.filter(sch => sch.endpoint).forEach((sch) => {
      let doneAlready = false
      this.shown_segments.forEach((seg) => {
        if (seg.id === sch.endpoint) {
          doneAlready = true
        }
      })
      if (!doneAlready) {
        nextEndpoint = sch.endpoint
      }
    })
    console.log(nextEndpoint)
    if (nextEndpoint && nextEndpoint !== original_id) {
      this.done(original_id, nextEndpoint, data)
    } else {
      this.done(original_id, endpoint, data)
    }
    const newProofs = this.mergeLists(this.props.prefs.FINANCIALS.PROOF_OF_INCOMES_AS_SCHEMAS, data.selected_choices)
    savePreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.FINANCIALS.KEY,
      PROOF_OF_INCOMES_AS: newProofs.map(s => s.text),
      PROOF_OF_INCOMES_AS_SCHEMAS: newProofs,
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

  calculateAffordability() {
    let aff = ''
    const rent_price = this.props.prefs.FINANCIALS.IDEAL_PER_PERSON
    const regular_income = this.props.prefs.FINANCIALS.INCOME.REPORTED_REGULAR
    const adhoc_income = this.props.prefs.FINANCIALS.INCOME.REPORTED_ADHOC
    const total_income = (this.props.prefs.FINANCIALS.INCOME.REPORTED_REGULAR + this.props.prefs.FINANCIALS.INCOME.REPORTED_ADHOC)
    if (regular_income*0.2 > rent_price) {
      aff = 'Your rent is very affordable, as it is less than 20% of your regular monthly income. Yay!'
    } else if (regular_income*0.3 > rent_price) {
      aff = 'Your rent is affordable, as it is less than 30% of your regular monthly income. The maximum recomended is no more than 30%.'
    } else if (regular_income*0.4 > rent_price) {
      aff = 'Your rent price is not recommended. Although there are many people who spend up to 40% of their income on rent, it leaves very little room for savings and other expenses. It is your choice if you want to continue with this budget.'
    } else if (regular_income*0.5 > rent_price && adhoc_income > rent_price*0.75) {
      aff = 'Your rent is affordable as long as you can make enough adhoc income each month. Some landlords may be concerned about your ability to pay rent, but you can reassure them with enough proof of income.'
    } else if (adhoc_income > rent_price) {
      aff = 'Your landlord may feel uneasy renting to someone with mostly adhoc income. Renting will be a challenge, so expect to spend twice as much time searching, as you will need to convince landlords that they can trust you to pay. Paying an extra deposit or having a guarantor helps a lot.'
    } else {
      aff = 'Your rent is not affordable. You should never spend more than 40% of your regular income on rent. It is highly recommended that you adjust your budget.'
    }
    return aff
  }

	render() {
		return (
			<div id='FinancialDialog' onClick={() => this.props.toggleInstantCharsSegmentID(this.shown_segments[this.shown_segments.length - 1].id)} style={comStyles().container}>
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
FinancialDialog.propTypes = {
	history: PropTypes.object.isRequired,
  toggleInstantCharsSegmentID: PropTypes.func.isRequired,
  prefs: PropTypes.array,
  updatePreferences: PropTypes.func.isRequired,
  tenant_id: PropTypes.string.isRequired,
}

// for all optional props, define a default value
FinancialDialog.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(FinancialDialog)

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
      minHeight: '100vh',
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
