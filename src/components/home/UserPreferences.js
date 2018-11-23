// Compt for copying as a UserPreferences
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import $ from "jquery"
import SubtitlesMachine from '../modules/SubtitlesMachine'
import {
  InputItem,
  ActivityIndicator,
} from 'antd-mobile'
import { savePrefs } from '../../actions/listings/listings_actions'
import {
	saveListingsToRedux,
} from '../../actions/listings/listings_actions'
import {
	getListings,
} from '../../api/listings/listings_api'


class UserPreferences extends Component {

  constructor() {
    super()
    this.state = {
      step: 0,
      beds: 0,
      price: 1200,
      dest_attr: '',
      loading: false,
      commute_mode: 'transit',

      ad_address_components: [],
      ad_lat: 0,                // the ad lat according to google
      ad_long: 0,               // the ad lng according to google
      ad_place_id: '',          // the ad place_id according to google
      ad_address: '',					  // the ad_address typed in
    }
  }

  startAutocomplete() {
    this.autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('ad_address')),
            {
              // types: ['address', 'establishment'],
              // bounds: new google.maps.LatLngBounds(
              //   new google.maps.LatLng(-80.671519, 43.522913),
              //   new google.maps.LatLng(-80.344067, 43.436979)
              // )
            }
          );
    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    this.autocomplete.addListener('place_changed', this.fillInAddress.bind(this));
  }

  fillInAddress() {
    const place = this.autocomplete.getPlace()
    this.setState({
      ad_address_components: place.address_components,
      ad_address: place.formatted_address,
      ad_lat: place.geometry.location.lat().toFixed(7),
      ad_long: place.geometry.location.lng().toFixed(7),
      ad_place_id: place.place_id,
      dest_attr: place.formatted_address,
    }, () => this.setState({ step: this.state.step + 1 }))
  }

  incrementCounter(attr, inc) {
    if (this.state[attr] + inc >= 0) {
      this.setState({
        [attr]: this.state[attr] + inc,
        step: this.state.step + 1
      })
      // window.scrollTo(0,window.innerHeight)
    }
  }

  pickCommuteMode(mode) {
    this.setState({
      commute_mode: mode,
      step: this.state.step + 1
    }, () => console.log(this.state))
    // window.scrollTo(0,window.innerHeight)
  }

  submitPrefs() {
    this.props.savePrefs({
      max_beds: this.state.beds,
      max_budget: this.state.price,
      destination: {
        address: this.state.ad_address,
        place_id: this.state.ad_place_id,
        commute_mode: this.state.commute_mode,
        gps: { lat: this.state.ad_lat, lng: this.state.ad_long }
      }
    })
    this.setState({
      loading: true
    })
    getListings({
      max_beds: this.state.beds,
      max_budget: this.state.price,
      destination: {
        address: this.state.ad_address,
        place_id: this.state.ad_place_id,
        commute_mode: this.state.commute_mode,
        gps: { lat: this.state.ad_lat, lng: this.state.ad_long }
      }
    })
      .then((data) => {
        console.log(data)
        this.props.saveListingsToRedux(data)
        this.props.history.push('/notes')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  clickedNext() {
    if (this.state.ad_place_id) {
      this.setState({ step: this.state.step + 1 })
    }
  }

	render() {
		return (
			<div id='UserPreferences' style={comStyles().container}>
        <div onClick={() => this.clickedNext()} style={comStyles().slim}>
          <br/>
          <SubtitlesMachine
              speed={0.25}
              text={`Ok first step, where do you travel to most often? eg. Work or School`}
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
                  this.setState({ step: this.state.step + 1 }, () => this.startAutocomplete())
                  // window.scrollTo(0,window.innerHeight)
                }, 1000)
              }}
            />
            {
              this.state.step >= 1
              ?
              <div onClick={(e) => e.stopPropagation()}>
              <input
                id="ad_address"
                value={this.state.dest_attr}
                onChange={(e) => {
                  console.log(e.target.value)
                  this.setState({ dest_attr: e.target.value })
                  // window.scrollTo(0,window.innerHeight)
                }}
                placeholder="Enter Address"
                style={inputStyles().text}
              ></input>
              </div>
              :
              null
            }
            <br /><br />
            {
              this.state.step >= 2
              ?
              <SubtitlesMachine
                  speed={0.15}
                  text={`How many beds are you looking for?`}
                  textStyles={{
                    fontSize: '1.5rem',
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
                      // window.scrollTo(0,window.innerHeight)
                    }, 600)
                  }}
              />
              :
              null
            }
            {
              this.state.step >= 3
              ?
              <div style={comStyles().counterDiv}>
                <img onClick={() => this.incrementCounter('beds', -1)} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACaSURBVGhD7dExCsJAEEbhLWxFrBSLHMFTpBC09TJWlt4oR7HzFNa7PsjUsmlkwPfBkOrBv6RIkiRJkiTpi9baihu5a5artV74bmLiMsQTcTrsenHrmNmHbjvnaY0xtQ/BMHc58YfOMbUPjQ/6pcUPIthFmxL7TjG1H9Ez+lTY9eazj5n9CA/cjfiR6O5sOsZESZIkSZIk/YlSPt/mbmTucJTuAAAAAElFTkSuQmCC" />
                <div style={{ fontSize: '3rem', color: 'white', fontWeight: 'bold' }}>{this.state.beds}</div>
                <img onClick={() => this.incrementCounter('beds', 1)} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAE0SURBVGhD7ZgxTsNAFERdpCSKqEApcgS4RBBIATqa3ASqdNByEiQajpAjpCOXSG3zIFMkyhrWFOYvmieNvuS/I8/ITTaVMcb0RtM0R+h4RyOtyoLgg7qu35gH8HyFxjpaBgS+UP4k7O91tAwIPFf2JOwfdbQMXCg6LhQdF4qOC0XHhaLjQn3Aewdoiu66isDPzFbYvzCS3u+E75r5uzsV5uR95q8h1zsaKmYe+D5vl5GZKmoeGCZbX0z4QjNFzQOPC/VJ50IYTuQNCfmuFDUfTCv5Q0GuDeNUMfPBOEYPmJ+6Ct8rsxX2S0bS+4MWeM8UsT94qX/6hMaFouNC0XGh6LhQdFwoOv+x0I2yt7HQ0TIg8IhS6232fXi+Qec6Wg6EHqJLOuz+r3bL7H45M8YY80VVfQAKGazHBcXgLwAAAABJRU5ErkJggg=="/>
              </div>
              :
              null
            }
            {
              this.state.step >= 4
              ?
              <SubtitlesMachine
                speed={0.25}
                text={`And what is your max budget?`}
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
                    // window.scrollTo(0,window.innerHeight)
                  }, 1000)
                }}
              />
              :
              null
            }
            {
              this.state.step >= 5
              ?
              <div style={comStyles().counterDiv}>
                <img onClick={() => this.incrementCounter('price', -100)} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACaSURBVGhD7dExCsJAEEbhLWxFrBSLHMFTpBC09TJWlt4oR7HzFNa7PsjUsmlkwPfBkOrBv6RIkiRJkiTpi9baihu5a5artV74bmLiMsQTcTrsenHrmNmHbjvnaY0xtQ/BMHc58YfOMbUPjQ/6pcUPIthFmxL7TjG1H9Ez+lTY9eazj5n9CA/cjfiR6O5sOsZESZIkSZIk/YlSPt/mbmTucJTuAAAAAElFTkSuQmCC" />
                <div style={{ fontSize: '3rem', color: 'white', fontWeight: 'bold' }}>${this.state.price}</div>
                <img onClick={() => this.incrementCounter('price', 100)} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAE0SURBVGhD7ZgxTsNAFERdpCSKqEApcgS4RBBIATqa3ASqdNByEiQajpAjpCOXSG3zIFMkyhrWFOYvmieNvuS/I8/ITTaVMcb0RtM0R+h4RyOtyoLgg7qu35gH8HyFxjpaBgS+UP4k7O91tAwIPFf2JOwfdbQMXCg6LhQdF4qOC0XHhaLjQn3Aewdoiu66isDPzFbYvzCS3u+E75r5uzsV5uR95q8h1zsaKmYe+D5vl5GZKmoeGCZbX0z4QjNFzQOPC/VJ50IYTuQNCfmuFDUfTCv5Q0GuDeNUMfPBOEYPmJ+6Ct8rsxX2S0bS+4MWeM8UsT94qX/6hMaFouNC0XGh6LhQdFwoOv+x0I2yt7HQ0TIg8IhS6232fXi+Qec6Wg6EHqJLOuz+r3bL7H45M8YY80VVfQAKGazHBcXgLwAAAABJRU5ErkJggg=="/>
              </div>
              :
              null
            }
            <br/>
            {
              this.state.step >= 6
              ?
              <div style={commuteStyles().container}>
                <h2 style={{ color: 'white' }}>Do you drive or take public transit?</h2>
                <br/>
                <div onClick={() => this.pickCommuteMode('driving')} style={commuteStyles(this.state.commute_mode).driving}>Drive</div>
                <div onClick={() => this.pickCommuteMode('transit')} style={commuteStyles(this.state.commute_mode).transit}>Public Transit</div>
              </div>
              :
              null
            }
            {
              this.state.step >= 7
              ?
              <div onClick={() => this.submitPrefs()} style={comStyles().start_btn}>
                {
                  this.state.loading
                  ?
                  <ActivityIndicator animating />
                  :
                  <div>Find Matches</div>
                }
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
UserPreferences.propTypes = {
	history: PropTypes.object.isRequired,
  savePrefs: PropTypes.func.isRequired,
  saveListingsToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
UserPreferences.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(UserPreferences)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    savePrefs,
    saveListingsToRedux,
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
      padding: '50px 0px 0px 0px',
      alignItems: 'center',
			background: '#00c6ff', /* fallback for old browsers */
		  background: '-webkit-linear-gradient(to right, #00c6ff, #0072ff)', /* Chrome 10-25, Safari 5.1-6 */
		  background: 'linear-gradient(to right, #00c6ff, #0072ff)' /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
		},
    slim: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%',
      maxWidth: '500px',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    start_btn: {
      margin: '50px 0px 20px 0px',
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: 'white',
      border: '1px solid white',
      padding: '15px',
      width: '90%',
      borderRadius: '20px',
      textAlign: 'center',
      cursor: 'pointer'
    },
    counterDiv: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding: '30px'
    }
	}
}

