// Compt for copying as a MapSegment
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import SubtitlesMachine from './SubtitlesMachine'
import { isMobile } from '../../../../api/general/general_api'
import { Tooltip } from 'antd'
import {
  Toast,
  Icon,
} from 'antd-mobile'
import { ACCENT_COLOR, FONT_COLOR, INPUT_BACKGROUND, INPUT_PLACEHOLDER_COLOR, FONT_FAMILY } from '../styles/advisor_ui_styles'



/*
  <MapSegment
    title='Map Segment'
    schema={{ id: '1', endpoint: '2' }}
    texts={[
      { id: '1-1', text: 'Some string to display' },
      { id: '1-2', text: 'The next string to display!' }
    ]}
    onDone={(original_id, endpoint, data) => this.done(original_id, endpoint, data)}
    triggerScrollDown={() => this.triggerScrollDown()}
    segmentStyles={{ padding: '30px 0px 0px 0px' }}
    skippable={false}
    skipEndpoint=''
  />
*/



class MapSegment extends Component {

  constructor() {
    super()
    this.state = {
      completedSections: [],
			instantChars: false,
      data: {
        address_components: [],
        address_lat: 0,
        address_lng: 0,
        address_place_id: '',
        address: '',
      }
    }
    this.mobile = false
  }

  componentWillMount() {
    if (this.props.initialData) {
      this.setState({
        data: {
          ...this.state.data,
          ...this.props.initialData
        }
      })
    }
    if (this.props.instant_chars_segment_id === this.props.schema.id) {
      this.setState({
        instantChars: true
      })
    }
  }

