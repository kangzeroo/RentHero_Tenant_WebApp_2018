// Compt for copying as a MultiOptionsSegment
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'antd-mobile'


class MultiOptionsSegment extends Component {

  constructor() {
    super()
    this.state = {
      count: 0,
    }
  }

  componentDidMount() {
    console.log(this.props.schema)
  }

	render() {
		return (
			<div id='MultiOptionsSegment' style={{ ...comStyles().container, ...this.props.styles }}>
        <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '20px' }}>
          <span style={{ fontSize: '2rem', color: 'white' }}>{`SEGMENT ${this.props.schema.id}`}</span>
        </div>
        <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '20px' }}>
          {
            this.props.schema.options.map((option) => {
              return (
                <span onClick={() => this.props.onDone(this.props.schema.id, option.endpoint)} style={{ fontSize: '1rem', color: 'white', margin: '5px' }}>{option.text}</span>
              )
            })
          }
        </div>
        <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '20px', height: '50px' }}>
          {
            this.state.count
            ?
            <span onClick={() => this.props.onDone(this.props.schema.id, this.props.schema.endpoint)} style={{ fontSize: '0.8rem', color: 'white', margin: '5px' }}>Done</span>
            :
            null
          }
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
MultiOptionsSegment.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
MultiOptionsSegment.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MultiOptionsSegment)

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
		}
	}
}
