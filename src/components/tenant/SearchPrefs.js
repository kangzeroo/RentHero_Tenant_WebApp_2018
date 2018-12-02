// Compt for copying as a SearchPrefs
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import $ from 'jquery'
import moment from 'moment'
import SubtitlesMachine from '../modules/SubtitlesMachine'
import { Calendar, DateRange } from 'react-date-range'
import {
	Icon,
	Slider,
	WhiteSpace,
	Checkbox,
} from 'antd-mobile'
import { savePrefs } from '../../actions/listings/listings_actions'
import { triggerDrawerNav } from '../../actions/app/app_actions'
import {
	saveListingsToRedux,
	saveNameToRedux,
} from '../../actions/listings/listings_actions'
import {
	getListings,
} from '../../api/listings/listings_api'


class SearchPrefs extends Component {

	constructor() {
		super()
		this.state = {
			show_up: true,
			show_down: true,
			listeners: [],
			completed: [],
			instantChars: true,

      people: 1,
      max_budget_person: 700,
      commute_mode: '',

      destination_address_components: [],
      destination_address_lat: 0,                // the ad lat according to google
      destination_address_lng: 0,               // the ad lng according to google
      destination_address_place_id: '',          // the ad place_id according to google
      destination_address: '',					  // the ad_address typed in

			date: new Date(),
			dateRange: {
        selection: {
          startDate: new Date(),
          endDate: null,
          key: 'selection',
        },
      },
		}
	}

  componentDidMount() {
    this.setState({
      people: this.props.prefs.max_beds,
      max_budget_person: this.props.prefs.max_budget,
      commute_mode: this.props.prefs.destination.commute_mode,
      destination_address: this.props.prefs.destination.address,
      destination_address_lat: this.props.prefs.destination.gps.lat,
      destination_address_lng: this.props.prefs.destination.gps.lng,
      destination_address_place_id: this.props.prefs.destination.place_id,
    })
  }

	componentDidUpdate(prevProps, prevState) {
    if (prevProps.prefs.max_beds !== this.props.prefs.max_beds || prevProps.prefs.max_budget_person !== this.props.prefs.max_budget_person || prevProps.commute_mode !== this.props.commute_mode || prevProps.prefs.destination_address !== this.props.prefs.destination_address) {
      this.setState({
        people: this.props.prefs.max_beds,
        max_budget_person: this.props.prefs.max_budget,
	      commute_mode: this.props.prefs.destination.commute_mode,
        destination_address: this.props.prefs.destination.address,
        destination_address_lat: this.props.prefs.destination.gps.lat,
        destination_address_lng: this.props.prefs.destination.gps.lng,
        destination_address_place_id: this.props.prefs.destination.place_id,
      })
    }
	}

	// trigger instant load text from <SubtitleMachine>
	instantCharClick() {
		this.setState({
			instantChars: true
		})
		setTimeout(() => {
			this.setState({
				instantChars: false
			})
		}, 50)
	}

	// pass in the id of the next div to scroll down to, add the id of the section we just finished, and blur any current input with id inputDiv
	clickedCheck(nextDiv, justFinished, inputDiv, timeout = 0) {
		if (inputDiv && document.getElementById(inputDiv)) {
			document.getElementById(inputDiv).blur()
		}
		setTimeout(() => {
			this.setState({ completed: this.state.completed.concat([justFinished]) }, () => {
				history.pushState(null, null, `${this.props.location.pathname}${nextDiv}`)
        console.log(nextDiv)
        console.log(nextDiv.slice(1, nextDiv.length))
				document.getElementById(nextDiv.slice(1, nextDiv.length)).scrollIntoView()
        this.submitPrefs()
			})
		}, timeout)
	}


  	incrementCounter(attr, inc) {
      if (this.state[attr] + inc >= 0) {
        this.setState({
          [attr]: this.state[attr] + inc
        })
      }
    }

