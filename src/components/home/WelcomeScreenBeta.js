// Compt for copying as a WelcomeScreen
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import SubtitlesMachine from '../modules/SubtitlesMachine'
import {

} from 'antd-mobile'


class WelcomeScreen extends Component {

  constructor() {
    super()
    this.state = {
      step: 0
    }
  }

	render() {
		return (
			<div id='WelcomeScreen' style={comStyles().container}>
        <div onClick={() => this.setState({ step: this.state.step + 1 })} style={comStyles().slim}>
          <br/>
          <SubtitlesMachine
              speed={0.15}
              text={`Hello 👋`}
              instant={this.state.step >= 1}
              textStyles={{
                fontSize: '1.5rem',
                color: 'white',
                textAlign: 'left',
                fontWeight: 'bold'
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
                  this.setState({ step: this.state.step + 1 })
                  window.scrollTo(0,window.innerHeight)
                }, 600)
              }}
            />
            {
              this.state.step >= 1
              ?
              <SubtitlesMachine
                  speed={0.7}
                  text={`My name is RentHero 💪`}
                  instant={this.state.step >= 2}
                  textStyles={{
                    fontSize: '1.5rem',
                    color: 'white',
                    textAlign: 'left',
                    fontWeight: 'bold'
                  }}
                  containerStyles={{
                    width: '100%',
                    backgroundColor: 'rgba(0,0,0,0)',
                    padding: '0px 10px 10px 20px',
                    borderRadius: '20px',
                  }}
                  doneEvent={() => {
                    console.log('DONE')
                    setTimeout(() => {
                      this.setState({ step: this.state.step + 1 })
                      window.scrollTo(0,window.innerHeight)
                    }, 1000)
                  }}
                />
              :
              null
            }
            <br /><br />
            {
              this.state.step >= 2
              ?
              <SubtitlesMachine
                  speed={0.25}
                  text={`I'm an A.I. rental agent looking out for your best interests 😊`}
                  instant={this.state.step >= 3}
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
                      this.setState({ step: this.state.step + 1 })
                      window.scrollTo(0,window.innerHeight)
                    }, 1000)
                  }}
                />
              :
              null
            }
            {
              this.state.step >= 3
              ?
              <SubtitlesMachine
                  speed={0.25}
                  text={`Tell me what you're looking for and I'll search the entire internet for matching rentals 🔍`}
                  instant={this.state.step >= 4}
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
                      this.setState({ step: this.state.step + 1 })
                      window.scrollTo(0,window.innerHeight)
                    }, 1200)
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
                  text={`F.Y.I. I am currently in beta 😅`}
                  instant={this.state.step >= 5}
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
                      this.setState({ step: this.state.step + 1 })
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
              <div onClick={() => this.props.history.push('/preferences')} style={comStyles().start_btn}>
                Start
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
WelcomeScreen.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
WelcomeScreen.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(WelcomeScreen)

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
      height: '100vh',
      padding: '50px 0px 0px 0px',
      justifyContent: 'flex-start',
      alignItems: 'center',
			background: '#00c6ff', /* fallback for old browsers */
		  background: '-webkit-linear-gradient(to right, #00c6ff, #0072ff)', /* Chrome 10-25, Safari 5.1-6 */
		  background: 'linear-gradient(to right, #00c6ff, #0072ff)' /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
		},
    slim: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100%',
      maxWidth: '500px',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    start_btn: {
      margin: '50px 0px 0px 20px',
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: 'white',
      border: '1px solid white',
      padding: '15px',
      width: '90%',
      borderRadius: '20px',
      textAlign: 'center',
      cursor: 'pointer'
    }
	}
}
