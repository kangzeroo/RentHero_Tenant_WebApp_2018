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
import SegmentTemplate from './Segments/SegmentTemplate'
import MapSegment from './Segments/MapSegment'
import CounterSegment from './Segments/CounterSegment'
import MultiOptionsSegment from './Segments/MultiOptionsSegment'
import DatePickerSegment from './Segments/DatePickerSegment'
import DateRangeSegment from './Segments/DateRangeSegment'
import InputSegment from './Segments/InputSegment'
import MultiInputSegment from './Segments/MultiInputSegment'
import MessageSegment from './Segments/MessageSegment'
import ActionSegment from './Segments/ActionSegment'
import FileUploadSegment from './Segments/FileUploadSegment'
import ShareUrlSegment from './Segments/ShareUrlSegment'
import MultiCounterSegment from './Segments/MultiCounterSegment'
import MultiTagSegment from './Segments/MultiTagSegment'
import MultiTimePickerSegment from './Segments/MultiTimePickerSegment'
import { ACCENT_COLOR, FONT_COLOR, BACKGROUND_COLOR, BACKGROUND_WEBKIT, BACKGROUND_MODERN, FONT_FAMILY, FONT_FAMILY_ACCENT } from './styles/advisor_ui_styles'


class AdvisorUI extends Component {

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
        id: 'x',
        component: (<MessageSegment
                               // GOTCHA: You cannot use a title in combo with segmentStyles={{ justifyContent: 'space-between' }} without making it look fucked
                               // title='Introduction'
                               schema={{ id: 'x', endpoint: 'y' }}
                               triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                               onDone={(original_id, endpoint, data) => this.doneIntro(original_id, endpoint, data)}
                               action={{ enabled: true, label: 'Ok', actionStyles: { width: '100%' } }}
                               texts={[
                                 ...this.addAnyPreMessages('x'),
                                 { id: '0-1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Welcome to the AdvisorUI Framework 👋 Built by RentHero.' },
                                 { id: '0-2', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'This component library is great for making beautiful & customizable conversational interfaces 😍 And yes, you can insert images and custom components!' },
                                 { id: '0-3', delay: 500, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, component: (<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', margin: '50px 0px 0px 0px' }}><img src='https://pbs.twimg.com/profile_images/962170088941019136/lgpCD8X4_400x400.jpg' height='200px' width='auto' style={{ borderRadius: '20px' }} /></div>) },
                                 { id: '0-4', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'Very cool' },
                               ]}
                               segmentStyles={{ justifyContent: 'space-between' }}
                             />) },
      {
        id: 'y',
        component: (<SegmentTemplate
                               title='Template Segment'
                               schema={{ id: 'y', endpoint: 'multi_in' }}
                               triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                               onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                               texts={[
                                 ...this.addAnyPreMessages('y'),
                                 { id: '0-1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'The AdvisorUI is made of Segments, of which there are many kinds.' },
                                 { id: '0-2', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'This particular Segment is a Segment Template. Just copy it whenever you need to make a new custom Segment.' },
                                 { id: '0-3', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'There are even tooltips that you can get info on! ℹ️id[abc-123] Hover over the info icon.', tooltips: [{ id: 'abc-123', tooltip: (<div onClick={() => window.open('https://renthero.fyi','_blank')} style={{ width: '50px', height: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>Click Me</div>) }] }
                               ]}
                               skippable
                               skipEndpoint='multi_in'
                             />) },
         {
           id: 'multi_in',
           component: (<MultiInputSegment
                                   title='Introductions'
                                   schema={{ id: 'multi_in', endpoint: 'taggy' }}
                                   triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                   onDone={(original_id, endpoint, data) => this.doneName(original_id, endpoint, data)}
                                   texts={[
                                     ...this.addAnyPreMessages('multi_in'),
                                     { id: '0-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'We got multiple inputs here!' },
                                   ]}
                                   skippable
                                   skipEndpoint='taggy'
                                   inputs={[]}
                                   inputType={'text'}
                                   stringInputPlaceholder={'Say Something'}
                                   minChars={5}
                                /> )},
         {
             id: 'taggy',
             component: (<MultiTagSegment
                             title='Multi Tag Segment'
                             schema={{ id: 'taggy', endpoint: 'zxc' }}
                             triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                             onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                             texts={[
                               ...this.addAnyPreMessages('taggy'),
                               { id: '0-1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Here is a multi tag segment' },
                             ]}
                             tags={[
                               { id: 'balcony', text: 'Balcony', value: true },
                               { id: 'ensuite_laundry', text: 'Ensuite Laundry', value: false },
                               { id: 'hardwood_floor', text: 'Hardwood Flooring', value: false },
                               { id: 'gas_stove', text: 'Gas Stove', value: true },
                               { id: 'marble_countertop', text: 'Marble Countertops', value: true },
                             ]}
                             skippable
                             skipEndpoint='zxc'
                             other
                           />) },
       {
           id: 'zxc',
           component: (<MultiTimePickerSegment
             title='Multi Time Input'
             schema={{ id: 'zxc', endpoint: 'dddd' }}
             triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
             onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
             texts={[
               ...this.addAnyPreMessages('zxc'),
               { id: '0-1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Here is a multi-time input' },
               { id: '0-2', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: 'Of course you can still do single time input' },
             ]}
             skippable
             skipEndpoint='dddd'
             counters={[
               { id: 'weekday_sleep', renderCountValue: (c) => {
                                         const hours = Math.floor(c/60)
                                         const mins = (c-(hours*60)).toFixed(0)
                                         const pm = hours >= 12 ? 'pm' : 'am'
                                         return `${hours > 12 ? hours - 12 : hours}:${mins == 0 ? '00' : mins} ${pm}`
                                       }, incrementerOptions: { min: 0, max: 1440, step: 30, default: 1380 }, text: 'Weekdays', value: 1380, tooltip: (<p>When you sleep on weekdays</p>) },
               { id: 'weekend_sleep', renderCountValue: (c) => {
                                         const hours = Math.floor(c/60)
                                         const mins = (c-(hours*60)).toFixed(0)
                                         const pm = hours >= 12 ? 'pm' : 'am'
                                         return `${hours > 12 ? hours - 12 : hours}:${mins == 0 ? '00' : mins} ${pm}`
                                       }, incrementerOptions: { min: 0, max: 1440, step: 30, default: 60 }, text: 'Weekends', value: 60, tooltip: (<p>When you sleep on weekends</p>) },
             ]}
           />) },
       {
         id: 'dddd',
         component: (<InputSegment
                                 title='Introductions'
                                 schema={{ id: 'dddd', endpoint: 'eeee' }}
                                 triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                 onDone={(original_id, endpoint, data) => this.doneName(original_id, endpoint, data)}
                                 texts={[
                                   ...this.addAnyPreMessages('dddd'),
                                   { id: '0-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'What is your name?' },
                                 ]}
                                 skippable
                                 skipEndpoint='eeee'
                                 inputType={'text'}
                                 stringInputPlaceholder={'Full Name'}
                                 minChars={5}
                              /> )},
        {
          id: 'eeee',
          component: (<MultiCounterSegment
                                  title='Multi-Counter Segment'
                                  schema={{ id: 'eeee', endpoint: 'xxx' }}
                                  triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                  onDone={(original_id, endpoint, data) => this.doneName(original_id, endpoint, data)}
                                  texts={[
                                    ...this.addAnyPreMessages('eeee'),
                                    { id: '0-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'You can put multiple counters into me!' },
                                  ]}
                                  skippable
                                  skipEndpoint='xxx'
                                  counters={[
                                    { id: 'small_dogs', renderCountValue: (c) => c, incrementerOptions: { min: 0, max: 5, step: 1, default: 0 }, text: 'Small Dogs', value: 0, tooltip: (<p>20 kg or less</p>) },
                                    { id: 'large_dogs', renderCountValue: (c) => c, incrementerOptions: { min: 0, max: 5, step: 1, default: 0 }, text: 'Large Dogs', value: 0, tooltip: (<p>20 kg or more</p>) },
                                    { id: 'cats', renderCountValue: (c) => c, incrementerOptions: { min: 0, max: 5, step: 1, default: 0 }, text: 'Cats', value: 0 },
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
        id: 'xxx',
        scrollStyles: { scroll_styles: { backgroundImage: `url('https://static1.squarespace.com/static/5459116de4b07304c9c6ac24/58e550783e00be96f2c0fb55/58e5508215d5db03c97ca6d5/1491426153806/BroadviewWEB-7.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.4)' } },
        component: (<MultiOptionsSegment
                                title='Multi Select'
                                schema={{
                                  id: 'xxx',
                                  endpoint: 'a',
                                  choices: [
                                    { id: '2-0', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Option A', value: false, endpoint: 'a', tooltip: (<p>Tooltip A</p>) },
                                    { id: '2-1', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'Option B', value: false, endpoint: 'a' },
                                    { id: '2-2', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'Option C', value: false, endpoint: 'a' }
                                  ]
                                }}
                                texts={[
                                  ...this.addAnyPreMessages('xxx'),
                                  { id: '2-1', scrollDown: true, text: `Nice to meet you ${this.state.data.name}. This Segment lets you select multiple choices. ℹ️id[abc-999]`, tooltips: [{ id: 'abc-999', tooltip: (<div>Info</div>) }] },
                                ]}
                                preselected={[
                                  { id: '2-1', text: 'Option B', value: false },
                                ]}
                                skippable
                                skipEndpoint='a'
                                onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                multi
                             />) },
     {
       id: 'a',
       component: (<DatePickerSegment
                               title='Single Date Selection'
                               schema={{ id: 'a', endpoint: 'z' }}
                               triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                               onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                               texts={[
                                 ...this.addAnyPreMessages('a'),
                                 { id: '0-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'This Segment lets you select a single date.' }
                               ]}
                               skippable
                               skipEndpoint='z'
                            /> )},
      {
        id: 'z',
        component: (<DateRangeSegment
                                title='Date Range'
                                schema={{ id: 'z', endpoint: 'ooo' }}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                texts={[
                                  ...this.addAnyPreMessages('z'),
                                  { id: '0-1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'This Segment allows you to select a date range.' },
                                  { id: '0-2', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'Also notice that you cannot skip this Segment like the other ones.' },
                                ]}
                             /> )},
     {
       id: 'ooo',
       component: (<CounterSegment
                               schema={{ id: 'ooo', endpoint: 'b' }}
                               triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                               onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                               texts={[
                                 ...this.addAnyPreMessages('ooo'),
                                 { id: '0-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Here is a counter with scroll bar' }
                               ]}
                               skippable
                               skipEndpoint='b'
                               incrementerOptions={{
                                 max: 100,
                                 min: 10,
                                 step: 2
                               }}
                               slider
                               sliderOptions={{
                                 min: 10,
                                 max: 100,
                                 step: 10,
                                 vertical: false,
                               }}
                            /> )},
      {
        id: 'b',
        scrollStyles: { scroll_styles: { backgroundImage: `url('https://d4qwptktddc5f.cloudfront.net/80960-minosa-design-marble-bathroom-sydney-1.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.6)' } },
        component: (<InputSegment
                                title='Html Inputs'
                                schema={{ id: 'b', endpoint: 'c' }}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                texts={[
                                  ...this.addAnyPreMessages('b'),
                                  { id: '0-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Below is a simple text input' },
                                ]}
                                skippable
                                skipEndpoint='c'
                                inputType={'text'}
                                stringInputPlaceholder={'Type something'}
                             /> )},
     {
       id: 'c',
       component: (<InputSegment
                               schema={{ id: 'c', endpoint: 'd' }}
                               triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                               onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                               texts={[
                                 ...this.addAnyPreMessages('c'),
                                 { id: '0-1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Here is a textarea input for more text.' },
                                 { id: '0-2', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'Also notice the lack of a title unlike the previous Segment.' },
                               ]}
                               skippable
                               skipEndpoint='d'
                               inputType={'textarea'}
                               stringInputPlaceholder={'Type something big'}
                            /> )},
    {
      id: 'd',
      component: (<InputSegment
                              schema={{ id: 'd', endpoint: 'e' }}
                              triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                              onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                              texts={[
                                ...this.addAnyPreMessages('d'),
                                { id: '0-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Number input' },
                              ]}
                              skippable
                              skipEndpoint='e'
                              inputType={'number'}
                              numberInputPlaceholder={10}
                           /> )},
     {
       id: 'e',
       component: (<InputSegment
                               schema={{ id: 'e', endpoint: 'f' }}
                               triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                               onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                               texts={[
                                 ...this.addAnyPreMessages('e'),
                                 { id: '0-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Enter a phone number' },
                               ]}
                               skippable
                               skipEndpoint='f'
                               inputType={'tel'}
                               stringInputPlaceholder={'phone'}
                            /> )},
      {
        id: 'f',
        component: (<InputSegment
                                schema={{ id: 'f', endpoint: 'g' }}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                texts={[
                                  ...this.addAnyPreMessages('f'),
                                  { id: '0-1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Enter an email' },
                                  { id: '0-2', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, component: (<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', margin: '0px 0px 0px 0px' }}><img src='https://4.bp.blogspot.com/-j5loWPnSKDo/WniCnRFiQBI/AAAAAAAAzBQ/C8xKwr4UndYLDsXTa_Q48c5CruQkHVzpgCLcBGAs/s400/OACGFish.gif' height='200px' width='auto' style={{ borderRadius: '20px' }} /></div>) },
                                ]}
                                skippable
                                skipEndpoint='g'
                                inputType={'email'}
                                stringInputPlaceholder={'name@gmail.com'}
                             /> )},
       {
         id: 'g',
         component: (<InputSegment
                                 schema={{ id: 'g', endpoint: '0' }}
                                 triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                 onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                 texts={[
                                   ...this.addAnyPreMessages('g'),
                                   { id: '0-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Enter a URL' },
                                 ]}
                                 skippable
                                 skipEndpoint='0'
                                 inputType={'url'}
                                 stringInputPlaceholder={'https://google.ca'}
                              /> )},
      {
        id: '0',
        scrollStyles: { scroll_styles: { backgroundImage: `url('https://connectassetmanagement.com/wp-content/uploads/2016/04/toronto-sunset-city-view.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.4)' } },
        component: (<MapSegment
                                title='Map Location'
                                schema={{ id: '0', endpoint: '4' }}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                texts={[
                                  ...this.addAnyPreMessages('0'),
                                  { id: '0-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'This component lets you select a geographic location.' }
                                ]}
                                skippable
                                skipEndpoint='4'
                             /> )},
       {
         id: '4',
         component: (<MultiOptionsSegment
                                 title='Single Select'
                                 schema={{
                                   id: '4',
                                   endpoint: '1',
                                   choices: [
                                     { id: '2-0', text: 'Option A', value: false, endpoint: '1' },
                                     { id: '2-1', text: 'Option B', value: false, endpoint: '1' },
                                     { id: '2-2', text: 'Option C', value: false, endpoint: '1' }
                                   ]
                                 }}
                                 texts={[
                                   ...this.addAnyPreMessages('4'),
                                   { id: '2-1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'This simple Segment lets you pick 1 choice' },
                                   { id: '2-2', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'Make sure all texts and choices have unique IDs!' },
                                 ]}
                                 skippable
                                 skipEndpoint='1'
                                 onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                 triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                              />) },
      {
        id: '1',
        component: (<MultiOptionsSegment
                                title='Single Select with Other'
                                schema={{
                                  id: '1',
                                  endpoint: '2',
                                  choices: [
                                    { id: '2-0', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Next Multi Selection', value: false, endpoint: '2' },
                                    { id: '2-1', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'File Uploader', value: false, endpoint: 'kk' },
                                    { id: '2-2', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'Share Link', value: false, endpoint: 'oo' },
                                  ]
                                }}
                                texts={[
                                  ...this.addAnyPreMessages('1'),
                                  { id: '2-1', text: 'This Segment lets you select 1 choice, with an option for custom OTHER input.' },
                                  { id: '2-2', scrollDown: true, text: 'There is also smart routing. Just design the routing schemas!' },
                                ]}
                                skippable
                                skipEndpoint='3'
                                onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                other
                             />) },
     {
       id: 'kk',
       component: (<FileUploadSegment
                               title='File Upload'
                               schema={{
                                 id: 'kk',
                                 endpoint: '2',
                               }}
                               texts={[
                                 ...this.addAnyPreMessages('kk'),
                                 { id: '2-1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'This Segment lets you upload a single file.' },
                                 { id: '2-2', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'Or you can upload multiple files.' },
                                 { id: '2-3', scrollDown: true, scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'This still needs work in terms of file validation.' },
                               ]}
                               skippable
                               skipEndpoint='2'
                               onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                               triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                               multi
                            />) },
    {
      id: 'oo',
      component: (<ShareUrlSegment
                              title='Share Link'
                              schema={{
                                id: 'oo',
                                endpoint: '2',
                              }}
                              texts={[
                                ...this.addAnyPreMessages('oo'),
                                { id: '2-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Share this link with your friends!' },
                              ]}
                              onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                              triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                              url='https://google.ca'
                           />) },
      {
        id: '2',
        component: (<MultiOptionsSegment
                                title='Multi Select'
                                schema={{
                                  id: '2',
                                  endpoint: '3',
                                  choices: [
                                    { id: '2-0', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Option A', value: false, endpoint: '3' },
                                    { id: '2-1', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'Option B', value: false, endpoint: '3' },
                                    { id: '2-2', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'Option C', value: false, endpoint: '3' }
                                  ]
                                }}
                                texts={[
                                  ...this.addAnyPreMessages('2'),
                                  { id: '2-1', scrollDown: true, text: 'This Segment lets you select multiple choices.' },
                                ]}
                                skippable
                                skipEndpoint='3'
                                onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                multi
                             />) },
      {
        id: '3',
        component: (<MultiOptionsSegment
                                title='Multi Select with Other'
                                schema={{
                                  id: '3',
                                  endpoint: '5',
                                  choices: [
                                    { id: '2-0', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Option A', value: false, endpoint: '5' },
                                    { id: '2-1', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'Option B', value: false, endpoint: '5' },
                                  ]
                                }}
                                texts={[
                                  ...this.addAnyPreMessages('3'),
                                  { id: '2-1', scrollDown: true, text: 'This Segment allows for multiple choices with an option for custom other.' }
                                ]}
                                skippable
                                skipEndpoint='5'
                                onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                multi
                                other
                             />) },
       {
         id: '5',
         component: (<ActionSegment
                                 title='FINISH'
                                 schema={{
                                   id: '5',
                                   endpoint: null,
                                   choices: [
                                     { id: 'nothing', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'DO NOTHING', value: 'abort', endpoint: '' },
                                     { id: 'abort', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'ABORT', value: 'abort', endpoint: '/' },
                                     { id: 'view_matches', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: 'VIEW MATCHES', value: 'view_matches', endpoint: '/matches' }
                                   ]
                                 }}
                                 texts={[
                                   ...this.addAnyPreMessages('5'),
                                   { id: '1-1', scrollDown: true, text: 'This is an Action Segment that is used at the end of a AdvisorUI dialog.' }
                                 ]}
                                 triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                 onDone={(original_id, endpoint, data) => this.action(original_id, endpoint, data)}
                                 skippable
                                 skipEndpoint='9'
                               />) },
    ]
    this.setState({ lastUpdated: moment().unix() })
  }

  doneIntro(original_id, endpoint, data) {
    this.setState({
      premessages: this.state.premessages.filter((pre) => {
        return pre.segment_id !== endpoint
      }).concat([
        { segment_id: endpoint, texts: [
          { id: '001', text: 'This is dynamically generated response text by the way!' }
        ] }
      ])
    }, () => {
      this.done(original_id, endpoint, data)
      console.log(this.state)
    })
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
			<div id='AdvisorUI' onClick={() => this.props.toggleInstantCharsSegmentID(this.shown_segments[this.shown_segments.length - 1].id)} style={comStyles().container}>
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
AdvisorUI.propTypes = {
	history: PropTypes.object.isRequired,
  toggleInstantCharsSegmentID: PropTypes.func.isRequired,
}

// for all optional props, define a default value
AdvisorUI.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AdvisorUI)

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
