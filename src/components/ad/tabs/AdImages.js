// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Card,
  Icon,
} from 'antd'


class AdImages extends Component {

  renderOutside(imgs) {
    return (
      <div id='#Exterior' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
        <h2>Exterior</h2>
        {
          imgs.map((pic) => {
            return (
              <img
                src={pic.url}
                style={{
                  width: '100%',
                  height: 'auto',
                  padding: '5px 0px',
                }}
              />
            )
          })
        }
      </div>
    )
  }

  renderBedroom(imgs) {
    return (
      <div id='#Bedroom' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
        <h2>Bedroom</h2>
        {
          imgs.map((pic) => {
            return (
              <img
                src={pic.url}
                style={{
                  width: '100%',
                  height: 'auto',
                  padding: '5px 0px',
                }}
              />
            )
          })
        }
      </div>
    )
  }

  renderLivingRoom(imgs) {
    return (
      <div id='#LivingRoom' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
        <h2>Living room</h2>
        {
          imgs.map((pic) => {
            return (
              <img
                src={pic.url}
                style={{
                  width: '100%',
                  height: 'auto',
                  padding: '5px 0px',
                }}
              />
            )
          })
        }
      </div>
    )
  }

  renderKitchen(imgs) {
    return (
      <div id='#Kitchen' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
        <h2>Kitchen</h2>
        {
          imgs.map((pic) => {
            return (
              <img
                src={pic.url}
                style={{
                  width: '100%',
                  height: 'auto',
                  padding: '5px 0px',
                }}
              />
            )
          })
        }
      </div>
    )
  }


  renderBathroom(imgs) {
    return (
      <div id='#Bathroom' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
        <h2>Bathroom</h2>
        {
          imgs.map((pic) => {
            return (
              <img
                src={pic.url}
                style={{
                  width: '100%',
                  height: 'auto',
                  padding: '5px 0px',
                }}
              />
            )
          })
        }
      </div>
    )
  }

  onClose() {
    history.pushState(null, null, `${this.props.location.pathname}/${this.props.current_listing.REFERENCE_ID}`)
    this.props.onClose()
  }


	render() {
		return (
			<div id='AdImages' style={comStyles().container}>
        <div style={{ height: '60px' }} />
				{
          this.props.photos.outside.length > 0
          ?
          this.renderOutside(this.props.photos.outside)
          :
          null
        }
        <br /><br />
        {
          this.props.photos.bedroom.length > 0
          ?
          this.renderBedroom(this.props.photos.bedroom)
          :
          null
        }
        <br /><br />
        {
          this.props.photos.living_room.length > 0
          ?
          this.renderLivingRoom(this.props.photos.living_room)
          :
          null
        }
        <br /><br />
        {
          this.props.photos.kitchen.length > 0
          ?
          this.renderKitchen(this.props.photos.kitchen)
          :
          null
        }
        <br /><br />
        {
          this.props.photos.bathroom.length > 0
          ?
          this.renderBathroom(this.props.photos.bathroom)
          :
          null
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
AdImages.propTypes = {
	history: PropTypes.object.isRequired,
  photos: PropTypes.object.isRequired,          // passed in
  onClose: PropTypes.func.isRequired,           // passed in
  current_listing: PropTypes.object.isRequired, // passed in
}

// for all optional props, define a default value
AdImages.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AdImages)

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
      alignItems: 'flex-start',
      padding: '25px',
      overflowY: 'scroll',
      borderRadius: '0px',
      height: '96vh',
		}
	}
}