  	startAutocomplete() {
      this.autocomplete = new google.maps.places.Autocomplete(
              /** @type {!HTMLInputElement} */(document.getElementById('destination_address')),
              {
                // types: ['address', 'establishment'],
                // bounds: new google.maps.LatLngBounds(
                //   new google.maps.LatLng(-80.671519, 43.522913),
                //   new google.maps.LatLng(-80.344067, 43.436979)
                // )
  							componentRestrictions: {country: "ca"}
              }
            );
      // When the user selects an address from the dropdown, populate the address
      // fields in the form.
      this.autocomplete.addListener('place_changed', this.fillInAddress.bind(this))
    }

    fillInAddress() {
      const place = this.autocomplete.getPlace()
      this.setState({
        destination_address_components: place.address_components,
        destination_address_lat: place.geometry.location.lat().toFixed(7),
        destination_address_lng: place.geometry.location.lng().toFixed(7),
        destination_address_place_id: place.place_id,
        destination_address: place.formatted_address,
      }, () => {
  			document.getElementById('destination_address').blur()
				const destination_coords = { lat: parseFloat(place.geometry.location.lat().toFixed(7)), lng: parseFloat(place.geometry.location.lng().toFixed(7)) }
				const map = new google.maps.Map(document.getElementById('destination-map'), {
					center: destination_coords,
					zoom: 13,
					disableDefaultUI: true,
				})
				const marker = new google.maps.Marker({position: destination_coords, map: map})
  		})
    }

  	submitPrefs() {
      this.props.savePrefs({
        max_beds: this.state.people,
        max_budget: this.state.max_budget_person,
        destination: {
          address: this.state.destination_address,
          place_id: this.state.destination_address_place_id,
          commute_mode: this.state.commute_mode,
          gps: { lat: this.state.destination_address_lat, lng: this.state.destination_address_lng }
        }
      })
      getListings({
        max_beds: this.state.people,
        max_budget: this.state.max_budget_person,
        destination: {
          address: this.state.destination_address,
          place_id: this.state.destination_address_place_id,
          commute_mode: this.state.commute_mode,
          gps: { lat: this.state.destination_address_lat, lng: this.state.destination_address_lng }
        }
      })
      .then((data) => {
  			if (data && data.length > 0) {
  				console.log(data)
  				this.props.saveListingsToRedux(data)
  			} else {
  				// this.props.history.push('/noresults')
  			}
      })
      .catch((err) => {
        console.log(err)
      })
    }

