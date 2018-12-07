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
import MessageSegment from '../../modules/AdvisorUI_v2/Segments/MessageSegment'
import ActionSegment from '../../modules/AdvisorUI_v2/Segments/ActionSegment'
import InputSegment from '../../modules/AdvisorUI_v2/Segments/InputSegment'
import MapSegment from '../../modules/AdvisorUI_v2/Segments/MapSegment'
import CounterSegment from '../../modules/AdvisorUI_v2/Segments/CounterSegment'
import MultiOptionsSegment from '../../modules/AdvisorUI_v2/Segments/MultiOptionsSegment'
import {
  Icon,
} from 'antd-mobile'
import { toggleInstantCharsSegmentID } from '../../../actions/app/app_actions'
import { ACCENT_COLOR, FONT_COLOR, BACKGROUND_COLOR, BACKGROUND_WEBKIT, BACKGROUND_MODERN, FONT_FAMILY, FONT_FAMILY_ACCENT } from '../../modules/AdvisorUI_v2/styles/advisor_ui_styles'


class ChineseDialogOnboarding extends Component {

  constructor() {
    super()
    this.state = {
      lastUpdated: 0,
      scrollStyles: {
        scroll_styles: {},
        scrollable_styles: {},
      },
      data: {
        name: '',
        group_size: 1,
        budget_per_person: 1000,
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
        id: '1',
        component: (<MessageSegment
                               schema={{ id: '1', endpoint: '2' }}
                               triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                               onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                               texts={[
                                 { id: '0-1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, containerStyles: { margin: '30px 0px 0px 20px' }, text: '你好 👋 我的名字是 RentHero' },
                                 { id: '0-2', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: `我是 A.I. 房地产经纪人在这里帮你找到你的下一个家！ 这是我能为你做的：` },
                                 { id: '0-3', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY, margin: '10px 0px 5px 0px', textAlign: 'center' }, text: `🔍 浏览在线广告` },
                                 { id: '0-4', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY, margin: '5px 0px 5px 0px', textAlign: 'center' }, text: `👆 到最喜欢的家` },
                                 { id: '0-5', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY, margin: '5px 0px 10px 0px', textAlign: 'center' }, text: `📜 填写文件` },
                                 { id: '0-6', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: `想开始吗 🤓` },
                               ]}
                               action={{ enabled: true, label: '开始', actionStyles: { width: '100%' } }}
                             />) },
     {
       id: '2',
       scrollStyles: { scroll_styles: { backgroundImage: `url('http://www.gohaus.com/wp-content/uploads/2015/12/living-room-floor-design-ideas.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.6)' } },
       component: (<InputSegment
                               title='简介'
                               schema={{ id: '2', endpoint: '3' }}
                               triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                               onDone={(original_id, endpoint, data) => this.doneName(original_id, endpoint, data)}
                               texts={[
                                 { id: '0-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: "我们更好地相互了解 😊 你叫什么名字?" },
                               ]}
                               inputType={'text'}
                               stringInputPlaceholder={'名字'}
                            />)},
      {
        id: '3',
        scrollStyles: { scroll_styles: { backgroundImage: `url('https://connectassetmanagement.com/wp-content/uploads/2016/04/toronto-sunset-city-view.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.4)' } },
        component: (<MapSegment
                                title='经常旅行'
                                schema={{ id: '3', endpoint: '4' }}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                texts={[
                                  { id: '0-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: `很高兴见到你 ${this.state.data.name} 🤝 你最常去哪儿通勤？我会发现附近的租金.` }
                                ]}
                             /> )},
      {
        id: '4',
        scrollStyles: { scroll_styles: { backgroundImage: `url('https://i.ytimg.com/vi/FqOAKHzVpaw/maxresdefault.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
        component: (<MultiOptionsSegment
                                title='旅行模式'
                                schema={{
                                  id: '4',
                                  endpoint: '5',
                                  choices: [
                                    { id: '4-1', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: '开车', value: 'DRIVING', endpoint: '5' },
                                    { id: '4-2', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: '公共交通', value: 'TRANSIT', endpoint: '5' },
                                    { id: '4-3', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: '步行', value: 'WALKING', endpoint: '5' },
                                    { id: '4-4', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: '骑自行车', value: 'BICYCLING', endpoint: '5' }
                                  ]
                                }}
                                texts={[
                                  { id: '4-1', scrollDown: true, text: '您的主要交通工具是什么' },
                                ]}
                                onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                             />) },
       {
         id: '5',
         scrollStyles: { scroll_styles: { backgroundImage: `url('https://byba.co.uk/wp-content/uploads/bella-london-concrete-lazio.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.6)' } },
         component: (<CounterSegment
                                 title='团体规模'
                                 schema={{ id: '5', endpoint: '6' }}
                                 triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                                 onDone={(original_id, endpoint, data) => this.donePersons(original_id, endpoint, data)}
                                 texts={[
                                   { id: '0-1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: '有多少人在寻找租房？🙋 只是你，还是更多?' },
                                   { id: '0-2', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: `如果你不确定，那没关系。我们以后会变得不那么具体` }
                                 ]}
                                 incrementerOptions={{
                                   max: 7,
                                   min: 1,
                                   step: 1
                                 }}
                              /> )},
      {
        id: '6',
        scrollStyles: { scroll_styles: { backgroundImage: `url('http://www.globexdevelopments.com/Custom-Homes-Photo-Portfolio/14-Casa/big/Hallway-EntryDoor.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.4)' } },
        component: (<MultiOptionsSegment
                                title='套房或客房'
                                schema={{
                                  id: '6',
                                  endpoint: '7',
                                  choices: [
                                    { id: '6-1', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: '整个地方', value: 'entireplace', endpoint: '7', tooltip: (<p>整个地方意味着你没有随机的室友，只有你小组中的人。</p>) },
                                    { id: '6-2', textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT }, text: '只是房间', value: 'rooms', endpoint: '7', tooltip: (<p>房间意味着你愿意有新的随机室友。通常为了更便宜的租金，因为整个地方可能很贵。</p>) }
                                  ]
                                }}
                                texts={[
                                  { id: '6-1', scrollDown: true, text: `你想租一整个地方，或只是 ${this.state.data.group_size} 个房间（可能与其他新的室友）？` },
                                ]}
                                onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                                triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                             />) },
     {
       id: '7',
       scrollStyles: { scroll_styles: { backgroundImage: `url('https://i.ytimg.com/vi/yzWqIH9NBZE/maxresdefault.jpg')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
       component: (<CounterSegment
                               title='每人预算'
                               schema={{ id: '7', endpoint: '8' }}
                               triggerScrollDown={(e,d) => this.triggerScrollDown(e,d)}
                               onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
                               texts={[
                                 { id: '7-1', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: '您理想的每人预算是多少? 💵' }
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
                            /> )},
     {
       id: '8',
       scrollStyles: { scroll_styles: { backgroundImage: `url('https://s3.amazonaws.com/renthero-public-assets/images/Screen+Shot+2018-12-05+at+11.05.09+PM.png')` }, scrollable_styles: { backgroundColor: 'rgba(0,0,0,0.7)' } },
       component: (<ActionSegment
                               title='完'
                               schema={{
                                 id: '8',
                                 endpoint: null,
                                 choices: [
                                   { id: 'ok', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: '查看匹配', value: 'abort', endpoint: '/matches' },
                                 ]
                               }}
                               texts={[
                                 { id: '1-1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: `就是这样！准备好看你的比赛了吗？ 👀` },
                                 { id: '1-2', scrollDown: true, textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY }, text: `( 顺便说一句，这些不是你的比赛。那部分尚未连接 😅 )` }
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
        name: data.input_string
      }
    }, () => this.done(original_id, endpoint, data))
  }

  donePersons(original_id, endpoint, data) {
    this.setState({
      data: {
        ...this.state.data,
        group_size: data.count
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
			<div id='ChineseDialogOnboarding' onClick={() => this.props.toggleInstantCharsSegmentID(this.shown_segments[this.shown_segments.length - 1].id)} style={comStyles().container}>
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
ChineseDialogOnboarding.propTypes = {
	history: PropTypes.object.isRequired,
  toggleInstantCharsSegmentID: PropTypes.func.isRequired,
}

// for all optional props, define a default value
ChineseDialogOnboarding.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ChineseDialogOnboarding)

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
