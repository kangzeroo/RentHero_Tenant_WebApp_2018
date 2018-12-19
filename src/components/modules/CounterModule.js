// Compt for copying as a CounterModule
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import { isMobile } from '../../api/general/general_api'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import {

} from 'antd-mobile'
import {
  Toast,
  Icon,
} from 'antd-mobile'


class CounterModule extends Component {

  constructor() {
    super()
    this.state = {
      initialCount: 0,
      data: {
        count: 0,
      }
    }
    this.mobile = false
  }

  componentWillMount() {
    if (this.props.initialData) {
      this.setState({
        initialCount: this.props.initialData.count,
        data: {
          ...this.state.data,
          count: this.props.incrementerOptions.default || this.props.incrementerOptions.min,
          ...this.props.initialData
        }
      })
    }
  }

  componentDidMount() {
    this.mobile = isMobile()
    this.setState({
      initialCount: this.props.initialData.count,
      data: {
        ...this.state.data,
        ...this.props.initialData,
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.initialData !== this.props.initialData) {
      this.setState({
        initialCount: this.props.initialData.count,
        data: {
          ...this.state.data,
          ...this.props.initialData
        }
      })
    }
  }

  clickedIncrementer(amount, direction) {
    const x = amount * direction
    if (this.state.data.count + x < this.props.incrementerOptions.min) {
      Toast.info(`Minimum is ${this.props.incrementerOptions.min}`, 1)
    } else if (this.state.data.count + x > this.props.incrementerOptions.max) {
      Toast.info(`Maximum is ${this.props.incrementerOptions.max}`, 1)
    } else {
      this.setState({ data: { ...this.state.data, count: this.state.data.count + x } }, () => console.log(this.state.data))
    }
  }

  saveChanges(e) {
    this.props.onComplete(this.state.data)
  }

	render() {
		return (
			<div id='CounterModule' style={comStyles().container}>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
          <span onClick={() => this.clickedIncrementer(this.props.incrementerOptions.step, -1)} style={{ fontSize: '2rem', fontWeight: 'bold', color: 'black', margin: '5px' }}>-</span>
          <span style={{ fontSize: '2rem', color: 'black', margin: '5px' }}>{this.props.renderCountValue(this.state.data.count)}</span>
          <span onClick={() => this.clickedIncrementer(this.props.incrementerOptions.step, 1)} style={{ fontSize: '2rem', fontWeight: 'bold', color: 'black', margin: '5px' }}>+</span>
        </div>
        {
          this.props.slider && this.props.sliderOptions
          ?
          <div style={{ width: '80%', alignSelf: 'center' }}>
            <Slider
              value={this.state.data.count}
              min={this.props.sliderOptions.min}
              max={this.props.sliderOptions.max}
              step={this.props.sliderOptions.step}
              onChange={(v) => this.setState({ data: { ...this.state.data, count: v } })}
            />
          </div>
          :
          null
        }
        <div style={{ width: '100%', height: '50px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', position: 'relative', margin: '15px 0px 0px 0px' }}>
          {
            this.state.data.count !== this.state.initialCount
            ?
            <Icon onClick={(e) => this.saveChanges(e)} type='check-circle' size='lg' style={comStyles().check} />
            :
            <Icon type='check-circle-o' size='lg' style={{ ...comStyles().check, cursor: 'not-allowed', color: 'gray' }} />
          }
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
CounterModule.propTypes = {
	history: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,        // passed in, function to call at very end
  initialData: PropTypes.object,            // passed in, allows us to configure inputs to whats already given
  // UNIQUE PROPS FOR COMPONENT
  incrementerOptions: PropTypes.object.isRequired,      // passed in, what should the { max, min } be?
  /*
    incrementerOptions = { max: 5, min: 1, step: 1, default: 2 }
  */
  slider: PropTypes.bool,                   // passed in, should the slider appear?
  sliderOptions: PropTypes.object,          // passed in, what slider options should there be?
  /*
    // see here for full options: https://github.com/react-component/slider
    sliderOptions = {
      min: 0,
      max: 100,
      step: 5,
      vertical: false,
    }
  */
  renderCountValue: PropTypes.func,
  /*
    renderCountValue = (count) => { return count}
  */
  canBeZero: PropTypes.bool,
}

// for all optional props, define a default value
CounterModule.defaultProps = {
  initialData: {},
  slider: false,
  sliderOptions: {},
  renderCountValue: (count) => { return count},
  canBeZero: false,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(CounterModule)

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
		},
		check: {
			color: 'black',
			fontWeight: 'bold',
			cursor: 'pointer',
			margin: '0px 0px 0px 0px',
			position: 'absolute',
			bottom: '20px',
			right: '0px',
		}
	}
}