	render() {
		return (
			<div id='SearchPrefs' style={comStyles().container}>
        <div onClick={() => this.instantCharClick()} style={comStyles().scroll}>
					<div onClick={() => this.props.triggerDrawerNav(true)} style={{ position: 'fixed', top: '20px', left: '20px', zIndex: '4', color: 'white' }}>
						<Icon type='ellipsis' size='lg' />
					</div>
					{/*<div style={comStyles().up_part}>
						{
							this.state.show_up
							?
							<Icon type='up' size='lg' style={comStyles().up} />
							:
							null
						}
					</div>*/}
					<div id='middle_part' style={comStyles().middle_part}>
            <div id='intro_reminder' style={comStyles().sectional}>
              <SubtitlesMachine
                  instant={this.state.instantChars}
                  speed={0.25}
                  delay={this.state.instantChars ? 0 : 800}
                  text={`Hello ${this.props.name.split(' ')[0].charAt(0).toUpperCase() + this.props.name.split(' ')[0].slice(1)}. Feel free to change your search options.`}
                  textStyles={{
                    fontSize: '1.1rem',
                    color: 'white',
                    textAlign: 'left',
                  }}
                  containerStyles={{
                    width: '100%',
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderRadius: '20px',
                  }}
                  doneEvent={() => {
                    setTimeout(() => {
                      this.setState({ completed: this.state.completed.concat(['intro_reminder']) })
                    }, 300)
                  }}
                />
                {
                  this.state.completed.filter(c => c === 'intro_reminder').length > 0
                  ?
                  <div style={travelStyles().listDiv}>
                    <div onClick={() => document.getElementById('ask_destination').scrollIntoView()} style={travelStyles().regular}>DAILY DESTINATION</div>
                    <div onClick={() => document.getElementById('asked_commute_mode').scrollIntoView()} style={travelStyles().regular}>TRAVEL MODE</div>
                    <div onClick={() => document.getElementById('ask_group_size').scrollIntoView()} style={travelStyles().regular}>GROUP SIZE</div>
                    <div onClick={() => document.getElementById('ask_budget_per_person').scrollIntoView()} style={travelStyles().regular}>BUDGET</div>
                    <div onClick={() => document.getElementById('ideal_movein').scrollIntoView()} style={travelStyles().regular}>MOVE IN</div>
                  </div>
                  :
                  null
                }
              </div>
              {
                this.state.completed.filter(c => c === 'intro_reminder').length > 0
                ?
                <div id='ask_destination' style={comStyles().sectional}>
                  <SubtitlesMachine
                      instant={this.state.instantChars}
                      speed={0.25}
                      delay={this.state.instantChars ? 0 : 800}
                      text={`Where do you most frequently commute to?`}
                      textStyles={{
                        fontSize: '1.1rem',
                        color: 'white',
                        textAlign: 'left',
                      }}
                      containerStyles={{
                        width: '100%',
                        backgroundColor: 'rgba(0,0,0,0)',
                        borderRadius: '20px',
                      }}
                      doneEvent={() => {
                        setTimeout(() => {
                          this.setState({ completed: this.state.completed.concat(['ask_destination']) })
                          this.startAutocomplete()
                        }, 300)
                      }}
                    />
                    {
                      this.state.completed.filter(c => c === 'ask_destination').length > 0
                      ?
                      <div style={comStyles().field_holder}>
                        <input
                          id="destination_address"
                          value={this.state.destination_address}
                          onChange={(e) => {
                            console.log(e.target.value)
                            this.setState({ destination_address: e.target.value })
                          }}
                          placeholder="Enter Location"
                          style={inputStyles().text}
                        ></input>
                        <div id='destination-map' style={{ height: '250px', borderRadius: '10px', margin: '10px 0px 0px 0px' }}></div>
                        {
                          this.state.destination_address_place_id
                          ?
                          <Icon onClick={() => this.clickedCheck('#asked_commute_mode', 'gave_destination', 'destination_address')} type='check-circle' size='lg' style={comStyles().check} />
                          :
                          null
                        }
                      </div>
                      :
                      null
                    }
                </div>
                :
                null
              }
              {
                this.state.completed.filter(c => c === 'intro_reminder').length > 0
                ?
                <div id='asked_commute_mode' style={comStyles().sectional}>
                  <SubtitlesMachine
                      instant={this.state.instantChars}
                      speed={0.25}
                      delay={this.state.instantChars ? 0 : 800}
                      text={`What is your primary means of transportation?`}
                      textStyles={{
                        fontSize: '1.1rem',
                        color: 'white',
                        textAlign: 'left',
                      }}
                      containerStyles={{
                        width: '100%',
                        backgroundColor: 'rgba(0,0,0,0)',
                        borderRadius: '20px',
                      }}
                      doneEvent={() => {
                        setTimeout(() => {
                          this.setState({ completed: this.state.completed.concat(['asked_commute_mode']) })
                        }, 300)
                      }}
                    />
                    {
                      this.state.completed.filter(c => c === 'asked_commute_mode').length > 0
                      ?
                      <div style={comStyles().field_holder}>
                        <div style={travelStyles().listDiv}>
                          <div onClick={() => this.setState({ commute_mode: 'driving' })} style={travelStyles(this.state.commute_mode).driving}>DRIVING</div>
                          <div onClick={() => this.setState({ commute_mode: 'transit' })} style={travelStyles(this.state.commute_mode).transit}>TRANSIT</div>
                          <div onClick={() => this.setState({ commute_mode: 'bicycling' })} style={travelStyles(this.state.commute_mode).bicycling}>BICYCLING</div>
                          <div onClick={() => this.setState({ commute_mode: 'walking' })} style={travelStyles(this.state.commute_mode).walking}>WALKING</div>
                        </div>
                        {
                          this.state.commute_mode
                          ?
                          <Icon onClick={() => this.clickedCheck('#ask_group_size', 'gave_commute_mode')} type='check-circle' size='lg' style={comStyles().check} />
                          :
                          null
                        }
                      </div>
                      :
                      null
                    }
                </div>
                :
                null
              }
              {
                this.state.completed.filter(c => c === 'intro_reminder').length > 0
                ?
                <div id='ask_group_size' style={comStyles().sectional}>
                  <SubtitlesMachine
                      instant={this.state.instantChars}
                      speed={0.25}
                      delay={this.state.instantChars ? 0 : 800}
                      text={`How many people are in your group? It's ok if this changes.`}
                      textStyles={{
                        fontSize: '1.1rem',
                        color: 'white',
                        textAlign: 'left',
                      }}
                      containerStyles={{
                        width: '100%',
                        backgroundColor: 'rgba(0,0,0,0)',
                        borderRadius: '20px',
                      }}
                      doneEvent={() => {
                        setTimeout(() => {
                          this.setState({ completed: this.state.completed.concat(['ask_group_size']) })
                        }, 300)
                      }}
                    />
                    {
                      this.state.completed.filter(c => c === 'ask_group_size').length > 0
                      ?
                      <div style={comStyles().field_holder}>
                        <div style={inputStyles().counterDiv}>
                          <div onClick={() => this.incrementCounter('people', -1)} style={{ fontSize: '3rem', color: 'white', fontWeight: 'bold' }}>-</div>
                          <div style={{ fontSize: '3rem', color: 'white', fontWeight: 'bold' }}>{this.state.people}</div>
                          <div onClick={() => this.incrementCounter('people', 1)} style={{ fontSize: '3rem', color: 'white', fontWeight: 'bold' }}>+</div>
                        </div>
                        <Icon onClick={() => this.clickedCheck('#ask_budget_per_person', 'gave_group_size')} type='check-circle' size='lg' style={comStyles().check} />
                      </div>
                      :
                      null
                    }
                </div>
                :
                null
              }
              {
                this.state.completed.filter(c => c === 'intro_reminder').length > 0
                ?
                <div id='ask_budget_per_person' style={comStyles().sectional}>
                  <SubtitlesMachine
                      instant={this.state.instantChars}
                      speed={0.25}
                      delay={this.state.instantChars ? 0 : 800}
                      text={`And what's your max budget per person?`}
                      textStyles={{
                        fontSize: '1.1rem',
                        color: 'white',
                        textAlign: 'left',
                      }}
                      containerStyles={{
                        width: '100%',
                        backgroundColor: 'rgba(0,0,0,0)',
                        borderRadius: '20px',
                      }}
                      doneEvent={() => {
                        setTimeout(() => {
                          this.setState({ completed: this.state.completed.concat(['ask_budget_per_person']) })
                        }, 300)
                      }}
                    />
                    {
                      this.state.completed.filter(c => c === 'ask_budget_per_person').length > 0
                      ?
                      <div style={comStyles().field_holder}>
                        <div style={inputStyles().counterDiv}>
                          <div onClick={() => this.incrementCounter('max_budget_person', -25)} style={{ fontSize: '3rem', color: 'white', fontWeight: 'bold' }}>-</div>
                          <div style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>${this.state.max_budget_person}</div>
                          <div onClick={() => this.incrementCounter('max_budget_person', 25)} style={{ fontSize: '3rem', color: 'white', fontWeight: 'bold' }}>+</div>
                        </div>
                        <WhiteSpace size="lg" />
                        <Slider
                          style={{ }}
                          defaultValue={1800}
                          min={300}
                          max={2500}
                          step={25}
                          value={this.state.max_budget_person}
                          onChange={(v) => this.setState({ max_budget_person: v })}
                        />
                        <Icon onClick={() => {
                          this.clickedCheck('#ideal_movein', 'gave_budget_per_person')}
                        } type='check-circle' size='lg' style={comStyles().check} />
                      </div>
                      :
                      null
                    }
                </div>
                :
                null
              }

              {
  							this.state.completed.filter(c => c === 'intro_reminder').length > 0
  							?
  							<div id='ideal_movein' style={comStyles().sectional}>
  								<SubtitlesMachine
  										instant={this.state.instantChars}
  										speed={0.25}
  										delay={this.state.instantChars ? 0 : 500}
  										text={`When is your ideal move-in date? 🏆`}
  										textStyles={{
  											fontSize: '1.1rem',
  											color: 'white',
  											textAlign: 'left',
  										}}
  										containerStyles={{
  											width: '100%',
  											backgroundColor: 'rgba(0,0,0,0)',
  											borderRadius: '20px',
  										}}
  										doneEvent={() => {
  											console.log('DONE')
  											setTimeout(() => {
  												this.setState({ completed: this.state.completed.concat(['ideal_movein']) })
  											}, 500)
  										}}
  									/>
  								{
  									// this.state.completed.filter(c => c === 'ideal_movein').length > 0
  									true
  									?
  									<div id='ideal_movein_date' style={{ ...comStyles().field_holder, width: 'auto', padding: '60px 0px 0px 0px' }}>
  										{
  											moment(this.state.date).diff(moment(), 'hours') > 0
  											?
  											<Icon onClick={() => this.clickedCheck('#acceptable_movein_range', 'ideal_movein_date')} type='check-circle' size='lg' style={comStyles().top_check} />
  											:
  											null
  										}
  										<Calendar
  											date={this.state.date}
  											showMonthArrow={false}
  											minDate={new Date()}
  											scroll={{enabled: true}}
  											onChange={date => this.setState({ date }, () => console.log(this.state))}
  										/>
  										{
  											moment(this.state.date).diff(moment(), 'hours') < 0
  											?
  											Toast.fail('Move-in date cannot be in the past', 2)
  											:
  											null
  										}
  									</div>
  									:
  									null
  								}
  							</div>
  							:
  							null
  						}
              {
  							this.state.completed.filter(c => c === 'intro_reminder').length > 0
  							?
  							<div id='acceptable_movein_range' style={comStyles().sectional}>
  								<SubtitlesMachine
  										instant={this.state.instantChars}
  										speed={0.25}
  										delay={this.state.instantChars ? 0 : 800}
  										text={`🤔 Flexible move-in dates gives you more options 😏 What's your range?`}
  										textStyles={{
  											fontSize: '1.1rem',
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
  												this.setState({ completed: this.state.completed.concat(['acceptable_movein_range']) })
  											}, 1000)
  										}}
  									/>
  									{
  										// this.state.completed.filter(c => c === 'acceptable_movein_range').length > 0
  										true
  										?
  										<div id='chosen_movein_range' style={{ ...comStyles().field_holder, width: 'auto', padding: '60px 0px 0px 0px' }}>
  											{
  												// moment(this.state.date).diff(moment(), 'hours') > 0
  												true
  												?
  												<Icon onClick={() => this.clickedCheck('#done1', 'chosen_movein_range')} type='check-circle' size='lg' style={comStyles().top_check} />
  												:
  												null
  											}
  											<DateRange
  												minDate={new Date()}
  												showMonthArrow={false}
  												scroll={{enabled: true}}
  												onChange={(selection) => this.setState({ dateRange: selection })}
  												moveRangeOnFirstSelection={false}
  												ranges={[this.state.dateRange.selection]}
  												className={'PreviewArea'}
  											/>
  											{/*
  												moment(this.state.date).diff(moment(), 'hours') < 0
  												?
  												Toast.fail('Move-in date cannot be in the past', 2)
  												:
  												null
  											*/}
  										</div>
  										:
  										null
  									}
  							</div>
  							:
  							null
  						}
              {
                this.state.completed.filter(c => c === 'intro_reminder').length > 0
                ?
                <div id='done1' onClick={() => this.props.history.push('/matches')} style={inputStyles().button}>
                  VIEW MATCHES
                </div>
                :
                null
              }
					</div>
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
SearchPrefs.propTypes = {
	history: PropTypes.object.isRequired,
  name: PropTypes.string,
  savePrefs: PropTypes.func.isRequired,
  saveListingsToRedux: PropTypes.func.isRequired,
	saveNameToRedux: PropTypes.func.isRequired,
  card_section_shown: PropTypes.string.isRequired,
  prefs: PropTypes.object.isRequired,
	triggerDrawerNav: PropTypes.func.isRequired,
}

// for all optional props, define a default value
SearchPrefs.defaultProps = {
  name: 'There',
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SearchPrefs)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    name: redux.tenant.name,
    prefs: redux.tenant.prefs,
    card_section_shown: redux.tenant.card_section_shown,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    savePrefs,
  	saveListingsToRedux,
  	saveNameToRedux,
    triggerDrawerNav,
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
      alignItems: 'center',
			background: '#00c6ff', /* fallback for old browsers */
		  background: '-webkit-linear-gradient(to right, #00c6ff, #0072ff)', /* Chrome 10-25, Safari 5.1-6 */
		  background: 'linear-gradient(to right, #00c6ff, #0072ff)' /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
		},
    scroll: {
      display: 'flex',
      flexDirection: 'column',
			position: 'fixed',
      minHeight: '90vh',
			bottom: '0px',
      width: '100%',
      maxWidth: '500px',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
		up_part: {
			position: 'fixed',
			top: '0px',
			height: '15vh',
			minHeight: '15vh',
			maxHeight: '15vh',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-end',
			alignItems: 'center',
		},
		middle_part: {
      // display: 'flex',
      flexDirection: 'column',
      height: '90vh',
      width: '100%',
      maxWidth: '500px',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      padding: '10px 0px 0px 0px',
			overflowY: 'scroll',
			padding: '20px 20px 20px 20px',
		},
		down_part: {
			position: 'fixed',
			bottom: '0px',
			height: '10vh',
			minHeight: '10vh',
			maxHeight: '10vh',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
		},
		up: {
			color: 'white',
			fontWeight: 'bold',
			cursor: 'pointer',
		},
		down: {
			color: 'white',
			fontWeight: 'bold',
			cursor: 'pointer',
		},
		sectional: {
			position: 'relative',
			height: 'auto',
			minHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
			padding: '20px 0px 0px 0px',
			width: '100%',
		},
		field_holder: {
			display: 'flex',
			flexDirection: 'column',
			width: '100%',
			position: 'relative',
			padding: '20px 0px 70px 0px'
		},
		check: {
			color: 'white',
			fontWeight: 'bold',
			cursor: 'pointer',
			margin: '15px 0px 0px 0px',
			position: 'absolute',
			bottom: '0px',
			right: '0px',
		},
		top_check: {
			color: 'white',
			fontWeight: 'bold',
			cursor: 'pointer',
			margin: '15px 0px 0px 0px',
			position: 'absolute',
			top: '0px',
			right: '0px',
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
      fontSize: '1.2rem',
      height: '30px',
      borderRadius: '10px',
      padding: '20px',
      color: '#ffffff',
      webkitBoxShadow: '0 2px 10px 1px rgba(0,0,0,0)',
      boxShadow: '0 2px 10px 1px rgba(0,0,0,0)',
    },
		counterDiv: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding: '30px'
    },
    button: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      color: 'white',
      border: '1px solid white',
      padding: '15px',
      width: '100%',
      borderRadius: '15px',
      textAlign: 'center',
      cursor: 'pointer',
      margin: '50px 0px 0px 0px'
    },
  }
}

