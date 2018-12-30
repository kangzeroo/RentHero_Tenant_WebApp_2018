// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import Ionicon from 'react-ionicons'
import { withRouter } from 'react-router-dom'
import {
  Select,
  List,
  Card,
  Rate,
  Input,
  Icon,
  Divider,
  Button,
  message,
} from 'antd'
import { setCurrentFlagPin, saveNearbyLocationsToRedux, setCurrentClickedLocation, } from '../../../actions/map/map_actions'
import { BLUE_PIN, RED_PIN, GREY_PIN, FLAG_PIN, } from '../../../assets/map_pins'
import { isMobile } from '../../../api/general/general_api'

class NearbyLocations extends Component {

  constructor() {
    super()
    this.state = {
      nearbys: [],
      current_location: null,
      nearbys_type: 'groceries',
      nearbys_text: '',
      last_search: '',

      current_page: 1,

      loading: true,

      // commute data
      directions: null,
      commute_state: {
        commute_time: 0,
        commute_distance: 0,
      },
      address_components: [],
      address_lat: 0,
      address_lng: 0,
      address_place_id: '',
      address: '',
      commute_mode: '',
      arrival_time: new Date(),
    }
    this.map = null
    this.directionsDisplay = null
  }

  componentWillMount() {
    if (this.props.current_listing && this.props.current_listing.GPS) {
      this.refreshNearbyStuff(this.props.current_listing)
    }
    this.setState({
      commute_mode: 'TRANSIT'
    })
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
      })
      .catch((err) => {
        console.log(err)
      })
  }

  getNearby(current_listing) {
    const p =  new Promise((res, rej) => {
  		const self = this

  		const location = { lat: current_listing.GPS.lat, lng: current_listing.GPS.lng }
  		const map = new google.maps.Map(document.getElementById('map'), {
  			center: location,
  			zoom: 13,
  			disableDefaultUI: true,
  		})

  		const marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: BLUE_PIN,
      })

      // set the flag pin
      const dest = this.props.prefs.LOCATION.DESTINATION_GEOPOINT.split(',')
      this.props.setCurrentFlagPin({
        coords: {
          lat: dest[0],
          lng: dest[1],
        },
        map: map,
      })

      const directionsDisplay = new google.maps.DirectionsRenderer;
      directionsDisplay.setMap(map);
      this.directionsDisplay = directionsDisplay

      this.grabDirections(current_listing)
        .then((directions) => {
          console.log(directions)
          directionsDisplay.setDirections(directions)
          this.setState({
            directions: directions,
          })
        })
        .catch((err) => {
          console.log(err)
        })

  		const placeService = new google.maps.places.PlacesService(map)
      let params = {
  			location: location,
        keyword: this.state.nearbys_type,
        rankby: google.maps.places.RankBy.DISTANCE,
  			radius: 2000,
  		}
  		placeService.nearbySearch(params, (results, status) => {
  			if (status === 'OK') {
  				console.log('-------> Got nearby stuff')
  				console.log(results)
          // this.props.setNearbyState({
          //   count: results.length
          // })
          const arrayOfPromises = results.map((result) => {
            const url = result.photos && result.photos.length > 0 ? result.photos[0].getUrl() : 'https://education.microsoft.com/Assets/images/workspace/placeholder-camera-760x370.png'
            return {
              ...result,
              cover_photo: url,
            }
          })

          Promise.all(arrayOfPromises)
            .then((modifiedResults) => {
              console.log(modifiedResults)
              this.placeIcons(modifiedResults, map)
              res(modifiedResults)
            })
            .catch((err) => {
              console.log(err)
            })

  			} else {
  				console.log(results)
  				console.log(status)
          rej(status)
  			}
  		})
    })
    return p
	}

  textQueryNearby(current_listing) {
    const p =  new Promise((res, rej) => {
      const self = this

      const location = { lat: current_listing.GPS.lat, lng: current_listing.GPS.lng }
      const map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 15,
        disableDefaultUI: true,
      })

      const marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: BLUE_PIN,
      })

      // set the flag pin
      const dest = this.props.prefs.LOCATION.DESTINATION_GEOPOINT.split(',')
      this.props.setCurrentFlagPin({
        coords: {
          lat: dest[0],
          lng: dest[1],
        },
        map: map,
      })

      const directionsDisplay = new google.maps.DirectionsRenderer;
      directionsDisplay.setMap(map);
      this.directionsDisplay = directionsDisplay

      this.grabDirections(current_listing)
        .then((directions) => {
          console.log(directions)
          directionsDisplay.setDirections(directions)
          this.setState({
            directions: directions,
          })
        })
        .catch((err) => {
          console.log(err)
        })

      const placeService = new google.maps.places.PlacesService(map)
      let params = {
        location: location,
        query: this.state.nearbys_text,
        rankby: google.maps.places.RankBy.DISTANCE,
        radius: 1500,
      }
      placeService.textSearch(params, (results, status) => {
        if (status === 'OK') {
          console.log('-------> Got nearby stuff')
          console.log(results)

          const arrayOfPromises = results.map((result) => {
            const url = result.photos && result.photos.length > 0 ? result.photos[0].getUrl() : null
            return {
              ...result,
              cover_photo: url,
            }
          })

          Promise.all(arrayOfPromises)
            .then((modifiedResults) => {
              console.log(modifiedResults)
              this.placeIcons(modifiedResults, map)
              res(modifiedResults)
            })
            .catch((err) => {
              console.log(err)
            })

        } else {
          message.warning('No Results')
          this.setState({
            loading: false,
            nearbys_text: '',
          })
          console.log(results)
          console.log(status)
          rej(status)
        }
      })
    })
    return p
  }

  grabDirections(current_listing) {
    const self = this
    const p = new Promise((res, rej) => {
      this.setState({
        address: this.props.prefs.LOCATION.DESTINATION_ADDRESS,
        commute_mode: this.state.commute_mode,
        arrival_time: this.props.prefs.LOCATION.DESTINATION_ARRIVAL,
      }, () => {
        const directionsService = new google.maps.DirectionsService
        directionsService.route({
          origin: current_listing.ADDRESS,
          destination: this.state.address,
          travelMode: this.state.commute_mode
        }, function(response, status) {
          if (status === 'OK') {
            console.log('-------> Got directions')
            console.log(response)
            self.props.setCommuteState({
              commute_time: response.routes[0].legs.reduce((acc, curr) => acc + curr.duration.value, 0),
              commute_distance: response.routes[0].legs[0].distance.text, //.reduce((acc, curr) => acc + curr.distance.value, 0),
            })
            self.setState({
              commute_state: {
                commute_time: response.routes[0].legs.reduce((acc, curr) => acc + curr.duration.value, 0),
                commute_distance: response.routes[0].legs.text, //reduce((acc, curr) => acc + curr.distance.value, 0),
              }
            })

            res(response)
          } else {
            rej(status)
            message.error('Directions request failed due to ' + status);
          }
       })
      })
    })
    return p
  }

  selectedNearby(string) {
    this.setState({
      nearbys_type: string,
      loading: true,
    }, () => {
      this.props.setCurrentClickedLocation('remove', {}, this.props.nearby_locations.locations)
      this.refreshNearbyStuff(this.props.current_listing)
    })
  }

  searchTextNearby() {
    this.setState({
      loading: true,
    }, () => {
      this.props.setCurrentClickedLocation('remove', {}, this.props.nearby_locations.locations)
      this.textQueryNearby(this.props.current_listing)
        .then((nearbys) => {
          this.setState({
            nearbys: nearbys,
            current_location: null,
            loading: false,
            nearbys_type: this.state.nearbys_text,
            last_search: this.state.nearbys_text,
          })
        })
        .catch((err) => {
          console.log(err)
        })
    })
  }

  placeIcons(nearbys, map) {
    let nearby_locations = []

    nearbys.forEach((loc) => {
      let location
      if (loc.location && loc.location.lat) {
        location = loc.location
      } else {
        location = { lat: loc.geometry.location.lat(), lng: loc.geometry.location.lng() }
      }

      const icon = {
        url: loc.icon,
        scaledSize: new google.maps.Size(30, 30),
      }
      const marker = new google.maps.Marker({
        id: loc.id,
        position: location,
        map: map,
        icon: icon,
      })
      marker.addListener('click', (event) => {
        if (this.props.nearby_locations && this.props.nearby_locations.locations) {
          this.props.setCurrentClickedLocation('add', loc, this.props.nearby_locations.locations)
        }  else {
          console.log('NEARBY LOCATIONS NOT INITIALIZED YET')
        }
      })

      const nearby_loc = {
        location: location,
        ...loc,
        marker: marker,
      }

      nearby_locations.push(nearby_loc)
    })

    this.map = map

    // console.log({
    //   origins: [this.props.current_listing.ADDRESS],
    //   destinations: nearby_locations.map((loc) => { return loc.vicinity ? loc.vicinity : loc.formatted_address }),
    //   travelMode: this.state.commute_mode,
    // })
    console.log(nearby_locations)

    // enable in google cloud first
    const distanceMatrix = new google.maps.DistanceMatrixService()
    distanceMatrix.getDistanceMatrix({
        origins: [this.props.current_listing.ADDRESS],
        destinations: nearby_locations.map((loc) => { return loc.vicinity ? loc.vicinity : loc.formatted_address }),
        travelMode: 'WALKING',
      }, (response, status) => {
        if (status !== 'OK') {
          console.log(status)
          alert('Error was: ' + status);
        } else {
          console.log('DISTANCE MATRIX', response)

          if (response && response.rows && response.rows.length > 0 && response.rows[0].elements) {
            const arrayOfPromises = nearby_locations.map((loc, i) => {
              return {
                ...loc,
                distance: response.rows[0].elements[i],
              }
            })

            return Promise.all(arrayOfPromises)
              .then((data) => {
                const sortedData = data.sort((a, b) => a.distance.distance.value - b.distance.distance.value)
                console.log(sortedData)
                this.setState({
                  nearbys: sortedData,
                })
                this.props.saveNearbyLocationsToRedux({
                  type: this.state.nearbys_type,
                  locations: sortedData,
                })
              })
          } else {
            this.props.saveNearbyLocationsToRedux({
              type: this.state.nearbys_type,
              locations: nearby_locations,
            })
          }

        }
      }
    )
    // console.log('NEARBY LOCATIONS READY TO SAVE TO REDUX: ', nearby_locations)

  }

  changeCommuteMode(mode) {
    console.log('Changed Transit Mode: ', mode)
    this.setState({
      commute_mode: mode,
    }, () => {
      this.grabDirections(this.props.current_listing)
        .then((directions) => {
          console.log(directions)
          this.directionsDisplay.setDirections(directions)
          this.setState({
            directions: directions,
          })
        })
        .catch((err) => {
          console.log(err)
        })
    })
  }

  renderHeader() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0}}>Nearby {this.state.nearbys_type}</h2>
        <Select
          size='large'
          style={{ width: '50%', }}
          value={this.state.nearbys_type}
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
    const clickedCard = (item) => {
      if (this.props.nearby_locations && this.props.nearby_locations.locations) {
        console.log('Clicked Location: ', item)
        this.props.setCurrentClickedLocation('add', item, this.props.nearby_locations.locations)
      } else {
        console.log('NO ACTION ---> Clicked Location: ', item)
      }
    }
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
            simple: true,
          }}
          loading={this.state.loading}
          renderItem={(item) => {
            let url
            if (item.cover_photo) {
              url = item.cover_photo
            } else {
              url = item.photos && item.photos.length > 0 ? item.photos[0].getUrl() : 'https://education.microsoft.com/Assets/images/workspace/placeholder-camera-760x370.png'
            }
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
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={() => clickedCard(item)}
                >
                  <p style={{ fontWeight: 'bold', margin: 0, padding: 0, }}>{item.name}</p>
                  <Rate disabled allowHalf value={item.rating} />
                  {
                    item.distance
                    ?
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                      <div>{item.distance.distance.text}</div>
                      <Divider type='vertical' />
                      <div>{`${item.distance.duration.text} walk`}</div>
                    </div>
                    :
                    null
                  }
                </Card>
              </List.Item>
            )
          }}
        />
      </div>
    )
  }

  renderSearchContainer() {
    return (
      <div style={searchStyles().container}>
        <Input
          value={this.state.nearbys_text}
          onChange={(a) => this.setState({ nearbys_text: a.target.value, })}
          onPressEnter={this.state.nearbys_text.length > 0 ? () => this.searchTextNearby() : () => {}}
          placeholder='Search Nearby...'
          style={{ border: 'none', borderRadius: '10px', }}
          disabled={this.state.loading}
        />

        <Divider type='vertical' />

        <Button type='primary' onClick={() => this.searchTextNearby()} style={{ borderRadius: '25px', }} icon='search' loading={this.state.loading} disabled={this.state.nearbys_text.length === 0 || this.state.loading || this.state.nearbys_text === this.state.last_search}>
          Search
        </Button>

        <Divider type="vertical" style={{ color: 'black' }} />

        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Ionicon
            icon="md-car"
            onClick={(e) => this.changeCommuteMode("DRIVING")}
            fontSize="1.5rem"
            style={iconStyles(this.state.commute_mode === 'DRIVING').icon}
            color={this.state.commute_mode === 'DRIVING' ? 'white' : 'black'}
          />
          <Ionicon
            icon="md-walk"
            onClick={(e) => this.changeCommuteMode("WALKING")}
            fontSize="1.5rem"
            style={iconStyles(this.state.commute_mode === 'WALKING').icon}
            color={this.state.commute_mode === 'WALKING' ? 'white' : 'black'}
          />
          <Ionicon
            icon="md-bicycle"
            onClick={(e) => this.changeCommuteMode("BICYCLING")}
            fontSize="1.5rem"
            style={iconStyles(this.state.commute_mode === 'BICYCLING').icon}
            color={this.state.commute_mode === 'BICYCLING' ? 'white' : 'black'}
          />
          <Ionicon
            icon="md-train"
            onClick={(e) => this.changeCommuteMode("TRANSIT")}
            fontSize="1.5rem"
            style={iconStyles(this.state.commute_mode === 'TRANSIT').icon}
            color={this.state.commute_mode === 'TRANSIT' ? 'white' : 'black'}
          />
          <Divider type="vertical" />
          <div style={searchStyles().commute}>{`${(this.state.commute_state.commute_time/60).toFixed(0)} Mins`}</div>
        </div>

      </div>
    )
  }


  renderNearbyLocationCard(item) {
    return (
      <Card
        style={nearbyStyles().container}
        bodyStyle={nearbyStyles().row}
      >
        <img src={item.cover_photo} style={nearbyStyles().img} />
        <div style={nearbyStyles().column}>
          <h2>{item.name}</h2>
          <p>{item.vicinity ? item.vicinity : item.formatted_address}</p>
          {
            item.price_level
            ?
            <div>{"$".repeat(item.price_level)}</div>
            :
            null
          }
          <Rate disabled allowHalf value={item.rating} />
          {
            item.distance
            ?
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <div>{item.distance.distance.text}</div>
              <Divider type='vertical' />
              <div>{`${item.distance.duration.text} walk`}</div>
            </div>
            :
            null
          }
        </div>
        <Icon
          type="close-circle"
          theme="twoTone"
          style={nearbyStyles().popup}
          onClick={() => this.props.setCurrentClickedLocation('remove', item, this.props.nearby_locations.locations)}
        />
      </Card>
    )
  }

	render() {
		return (
			<div id='NearbyLocations' style={comStyles().container}>
        {
          isMobile()
          ?
          null
          :
          this.renderSearchContainer()
        }
        {
          this.renderHeader()
        }
        <br />
        {
          this.renderCards()
        }
        {
          this.props.current_clicked_location && this.props.current_clicked_location.id
          ?
          this.renderNearbyLocationCard(this.props.current_clicked_location)
          :
          null
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
  setCommuteState: PropTypes.func.isRequired,         // passed in
  setCurrentFlagPin: PropTypes.func.isRequired,
  saveNearbyLocationsToRedux: PropTypes.func.isRequired,
  prefs: PropTypes.object.isRequired,
  nearby_locations: PropTypes.object,
  current_clicked_location: PropTypes.object,
  setCurrentClickedLocation: PropTypes.func.isRequired,
}

// for all optional props, define a default value
NearbyLocations.defaultProps = {
  nearby_locations: {},
  current_clicked_location: {},
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(NearbyLocations)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    prefs: redux.prefs,
    nearby_locations: redux.map.nearby_locations,
    current_clicked_location: redux.map.current_clicked_location,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    setCurrentFlagPin,
    saveNearbyLocationsToRedux,
    setCurrentClickedLocation,
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

const nearbyStyles = () => {
  return {
    container: {
      position: 'absolute',
      bottom: '15px',
      right: '15px',
      minWidth: '400px',
      maxWidth: '55vw',
      maxHeight: '300px',
      zIndex: 100,
      borderRadius: '10px',
      boxShadow: '10px 10px',
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      margin: 0,
      padding: '10px',
    },
    col: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginLeft: '25px',
    },
    img: {
      height: '200px',
      maxWidth: '350px',
      borderRadius: '10px',
    },
    popup: {
      position: 'absolute',
      right: '-10px',
      top: '-10px',
      cursor: 'pointer',
      fontSize: '1.5rem',
      maxHeight: '30px',
      ":hover": {
        opacity: 0.5
      }
    }
  }
}

const searchStyles = () => {
  return {
    container: {
      position: 'absolute',
      top: '8vh',
      right: '5vw',
      width: '50vw',
      backgroundColor: 'white',
      zIndex: 100,
      height: '50px',
      borderRadius: '10px',
      border: '#2faded solid thin',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: '10px 15px',
    },
		price: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'black',
      margin: '0px 0px 5px 0px',
		},
    commute: {
      width: '100px',
      backgroundColor: '#0ca20c',
      color: 'white',
      borderRadius: '5px',
      display: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      fontSize: '0.8rem',
      fontWeight: 'normal',
      padding: '2px',
    },
  }
}

const iconStyles = (isIcon) => {
  let attrs
  if (isIcon) {
    attrs = {
      backgroundColor: '#2faded',
      borderRadius: '50%',
      boxShadow: '0 0 0 3px #2faded',
      color: 'white',
    }
  } else {
    attrs = {
      color: 'black'
    }
  }
  return {
    icon: {
      marginRight: '7.5px',
      cursor: 'pointer',
      ":hover": {
        transform: 'scale(1.5)',
      },
      ...attrs,
    }
  }
}
