// Compt for copying as a AdFurnishSection
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


class AdFurnishSection extends Component {

  renderMainAttraction() {
    if (this.props.current_listing.FURNISHED) {
      return (
        <h2>Furniture Included</h2>
      )
    } else {
      return (
        <h2>About This Unit</h2>
      )
    }
  }

  renderAmenities() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
        {
          this.props.current_listing.SQFT
          ?
          <div>{this.props.current_listing.SQFT} SQFT</div>
          :
          null
        }
        {
          this.props.current_listing.UNIT_AMENITIES
          ?
          this.props.current_listing.UNIT_AMENITIES.map(am => {
            return (
              <div>{am}</div>
            )
          })
          :
          null
        }
        {
          this.props.current_listing.PET_FRIENDLY
          ?
          <div>PET FRIENDLY</div>
          :
          null
        }
      </div>
    )
  }

  renderImages() {
    return (
      <div style={{ padding: '10px' }}>
        {
          this.props.images.map((img) => {
            return (
              <LikeableImage img={img} styles={{ margin: '10px 0px 10px 0px' }} />
            )
          })
        }
      </div>
    )
  }

	render() {
		return (
			<div id='AdFurnishSection' style={comStyles().container}>
				{this.renderMainAttraction()}
        {this.renderAmenities()}
        {this.renderImages()}
			</div>
		)
	}
}

// defines the types of variables in this.props
AdFurnishSection.propTypes = {
	history: PropTypes.object.isRequired,
  current_listing: PropTypes.object,        // passed in
}

// for all optional props, define a default value
AdFurnishSection.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AdFurnishSection)

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
