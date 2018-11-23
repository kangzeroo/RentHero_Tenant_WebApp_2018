// Compt for copying as a NameIntro
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import $ from 'jquery'
import SubtitlesMachine from '../modules/SubtitlesMachine'
import {
	Icon,
} from 'antd-mobile'


class NameIntro extends Component {

	constructor() {
		super()
		this.state = {
			show_up: true,
			show_down: true,
			step: 0,

			string1: '',
		}
	}

	clickedCheck(nextDiv) {
		this.setState({ step: this.state.step + 1 }, () => {
			history.pushState(null, null, `${this.props.location.pathname}${nextDiv}`)
			$('#middle_part').animate({
					scrollTop: document.getElementById("middle_part").scrollHeight - $(nextDiv).position().top
			}, 500);
		})
	}

	render() {
		return (
			<div id='NameIntro' style={comStyles().container}>
        <div style={comStyles().scroll}>
					{/*<div style={comStyles().up_part}>
						{
							this.state.show_up
							?
							<Icon type='up' size='lg' style={comStyles().up} />
							:
							null
						}
					</div>*/}
					<div id='middle_part' style={comStyles().middle_part}>
						<div id='section_one' style={comStyles().sectional}>
							<SubtitlesMachine
									speed={0.25}
									delay={500}
									text={`Ask some questions and click for the next slide 😊`}
									textStyles={{
										fontSize: '1.3rem',
										color: 'white',
										textAlign: 'left',
									}}
									containerStyles={{
										width: '100%',
										backgroundColor: 'rgba(0,0,0,0)',
										borderRadius: '20px',
									}}
									doneEvent={() => {
										console.log('DONE')
										setTimeout(() => {
											this.setState({ step: this.state.step + 1 })
											// console.log('DONE')
										}, 500)
									}}
								/>
							{
								this.state.step >= 1
								?
								<div style={comStyles().field_holder}>
									<input
		                id="input_field"
		                value={this.state.string1}
		                onChange={(e) => {
		                  console.log(e.target.value)
		                  this.setState({ string1: e.target.value })
		                }}
		                placeholder="Type Something"
		                style={inputStyles().text}
		              ></input>
									{
										this.state.string1
										?
										<Icon onClick={() => this.clickedCheck('#section_two')} type='check-circle' size='lg' style={comStyles().check} />
										:
										null
									}
								</div>
								:
								null
							}
						</div>
						{
							this.state.step >= 2
							?
							<div id='section_two' style={comStyles().sectional}>
								<SubtitlesMachine
										speed={0.25}
										delay={800}
										text={`Section Two`}
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
												// this.setState({ step: this.state.step + 1 })
											}, 1000)
										}}
									/>
							</div>
							:
							null
						}
					</div>
					<div style={comStyles().down_part}>
						{
							this.state.show_down
							?
							<Icon onClick={() => {
								$('#middle_part').animate({
										scrollTop: document.getElementById("middle_part").scrollHeight
								}, 500);
							}} type='down' size='lg' style={comStyles().down} />
							:
							null
						}
					</div>
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
NameIntro.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
NameIntro.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(NameIntro)

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
      alignItems: 'center',
			background: '#00c6ff', /* fallback for old browsers */
		  background: '-webkit-linear-gradient(to right, #00c6ff, #0072ff)', /* Chrome 10-25, Safari 5.1-6 */
		  background: 'linear-gradient(to right, #00c6ff, #0072ff)' /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
		},
    scroll: {
      display: 'flex',
      flexDirection: 'column',
			position: 'fixed',
      minHeight: '90vh',
			bottom: '0px',
      width: '100%',
      maxWidth: '500px',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
		up_part: {
			position: 'fixed',
			top: '0px',
			height: '15vh',
			minHeight: '15vh',
			maxHeight: '15vh',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-end',
			alignItems: 'center',
		},
		middle_part: {
      display: 'flex',
      flexDirection: 'column',
      height: '90vh',
      width: '100%',
      maxWidth: '500px',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      padding: '10px 0px 0px 0px',
			overflowY: 'scroll',
			padding: '20px 20px 20px 20px',
		},
		down_part: {
			position: 'fixed',
			bottom: '0px',
			height: '10vh',
			minHeight: '10vh',
			maxHeight: '10vh',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
		},
		up: {
			color: 'white',
			fontWeight: 'bold',
			cursor: 'pointer',
		},
		down: {
			color: 'white',
			fontWeight: 'bold',
			cursor: 'pointer',
		},
		sectional: {
			height: '90vh',
			minHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
			padding: '20px 0px 0px 0px',
			width: '100%',
		},
		field_holder: {
			display: 'flex',
			flexDirection: 'column',
			width: '100%',
			position: 'relative',
			padding: '20px 0px 70px 0px'
		},
		check: {
			color: 'white',
			fontWeight: 'bold',
			cursor: 'pointer',
			margin: '15px 0px 0px 0px',
			position: 'absolute',
			bottom: '0px',
			right: '0px',
		}
	}
}


const inputStyles = () => {
  return {
    text: {
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      display: 'flex',
      outline: 'none',
      width: '100%',
      fontSize: '1.2rem',
      height: '30px',
      borderRadius: '10px',
      padding: '20px',
      color: '#ffffff',
      webkitBoxShadow: '0 2px 10px 1px rgba(0,0,0,0)',
      boxShadow: '0 2px 10px 1px rgba(0,0,0,0)',
    }
  }
}
