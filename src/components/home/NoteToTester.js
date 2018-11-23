// Compt for copying as a NoteToTester
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'antd-mobile'
import SubtitlesMachine from '../modules/SubtitlesMachine'


class NoteToTester extends Component {

  constructor() {
    super()
    this.state = {
      step: 0
    }
  }

  seeMatches() {
    window.scrollTo(0,0)
    this.props.history.push('/matches')
  }

	render() {
		return (
			<div id='NoteToTester' style={comStyles().container}>
        <div style={comStyles().slim}>
        <SubtitlesMachine
            speed={0.25}
            text={`Please fill out the feedback form when it pops up.`}
            textStyles={{
              fontSize: '1.3rem',
              color: 'white',
              textAlign: 'left',
            }}
            containerStyles={{
              width: '100%',
              backgroundColor: 'rgba(0,0,0,0)',
              padding: '20px',
              borderRadius: '20px',
            }}
            doneEvent={() => {
              console.log('DONE')
              setTimeout(() => {
                this.setState({ step: 1 })
                // window.scrollTo(0,window.innerHeight)
              }, 500)
            }}
          />
          {
            this.state.step >= 1
            ?
            <SubtitlesMachine
                speed={0.25}
                text={`Your feedback is important to us! 😊`}
                textStyles={{
                  fontSize: '1.3rem',
                  color: 'white',
                  textAlign: 'left',
                }}
                containerStyles={{
                  width: '100%',
                  backgroundColor: 'rgba(0,0,0,0)',
                  padding: '20px',
                  borderRadius: '20px',
                }}
                doneEvent={() => {
                  console.log('DONE')
                  setTimeout(() => {
                    this.setState({ step: 2 })
                    window.scrollTo(0,0)
                    this.props.history.push('/matches')
                    // window.scrollTo(0,window.innerHeight)
                  }, 1000)
                }}
              />
            :
            null
          }
          {/*
            this.state.step >= 2
            ?
            <SubtitlesMachine
                speed={0.25}
                text={`- Your commute times are automatically calculated`}
                textStyles={{
                  fontSize: '1.3rem',
                  color: 'white',
                  textAlign: 'left',
                }}
                containerStyles={{
                  width: '100%',
                  backgroundColor: 'rgba(0,0,0,0)',
                  padding: '20px',
                  borderRadius: '20px',
                }}
                doneEvent={() => {
                  console.log('DONE')
                  setTimeout(() => {
                    this.setState({ step: 3 })
                    window.scrollTo(0,window.innerHeight)
                  }, 1500)
                }}
              />
            :
            null
          */}
          {
            this.state.step >= 3
            ?
            <SubtitlesMachine
                speed={0.25}
                text={`- Press the thumbs down or the thumbs up button to go to the next listing`}
                textStyles={{
                  fontSize: '1.3rem',
                  color: 'white',
                  textAlign: 'left',
                }}
                containerStyles={{
                  width: '100%',
                  backgroundColor: 'rgba(0,0,0,0)',
                  padding: '20px',
                  borderRadius: '20px',
                }}
                doneEvent={() => {
                  console.log('DONE')
                  setTimeout(() => {
                    this.setState({ step: 4 })
                    window.scrollTo(0,window.innerHeight)
                  }, 500)
                }}
              />
            :
            null
          }
          {
            this.state.step >= 4
            ?
            <SubtitlesMachine
                speed={0.25}
                text={`- Would you want RentHero to talk to a rent seller on your behalf? Ask custom questions, schedule tours...etc`}
                textStyles={{
                  fontSize: '1.3rem',
                  color: 'white',
                  textAlign: 'left',
                }}
                containerStyles={{
                  width: '100%',
                  backgroundColor: 'rgba(0,0,0,0)',
                  padding: '20px',
                  borderRadius: '20px',
                }}
                doneEvent={() => {
                  console.log('DONE')
                  setTimeout(() => {
                    this.setState({ step: 5 })
                    window.scrollTo(0,window.innerHeight)
                  }, 1000)
                }}
              />
            :
            null
          }
          {
            this.state.step >= 5
            ?
            <SubtitlesMachine
                speed={0.25}
                text={`- You will randomly encounter the feedback form. Please fill it out, we care about your feedback! Lets make renting better for everybody.`}
                textStyles={{
                  fontSize: '1.3rem',
                  color: 'white',
                  textAlign: 'left',
                }}
                containerStyles={{
                  width: '100%',
                  backgroundColor: 'rgba(0,0,0,0)',
                  padding: '20px',
                  borderRadius: '20px',
                }}
                doneEvent={() => {
                  console.log('DONE')
                  setTimeout(() => {
                    this.setState({ step: 6 })
                    window.scrollTo(0,window.innerHeight)
                  }, 1000)
                }}
              />
            :
            null
          }

          {
            this.state.step >= 6
            ?
            <div onClick={() => this.seeMatches()} style={comStyles().start_btn}>
              See My Matches
            </div>
            :
            null
          }
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
NoteToTester.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
NoteToTester.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(NoteToTester)

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
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      justifyContent: 'flex-start',
      padding: '50px 0px 0px 0px',
      alignItems: 'center',
			background: '#00c6ff', /* fallback for old browsers */
		  background: '-webkit-linear-gradient(to right, #00c6ff, #0072ff)', /* Chrome 10-25, Safari 5.1-6 */
		  background: 'linear-gradient(to right, #00c6ff, #0072ff)' /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
		},
    slim: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      overflowY: 'scroll',
      width: '100%',
      maxWidth: '500px',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    start_btn: {
      margin: '150px 0px 0px 20px',
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: 'white',
      border: '1px solid white',
      padding: '15px',
      width: '90%',
      borderRadius: '20px',
      textAlign: 'center',
      cursor: 'pointer'
    },
	}
}
