// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  List,
  Card,
} from 'antd'


class AdImagesSection extends Component {

  constructor() {
    super()
    this.state = {

    }
  }

  componentWillMount() {

  }

  renderOutside(imgs) {
    let shown_imgs = imgs
    if (imgs.length > 3) {
      shown_imgs = imgs.slice(0, 3)
    }
    console.log(shown_imgs)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <h2>Exterior</h2>
        <List
          grid={{ gutter: 16, column: 3, }}
          dataSource={shown_imgs}
          renderItem={item => (
            <List.Item>
              <Card
                cover={<img src={item.url} style={imgStyles(shown_imgs.length < 3).image} />}
                bordered={false}
                bodyStyle={{ height: 0, margin: 0, padding: 0, }}
              />
            </List.Item>
          )}
        />
      </div>
    )
  }

  renderBedroom(imgs) {
    let shown_imgs = imgs
    if (imgs.length > 3) {
      shown_imgs = imgs.slice(0, 3)
    }
    console.log(shown_imgs)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <h2>Bedroom</h2>
        <List
          grid={{ gutter: 16, column: 3, }}
          dataSource={shown_imgs}
          renderItem={item => (
            <List.Item>
              <Card
                cover={<img src={item.url} style={imgStyles(shown_imgs.length < 3).image} />}
                bordered={false}
                bodyStyle={{ height: 0, margin: 0, padding: 0, }}
              />
            </List.Item>
          )}
        />
      </div>
    )
  }

  renderLivingRoom(imgs) {
    let shown_imgs = imgs
    if (imgs.length > 3) {
      shown_imgs = imgs.slice(0, 3)
    }
    console.log(shown_imgs)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <h2>Living room</h2>
        <List
          grid={{ gutter: 16, column: 3, }}
          dataSource={shown_imgs}
          renderItem={item => (
            <List.Item>
              <Card
                cover={<img src={item.url} style={imgStyles(shown_imgs.length < 3).image} />}
                bordered={false}
                bodyStyle={{ height: 0, margin: 0, padding: 0, }}
              />
            </List.Item>
          )}
        />
      </div>
    )
  }

  renderKitchen(imgs) {
    let shown_imgs = imgs
    if (imgs.length > 3) {
      shown_imgs = imgs.slice(0, 3)
    }
    console.log(shown_imgs)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <h2>Kitchen</h2>
        <List
          grid={{ gutter: 16, column: 3, }}
          dataSource={shown_imgs}
          renderItem={item => (
            <List.Item>
              <Card
                cover={<img src={item.url} style={imgStyles(shown_imgs.length < 3).image} />}
                bordered={false}
                bodyStyle={{ height: 0, margin: 0, padding: 0, }}
                style={{
                  maxHeight: '250px'
                }}
              />
            </List.Item>
          )}
        />
      </div>
    )
  }

  renderBathroom(imgs) {
    let shown_imgs = imgs
    if (imgs.length > 3) {
      shown_imgs = imgs.slice(0, 2)
    }
    console.log(shown_imgs)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <h2>Bathroom</h2>
        <List
          grid={{ gutter: 16, column: 3, }}
          dataSource={shown_imgs}
          renderItem={item => (
            <List.Item>
              <Card
                cover={<img src={item.url} style={imgStyles(shown_imgs.length < 3).image} />}
                bordered={false}
                bodyStyle={{ height: 0, margin: 0, padding: 0, }}
              />
            </List.Item>
          )}
        />
      </div>
    )
  }

	render() {
		return (
			<div id='AdImagesSection' style={comStyles().container}>
				<h1>Tour this home</h1>
        {
          this.props.photos.outside.length > 0
          ?
          this.renderOutside(this.props.photos.outside)
          :
          null
        }
        {
          this.props.photos.bedroom.length > 0
          ?
          this.renderBedroom(this.props.photos.bedroom)
          :
          null
        }
        {
          this.props.photos.living_room.length > 0
          ?
          this.renderLivingRoom(this.props.photos.living_room)
          :
          null
        }
        {
          this.props.photos.kitchen.length > 0
          ?
          this.renderKitchen(this.props.photos.kitchen)
          :
          null
        }
        {
          this.props.photos.bathroom.length > 0
          ?
          this.renderBathroom(this.props.photos.bathroom)
          :
          null
        }
        <br />
        <div style={comStyles().show_all_text} onClick={() => this.props.onShowAll()}>{`Explore all ${this.props.photos.img_count} Photos`}</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
AdImagesSection.propTypes = {
	history: PropTypes.object.isRequired,
  photos: PropTypes.object.isRequired,      // passed in
  onShowAll: PropTypes.func.isRequired,     // passed in
}

// for all optional props, define a default value
AdImagesSection.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AdImagesSection)

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
      padding: '20px',
		},
    show_all_text: {
      fontWeight: 'bold',
      color: '#2faded',
      cursor: 'pointer',
      fontSize: '1.2rem',
      ":hover": {
        textDecoration: 'underline'
      }
    }
	}
}

const imgStyles = (enlarge) => {
  let attrs = {}
  if (enlarge) {
    attrs = {
      // width: '200%'
    }
  }
  return {
    image: {
      borderRadius: '5px',
      maxHeight: '200px',
      ...attrs,
    }
  }

}
