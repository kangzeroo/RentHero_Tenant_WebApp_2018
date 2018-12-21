// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Select,
  List,
  Card,
  Rate,
} from 'antd'


class NearbyLocations extends Component {

  constructor() {
    super()
    this.state = {
      nearbys: [],
      current_location: null,
      nearbys_string: 'groceries',

      current_page: 1,

      loading: true,
    }
    this.map = null
  }

  componentWillMount() {
    if (this.props.current_listing && this.props.current_listing.GPS) {
      this.refreshNearbyStuff(this.props.current_listing)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.current_listing !== nextProps.current_listing) {
      this.refreshNearbyStuff(nextProps.current_listing)
    }
  }

  refreshNearbyStuff(current_listing) {
    this.getNearby(current_listing)
      .then((nearbys) => {
        this.setState({
          nearbys: nearbys,
          current_location: null,
          loading: false,
        })
        // if (this.props.card_section_shown === 'nearby') {
        //   this.renderNearby()
        // }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  getNearby(current_listing) {
    const p =  new Promise((res, rej) => {
  		const self = this
  		const location = { lat: current_listing.GPS.lat, lng: current_listing.GPS.lng }
  		// const map = new google.maps.Map(document.getElementById('map'), {
  		// 	center: location,
  		// 	zoom: 16,
  		// 	disableDefaultUI: true,
  		// })
  		// const marker = new google.maps.Marker({position: location, map: map, icon: BLUE_PIN});
  		const placeService = new google.maps.places.PlacesService(map)
      let params = {
  			location: location,
  			radius: 1000,
  			rankby: 'distance',
        keyword: this.state.nearbys_string
  		}
  		placeService.nearbySearch(params, (results, status) => {
  			if (status === 'OK') {
  				console.log('-------> Got nearby stuff')
  				console.log(results)
          // this.props.setNearbyState({
          //   count: results.length
          // })
          res(results)
  			} else {
  				console.log(results)
  				console.log(status)
          rej(status)
  			}
  		})
    })
    return p
	}

  selectedNearby(string) {
    this.setState({
      nearbys_string: string,
      loading: true,
    }, () => {
      this.refreshNearbyStuff(this.props.current_listing)
    })
  }

  renderHeader() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0}}>Nearby {this.state.nearbys_string}</h2>
        <Select
          size='large'
          style={{ width: '50%', }}
          value={this.state.nearbys_string}
          onChange={(a) => this.selectedNearby(a)}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          placeholder='Search Nearby'
        >
          <Select.Option key='cafes' value='cafes'>Cafes</Select.Option>
          <Select.Option key='groceries' value='groceries'>Groceries</Select.Option>
          <Select.Option key='stores' value='stores'>Stores</Select.Option>
          <Select.Option key='restaurants' value='restaurants'>Restaurants</Select.Option>
          <Select.Option key='bars' value='bars'>Bars</Select.Option>
          <Select.Option key='banks' value='banks'>Banks</Select.Option>
          <Select.Option key='bus' value='bus'>Bus Station</Select.Option>
          <Select.Option key='subway' value='subway'>Subway Station</Select.Option>
          <Select.Option key='parking' value='parking'>Parking Lots</Select.Option>
          <Select.Option key='daycare' value='daycare'>Day Care</Select.Option>
          <Select.Option key='parks' value='parks'>Parks</Select.Option>
        </Select>
      </div>
    )
  }

  renderCards() {
    return (
      <div>
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={this.state.nearbys}
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 3,
          }}
          loading={this.state.loading}
          renderItem={(item) => {
            const url = item.photos[0].getUrl()
            // console.log(url)
            return (
              <List.Item>
                <Card
                  cover={<img src={url} style={{ height: '100px', borderRadius: '10px', }} />}
                  bordered={false}
                  bodyStyle={{
                    textAlign: 'left',
                    margin: 0,
                    padding: 0,
                  }}
                >
                  <p style={{ fontWeight: 'bold', margin: 0, padding: 0, }}>{item.name}</p>
                  <Rate disabled allowHalf value={item.rating} />
                </Card>
              </List.Item>
            )
          }}
        />
      </div>
    )
  }

	render() {
		return (
			<div id='NearbyLocations' style={comStyles().container}>
        {
          this.renderHeader()
        }
        <br />
        {
          this.renderCards()
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
NearbyLocations.propTypes = {
	history: PropTypes.object.isRequired,
  // setNearbyState: PropTypes.func.isRequired,          // passed in
  current_listing: PropTypes.object.isRequired,       // passed in
  // card_section_shown: PropTypes.string.isRequired,    // passed in
}

// for all optional props, define a default value
NearbyLocations.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(NearbyLocations)

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
      padding: '20px',
		}
	}
}
