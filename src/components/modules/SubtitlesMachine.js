// Compt for copying as a SubtitlesMachine
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'antd-mobile'


class SubtitlesMachine extends Component {

  constructor() {
    super()
    this.state = {
      text: ''
    }
    this.observable = null
  }

  componentDidMount() {
    setTimeout(() => {
      this.renderAnimation(this.props.text)
    }, this.props.delay)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.observable && this.props.instant && this.props.instant !== prevProps.instant) {
      this.setState({ text: this.props.text })
      this.observable.complete()
    }
  }

  renderAnimation(text) {
    const lex = text.split('')
    let count = 0

    const onNext = ({ obs }) => {
      // console.log('OBSERVABLE NEXT')
      let waitTime = 70 * this.props.speed
      if (count === lex.length + 1) {
        obs.complete()
      } else {
        this.setState({
          text: text.slice(0, count)
        })
        if (lex[count-1] === ',') {
          waitTime = waitTime * 4
        } else if (lex[count-1] === '.' || lex[count-1] === '!' || lex[count-1] === '?') {
          waitTime = waitTime * 6
        }
        count++
        setTimeout(() => {
          obs.next({
            obs
          })
        }, waitTime)
      }
    }
    Rx.Observable.create((obs) => {
      this.observable = obs
      obs.next({
        obs
      })
    }).subscribe({
      next: onNext,
      error: (err) => {
        // console.log('OBSERVABLE ERROR')
        console.log(err)
      },
      complete: (y) => {
        // console.log('OBSERVABLE COMPLETE')
        this.props.doneEvent()
      }
    })
  }

	render() {
		return (
			<div id='SubtitlesMachine' style={comStyles({ containerStyles: this.props.containerStyles }).container}>
				<div style={comStyles({ textStyles: this.props.textStyles }).text}>
          {
            this.state.text.split(' ').map((word) => {
              if (word.match(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/igm)) {
                return (
                  <span style={this.props.emojiStyles}>{word} </span>
                )
              } else {
                return (
                  <span>{word} </span>
                )
              }
            })
          }
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
SubtitlesMachine.propTypes = {
	history: PropTypes.object.isRequired,
  speed: PropTypes.number,    // passed in
  text: PropTypes.string,     // passed in
  containerStyles: PropTypes.object,    // passed in
  textStyles: PropTypes.object,         // passed in
  emojiStyles: PropTypes.object,      // passed in
  doneEvent: PropTypes.func,        // passed in
  instant: PropTypes.bool,          // passed in - if true then instant load text
  delay: PropTypes.number,          // passed in
}

// for all optional props, define a default value
SubtitlesMachine.defaultProps = {
  speed: 1, // a number
  text: `Hey there! Check out this conversation UI animation, isn't it great? Mhmm yes, it is amazing.`,
  containerStyles: {
  },
  textStyles: {
    color: 'blue',
    fontWeight: 'bold',
  },
  emojiStyles: {
    fontSize: '1.7rem',
    margin: '0px 2px 0px 2px'
  },
  doneEvent: () => {},
  delay: 0,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SubtitlesMachine)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {

	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = ({ containerStyles, textStyles }) => {
  if (!containerStyles) {
    containerStyles = {}
  }
  if (!textStyles) {
    textStyles = {}
  }
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      ...containerStyles,
		},
    text: {
      ...textStyles
    }
	}
}