const travelStyles = (mode) => {
	let listOptions = {
		padding: '10px',
		fontSize: '0.8rem',
		color: 'white',
		border: '1px solid white',
		borderRadius: '15px',
		margin: '10px',
		cursor: 'pointer',
		minWidth: '100px',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	}
	let driveStyles = {}
	let transitStyles = {}
	let bicycleStyles = {}
	let walkStyles = {}
	if (mode === 'driving') {
		driveStyles.color = '#009cff'
		driveStyles.backgroundColor = 'white'
	}
	if (mode === 'transit') {
		transitStyles.color = '#009cff'
		transitStyles.backgroundColor = 'white'
	}
	if (mode === 'bicycling') {
		bicycleStyles.color = '#009cff'
		bicycleStyles.backgroundColor = 'white'
	}
	if (mode === 'walking') {
		walkStyles.color = '#009cff'
		walkStyles.backgroundColor = 'white'
	}
	return {
		listDiv: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			flexWrap: 'wrap',
			width: '100%',
			padding: '30px'
		},
		driving: {
			...listOptions,
			...driveStyles,
		},
		transit: {
			...listOptions,
			...transitStyles,
		},
		bicycling: {
			...listOptions,
			...bicycleStyles,
		},
		walking: {
			...listOptions,
			...walkStyles
		},
    regular: {
      ...listOptions,
      minWidth: '150px'
    }
	}
}