const commuteStyles = (commute_mode) => {
  let driveStyle = {
    color: 'white',
    fontSize: '1.5rem',
    margin: '20px',
    cursor: 'pointer',
  }
  let transitStyle = {
    color: 'white',
    fontSize: '1.5rem',
    margin: '20px',
    cursor: 'pointer',
  }
  if (commute_mode === 'transit') {
    transitStyle.color = 'blue'
    transitStyle.backgroundColor = 'white'
  }
  if (commute_mode === 'driving') {
    driveStyle.color = 'blue'
    driveStyle.backgroundColor = 'white'
  }
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      padding: '30px'
    },
    driving: {
      ...driveStyle
    },
    transit: {
      ...transitStyle
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
      fontSize: '1.5rem',
      height: '30px',
      borderRadius: '10px',
      margin: '20px 0px 0px 0px',
      padding: '25px',
      color: '#ffffff',
      webkitBoxShadow: '0 2px 10px 1px rgba(0,0,0,0)',
      boxShadow: '0 2px 10px 1px rgba(0,0,0,0)',
    },
    // '::-webkit-input-placeholder': { color: '#666' },
    // ':placeholder': { color: '#666' },
    // ':-moz-placeholder': { color: '#666' },
    // '::-moz-placeholder': { color: '#666' },
    // ':-ms-input-placeholder': { color: '#666' },
  }
}
