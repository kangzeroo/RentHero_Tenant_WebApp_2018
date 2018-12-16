// Compt for copying as a AdBuildingSection
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'antd-mobile'
import LikeableImage from './LikeableImage'


class AdBuildingSection extends Component {

  renderBuildingTitle() {
    return (
      <div>Inside the Building</div>
    )
  }

  renderAmenities() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
        {
          this.props.current_listing.PARKING
          ?
          <div>Parking Available</div>
          :
          null
        }
        {
          this.props.current_listing.BUILDING_AMENITIES
          ?
          this.props.current_listing.BUILDING_AMENITIES.map(am => {
            return (
              <div>{am}</div>
            )
          })
          :
          null
        }
      </div>
    )
  }

  renderImages() {
    return this.props.images.map((img) => {
      return (
        <LikeableImage img={img} />
      )
    })
  }

	render() {
		return (
			<div id='AdBuildingSection' style={comStyles().container}>
				{this.renderBuildingTitle()}
        {this.renderAmenities()}
        {this.renderImages()}
			</div>
		)
	}
}

// defines the types of variables in this.props
AdBuildingSection.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
AdBuildingSection.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AdBuildingSection)

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