  componentDidMount() {
    if (this.state.instantChars) {
      this.startAutocomplete()
    }
    this.mobile = isMobile()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.initialData !== this.props.initialData) {
      this.setState({
        data: {
          ...this.state.data,
          ...this.props.initialData
        }
      })
    }
    if (prevProps.instant_chars_segment_id !== this.props.instant_chars_segment_id) {
      if (this.props.instant_chars_segment_id === this.props.schema.id) {
        this.setState({
          instantChars: true
        })
      }
    }
  }

  shouldDisplayText(text, txtIndex) {
    if (txtIndex === 0) {
      return true
    } else {
      return this.state.completedSections.filter((id) => {
        return this.props.texts[txtIndex - 1].id === id
      }).length > 0
    }
  }

  shouldInstantChars(txtIndex) {
    if (txtIndex === 0) {
      return false
    } else {
      let allOtherTextsLoadedCount = 0
      this.props.texts.forEach((text) => {
        this.state.completedSections.forEach((sec) => {
          if (text.id === sec.id) {
            allOtherTextsLoadedCount += 1
          }
        })
      })
      return allOtherTextsLoadedCount === this.props.texts.length
    }
  }

  shouldDisplayInput() {
    if (this.state.instantChars) {
      return true
    } else {
      let allOtherTextsLoadedCount = 0
      this.props.texts.forEach((text) => {
        this.state.completedSections.forEach((id) => {
          if (text.id === id) {
            allOtherTextsLoadedCount += 1
          }
        })
      })
      return allOtherTextsLoadedCount === this.props.texts.length
    }
  }

  nextSegment(e, endpoint = this.props.schema.endpoint) {
    if (e) {
      e.stopPropagation()
    }
    this.props.onDone(this.props.schema.id, endpoint, this.state.data)
  }

  startAutocomplete() {
    this.autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById(`address--${this.props.schema.id}`)),
            {
              // types: ['address', 'establishment'],
              // bounds: new google.maps.LatLngBounds(
              //   new google.maps.LatLng(-80.671519, 43.522913),
              //   new google.maps.LatLng(-80.344067, 43.436979)
              // )
							componentRestrictions: {country: "ca"},
              ...this.props.mapOptions
            }
          );
    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    this.autocomplete.addListener('place_changed', () => this.fillInAddress())
    if(!this.mobile) {
      document.getElementById(`address--${this.props.schema.id}`).focus()
    }
    if (this.state.data.address_lat && this.state.data.address_lng) {
      this.renderMap(parseFloat(this.state.data.address_lat), parseFloat(this.state.data.address_lng))
    }
  }

  fillInAddress() {
    const place = this.autocomplete.getPlace()
    this.setState({
      data: {
        ...this.state.data,
        address_components: place.address_components,
        address_lat: place.geometry.location.lat().toFixed(7),
        address_lng: place.geometry.location.lng().toFixed(7),
        address_place_id: place.place_id,
        address: place.formatted_address,
      }
    }, () => {
			document.getElementById(`address--${this.props.schema.id}`).blur()
			setTimeout(() => {
        this.renderMap(parseFloat(place.geometry.location.lat().toFixed(7)), parseFloat(place.geometry.location.lng().toFixed(7)))
			}, 500)
		})
  }

  renderMap(lat, lng) {
    document.getElementById(`map--${this.props.schema.id}`).style.height = '250px'
    const coords = { lat, lng }
    const map = new google.maps.Map(document.getElementById(`map--${this.props.schema.id}`), {
      center: coords,
      zoom: 13,
      disableDefaultUI: true,
    })
    const marker = new google.maps.Marker({position: coords, map: map})
    document.getElementById(`map--${this.props.schema.id}`).scrollIntoView({ behavior: "smooth", block: "top" })
  }

  focusedInput(id) {
    if (this.mobile) {
      document.getElementById(id).scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  renderCustomComponent(text) {
    if (this.state.completedSections.filter((id) => {
      return id === text.id
    }).length === 0) {
      this.setState({ completedSections: this.state.completedSections.concat([text.id]) })
    }
    return (text.component)
  }

	render() {
		return (
			<div id={`MapSegment--${this.props.schema.id}`} style={{ ...comStyles().container, ...this.props.segmentStyles }}>
        {
          this.props.title
          ?
          <div style={{ padding: '0px 0px 20px 0px', display: 'flex', borderBottom: `1px solid ${ACCENT_COLOR}` }}>
            <span style={{ fontSize: '0.7rem', color: ACCENT_COLOR }}>{this.props.title.toUpperCase()}</span>
          </div>
          :
          null
        }
        <div>
        {
          this.props.texts.map((text, txtIndex) => {
            return (
              <div>
                {
                  this.shouldDisplayText(text, txtIndex) || this.state.instantChars
                  ?
                  <div>
                    {
                      text.component
                      ?
                      this.renderCustomComponent(text)
                      :
                      <SubtitlesMachine
                        id={`Subtitle--${this.props.schema.id}--${text.id}`}
                        key={`${text.id}_${txtIndex}`}
        								instant={this.state.instantChars || this.shouldInstantChars(txtIndex)}
        								speed={0.25}
        								delay={this.state.instantChars || this.shouldInstantChars(txtIndex) ? 0 : 500}
        								text={text}
        								textStyles={{
        									fontSize: '1.1rem',
        									color: FONT_COLOR,
        									textAlign: 'left',
                          fontFamily: FONT_FAMILY,
                          ...text.textStyles,
        								}}
        								containerStyles={{
        									width: '100%',
        									backgroundColor: 'rgba(0,0,0,0)',
        									margin: '20px 0px 20px 0px',
        								}}
        								doneEvent={() => {
      										this.setState({ completedSections: this.state.completedSections.concat([text.id]) }, () => {
                            if (text.scrollDown) {
                              this.props.triggerScrollDown(null, 1000)
                            }
                            if (this.shouldDisplayInput() || this.state.instantChars) {
                              this.startAutocomplete()
                            }
                          })
        								}}
        							/>
                    }
                  </div>
                  :
                  null
                }
              </div>
            )
          })
        }
        </div>
        <div style={{ margin: '10px 0px 0px 0px' }}>
          {
            this.shouldDisplayInput() || this.state.instantChars
            ?
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                id={`address--${this.props.schema.id}`}
                value={this.state.data.address}
                onChange={(e) => {
                  this.setState({ data: { ...this.state.data, address: e.target.value } })
                }}
                onFocus={() => this.focusedInput(`address--${this.props.schema.id}`)}
                placeholder="Enter Location"
                style={comStyles().text}
              ></input>
              <div id={`map--${this.props.schema.id}`} style={{ height: '10px', borderRadius: '10px', margin: '10px 0px 0px 0px' }}></div>
            </div>
            :
            null
          }
        </div>
        <div style={{ height: '100px', display: 'flex', flexDirection: 'row' }}>
          <div style={{ width: '50%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', position: 'relative' }}>
            {
              this.props.skippable && this.props.skipEndpoint && this.shouldDisplayInput()
              ?
              <div id={`skip--${this.props.schema.id}`} onClick={(e) => this.nextSegment(e, this.props.skipEndpoint)} style={comStyles().skip}>Skip</div>
              :
              null
            }
          </div>
          <div style={{ width: '50%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', position: 'relative' }}>
            {
              this.state.data.address && this.state.data.address_lat && this.state.data.address_lng && this.shouldDisplayInput()
              ?
              <Icon onClick={(e) => this.nextSegment(e)} type='check-circle' size='lg' style={comStyles().check} />
              :
              <div>
                {
                  this.shouldDisplayInput()
                  ?
                  <Icon type='check-circle-o' size='lg' style={{ ...comStyles().check, cursor: 'not-allowed', color: ACCENT_COLOR }} />
                  :
                  null
                }
              </div>
            }
          </div>
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
MapSegment.propTypes = {
  // GENERIC PROPS FOR ALL SEGMENTS
  title: PropTypes.string,                  // passed in
	history: PropTypes.object.isRequired,
  instant_chars_segment_id: PropTypes.string.isRequired, // passed in, determines if this.state.instantChars = true
  triggerScrollDown: PropTypes.func.isRequired, // passed in
  initialData: PropTypes.object,            // passed in, allows us to configure inputs to whats already given
  onDone: PropTypes.func.isRequired,        // passed in
  skippable: PropTypes.bool,                // passed in
  skipEndpoint: PropTypes.string,           // passed in
  texts: PropTypes.array,        // passed in, text to say
  /*
    texts = [
      { id: 'parentID-textID', scrollDown: true, delay: 500, text: 'Some string to display', component: (<div>Example</div>), tooltips: [{ id: 'abc-123', tooltip: (<div>Click this for further info</div>) }] }
    ]
  */
  segmentStyles: PropTypes.object,          // passed in, style of container
  schema: PropTypes.object.isRequired,      // passed in, schema for the internal data. Whats my id? Where to go next?
  /*
    schema.id = 'abc'
    schema.endpoint = 'xyz'
    schema.choices = [
      { id: 'parentID-choiceID', text: 'Something to show', endpoint: 'targetID'  }
    ]
  */

  // UNIQUE PROPS FOR COMPONENT
  mapOptions: PropTypes.object,
}

// for all optional props, define a default value
MapSegment.defaultProps = {
  title: '',
  texts: [],
  initialData: {},
  segmentStyles: {},
  skippable: false,
  skipEndpoint: '',
  mapOptions: {},   // see google maps options
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MapSegment)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    instant_chars_segment_id: redux.app.instant_chars_segment_id,
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
      padding: '50px 0px 0px 0px',
      minHeight: document.documentElement.clientHeight,
		},
    text: {
      background: INPUT_BACKGROUND,
      border: 'none',
      display: 'flex',
      outline: 'none',
      width: '100%',
      fontSize: '1.2rem',
      height: '30px',
      borderRadius: '10px',
      padding: '20px',
      color: FONT_COLOR,
      webkitBoxShadow: '0 2px 10px 1px rgba(0,0,0,0)',
      boxShadow: '0 2px 10px 1px rgba(0,0,0,0)',
      "::placeholder": {
        color: INPUT_PLACEHOLDER_COLOR,
      },
      "::-webkit-input-placeholder": {
        color: INPUT_PLACEHOLDER_COLOR,
      }
    },
    skip: {
      padding: '5px',
      minWidth: '50px',
      border: `1px solid ${FONT_COLOR}`,
      borderRadius: '5px',
      fontSize: '0.8rem',
      color: FONT_COLOR,
      cursor: 'pointer',
      position: 'absolute',
      bottom: '20px',
      left: '0px',
      ":hover": {
        opacity: 0.5
      }
    },
		check: {
			color: FONT_COLOR,
			fontWeight: 'bold',
			cursor: 'pointer',
			margin: '15px 0px 0px 0px',
			position: 'absolute',
			bottom: '20px',
			right: '0px',
		}
	}
}
