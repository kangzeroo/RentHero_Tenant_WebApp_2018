// Compt for copying as a FilterPopup
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Divider,
	Button,
	Checkbox,
	Input,
} from 'antd'
import {
	Slider,
} from 'antd-mobile'
import { Card, Spin, Icon } from 'antd'
import CounterModule from '../modules/CounterModule'
import CheckboxsModule from '../modules/CheckboxsModule'
import MapModule from '../modules/MapModule'
import { updatePreferences } from '../../actions/prefs/prefs_actions'
import { saveTenantPreferences } from '../../api/prefs/prefs_api'
import { isMobile } from '../../api/general/general_api'
import {
	saveListingsToRedux,
} from '../../actions/listings/listings_actions'
import {
	getListings,
} from '../../api/listings/listings_api'


class FilterPopup extends Component {

  constructor() {
    super()
    this.state = {
      // loading: false,
      // searchable: false,
			loaded: false,
			saving: false,

			budget: 2000,
			bedrooms: 0.0,
			bathrooms: 0.0,

			entire_place: false,
			private_room: false,

			lease_length: 12,

			address: '',
			address_components: [],
			address_lat: '',
			address_lng: '',
			address_place_id: '',
    }
		this.original_filters = {
			budget: 2000,
			bedrooms: 0.0,
			bathrooms: 0.0,

			entire_place: false,
			private_room: false,

			lease_length: 12,

			address: '',
			address_components: [],
			address_lat: '',
			address_lng: '',
			address_place_id: '',
		}
  }

	componentWillMount() {
		this.refreshFilters()
	}

	refreshFilters() {
		this.setState({
			budget: this.props.prefs.FINANCIALS.IDEAL_PER_PERSON || 800,

			bedrooms: this.props.prefs.GROUP.CERTAIN_MEMBERS || 0,
			bathrooms: this.props.prefs.GROUP.BATHROOMS || 0,

			entire_place: this.props.prefs.GROUP.WHOLE_OR_RANDOMS_AS_SCHEMAS && this.props.prefs.GROUP.WHOLE_OR_RANDOMS_AS_SCHEMAS.length > 0 ? this.props.prefs.GROUP.WHOLE_OR_RANDOMS_AS_SCHEMAS.filter((item) => item.id === 'entire_place').length > 0 : false,
			private_room: this.props.prefs.GROUP.WHOLE_OR_RANDOMS_AS_SCHEMAS && this.props.prefs.GROUP.WHOLE_OR_RANDOMS_AS_SCHEMAS.length > 0 ? this.props.prefs.GROUP.WHOLE_OR_RANDOMS_AS_SCHEMAS.filter((item) => item.id === 'private_room').length > 0 : false,

			lease_length: this.props.prefs.MOVEIN.LEASE_LENGTH || 12,

			address_components: [],
			address_lat: this.props.prefs.LOCATION.DESTINATION_GEOPOINT.split(',')[0],
			address_lng: this.props.prefs.LOCATION.DESTINATION_GEOPOINT.split(',')[1],
			address_place_id: '',
			address: this.props.prefs.LOCATION.DESTINATION_ADDRESS,
		}, () => {
			this.original_filters = this.state
			console.log(this.original_filters)
			this.setState({
				loaded: true,
			})
		})
	}

  componentDidMount() {
		this.startAutocomplete()
    window.onpopstate = () => {
      history.pushState(null, null, `${this.props.location.pathname}`)
    }
  }

	startAutocomplete() {
    this.autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById(`address--module`)),
            {
              // types: ['address', 'establishment'],
              // bounds: new google.maps.LatLngBounds(
              //   new google.maps.LatLng(-80.671519, 43.522913),
              //   new google.maps.LatLng(-80.344067, 43.436979)
              // )
							componentRestrictions: {country: "ca"},
            }
          );
    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    this.autocomplete.addListener('place_changed', () => this.fillInAddress())
    if (this.state.address_lat && this.state.address_lng) {
      this.renderMap(parseFloat(this.state.address_lat), parseFloat(this.state.address_lng))
    }
  }

  fillInAddress() {
    const place = this.autocomplete.getPlace()
    this.setState({

      address_components: place.address_components,
      address_lat: place.geometry.location.lat().toFixed(7),
      address_lng: place.geometry.location.lng().toFixed(7),
      address_place_id: place.place_id,
      address: place.formatted_address,

    }, () => {
			document.getElementById(`address--module`).blur()
			setTimeout(() => {
        this.renderMap(parseFloat(place.geometry.location.lat().toFixed(7)), parseFloat(place.geometry.location.lng().toFixed(7)))
			}, 500)
		})
  }

	shouldFiltersUpdate() {
		return this.state.budget !== this.original_filters.budget ||
					 this.state.bedrooms !== this.original_filters.bedrooms ||
					 this.state.bathrooms !== this.original_filters.bathrooms ||
					 this.state.entire_place !== this.original_filters.entire_place ||
					 this.state.private_room !== this.original_filters.private_room ||
					 this.state.lease_length !== this.original_filters.lease_length ||
					 this.state.address !== this.original_filters.address

	}

	updateFilters() {
		this.setState({
			saving: true,
		})
		let arrayOfPromises = []
		if (this.state.budget !== this.props.prefs.FINANCIALS.IDEAL_PER_PERSON) {
			arrayOfPromises.push(this.completedBudget(this.state.budget))
		}
		if (this.state.bedrooms !== this.props.prefs.GROUP.CERTAIN_MEMBERS) {
			arrayOfPromises.push(this.completedBedrooms(this.state.bedrooms))
		}
		if (this.state.entire_place !== this.original_filters.entire_place || this.state.private_room !== this.original_filters.private_room) {
			let selected_choices = []
			if (this.state.entire_place) {
				selected_choices.push({
					id: 'entire_place',
					text: 'ENTIRE PLACE',
					value: false,
				})
			}
			if (this.state.private_room) {
				selected_choices.push({
					id: 'private_room',
					text: 'PRIVATE ROOM',
					value: false,
				})
			}
			if (this.state.entire_place && this.state.private_room) {
				selected_choices.push({
					id: 'show_both',
					text: 'SHOW BOTH',
					value: false,
				})
			}
			arrayOfPromises.push(this.completedRoomOrEntirePlace(selected_choices))
		}
		if (this.state.lease_length !== this.props.prefs.MOVEIN.LEASE_LENGTH) {
			arrayOfPromises.push(this.completedLeaseLength(this.state.lease_length))
		}
		if (this.state.address !== this.props.prefs.LOCATION.DESTINATION_ADDRESS) {
			arrayOfPromises.push(this.completedMainDestination(this.state))
		}

		console.log('ARRAY OF PROMISES: ', arrayOfPromises)
		Promise.all(arrayOfPromises)
			.then((data) => {
				console.log(data)
				this.updateSearch()
				this.setState({
					saving: false,
				})
			})
			.catch((err) => {
				console.log(err)
				this.setState({
					saving: false,
				})
			})
	}

  completedBudget(budget) {
		const p = new Promise((res, rej) => {
			console.log('UPDATE BUDGET: ', budget)
			saveTenantPreferences({
				TENANT_ID: this.props.tenant_id,
				KEY: this.props.prefs.FINANCIALS.KEY,
				IDEAL_PER_PERSON: budget,
			}).then((FINANCIALS) => {
				this.props.updatePreferences(FINANCIALS)
				res()
			}).catch((err) => {
				console.log(err)
				rej(err)
			})
		})
		return p
  }

  completedBedrooms(bedrooms) {
		const p = new Promise((res, rej) => {
			console.log('UPDATE Bedrooms: ', bedrooms)
	    saveTenantPreferences({
	      TENANT_ID: this.props.tenant_id,
	      KEY: this.props.prefs.GROUP.KEY,
	      CERTAIN_MEMBERS: bedrooms,
	    }).then((GROUP) => {
	      this.props.updatePreferences(GROUP)
	      res()
	    }).catch((err) => {
	      console.log(err)
				rej(err)
	    })
		})
		return p
  }

  completedBathrooms(data) {
	  const p = new Promise((res, rej) => {
			saveTenantPreferences({
	      TENANT_ID: this.props.tenant_id,
	      KEY: this.props.prefs.GROUP.KEY,
	      BATHROOMS: data.count,
	    }).then((GROUP) => {
	      this.props.updatePreferences(GROUP)
	      res()
	    }).catch((err) => {
	      console.log(err)
				rej(err)
	    })
		})
    return p
  }

  completedLeaseLength(lease_length) {
    const p = new Promise((res, rej) => {
			console.log('UPDATED LEASE LENGTH: ', lease_length)
	    saveTenantPreferences({
	      TENANT_ID: this.props.tenant_id,
	      KEY: this.props.prefs.MOVEIN.KEY,
	      LEASE_LENGTH: lease_length,
	    }).then((MOVEIN) => {
	      this.props.updatePreferences(MOVEIN)
	      res()
	    }).catch((err) => {
	      console.log(err)
				rej(err)
	    })
		})
		return p
  }

  completedMainDestination(data) {
    const p = new Promise((res, rej) => {
			console.log('UPDATED MAIN DEST: ', data)
	    saveTenantPreferences({
	      TENANT_ID: this.props.tenant_id,
	      KEY: this.props.prefs.LOCATION.KEY,
	      DESTINATION_ADDRESS: data.address,
	      DESTINATION_GEOPOINT: `${data.address_lat},${data.address_lng}`
	    }).then((LOCATION) => {
	      console.log(LOCATION)
	      this.props.updatePreferences(LOCATION)
	      res()
	    }).catch((err) => {
	      console.log(err)
				rej(err)
	    })
		})
		return p
  }

  completedRoomOrEntirePlace(selected_choices) {
    const p = new Promise((res, rej) => {
			saveTenantPreferences({
	      TENANT_ID: this.props.tenant_id,
	      KEY: this.props.prefs.GROUP.KEY,
	      WHOLE_OR_RANDOM_AS: selected_choices.map(s => s.text).join(', '),
	      WHOLE_OR_RANDOMS_AS_SCHEMAS: selected_choices.map(s => {
	        return {
	          id: s.id,
	          text: s.text,
	          value: s.value
	        }
	      }),
	    }).then((GROUP) => {
	      this.props.updatePreferences(GROUP)
	      res()
	    }).catch((err) => {
	      console.log(err)
				rej(err)
	    })
		})
		return p
  }

	updateSearch() {
		getListings(this.props.prefs)
			.then((data) => {
				this.props.saveListingsToRedux(data)
				this.props.onComplete()
			})
			.catch((err) => {
				console.log(err)
			})
	}

	renderStickyHeader() {
		if (isMobile()) {
			return (
				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'fixed', top: 0, left: 0, zIndex: 150, width: '100%', background: 'rgba(256,256,256,0.9)', padding: '10px', borderBottom: 'lightgray solid thin' }}>
					<Icon type='close' onClick={() => this.props.onBack()} size='large' style={{ cursor: 'pointer', fontSize: '1.2rem' }} />
					<div style={{ cursor: 'pointer', color: '#2faded', fontWeight: 'bold' }} onClick={() => this.refreshFilters()}>Clear</div>
				</div>
			)
		} else {
			return (
				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'fixed', top: 0, left: 0, zIndex: 150, width: '40%', background: 'rgba(256,256,256,0.9)', padding: '10px', borderBottom: 'lightgray solid thin' }}>
					<Icon type='close' onClick={() => this.props.onBack()} size='large' style={{ cursor: 'pointer', fontSize: '1.2rem' }} />
					<div style={{ cursor: 'pointer', color: '#2faded', fontWeight: 'bold' }} onClick={() => this.refreshFilters()}>Clear</div>
				</div>
			)
		}
	}

	// <CounterModule
	// 	onComplete={(data) => this.completedBedrooms(data)}
	// 	incrementerOptions={{
	// 		max: 6,
	// 		min: 0.5,
	// 		step: 0.5,
	// 		default: 1,
	// 	}}
	// 	renderCountValue={(count) => {
	// 		if (count > 5) {
	// 			return `5+`
	// 		} else if (count === 0.5) {
	// 			return `shared`
	// 		} else {
	// 			return `${count.toFixed(1)}`
	// 		}
	// 	}}
	// 	initialData={{
	// 		count: this.props.prefs.GROUP.CERTAIN_MEMBERS || 1
	// 	}}
	// />
	// <CounterModule
	// 	onComplete={(data) => this.completedBathrooms(data)}
	// 	incrementerOptions={{
	// 		max: 5,
	// 		min: 0,
	// 		step: 0.5,
	// 		default: 1,
	// 	}}
	// 	renderCountValue={(count) => {
	// 		if (count > 4) {
	// 			return `4+`
	// 		} else {
	// 			return `${count.toFixed(1)}`
	// 		}
	// 	}}
	// 	initialData={{
	// 		count: this.props.prefs.GROUP.BATHROOMS || 1
	// 	}}
	// />

	renderPriceRange() {
		return (
			<div style={comStyles().sectionContainer}>
				<h2>Price Range Per Person</h2>
				<p style={{ textAlign: 'left', }}>The average price per person per month is $2000</p>
				<br />
				<div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
					<Slider
						style={isMobile() ? { width: '250px', } : { width: '30vw', }}
						value={this.state.budget}
						min={300}
						max={3500}
						onChange={e => this.setState({ budget: e, })}
						onAfterChange={e => console.log(e)}
					/>
				</div>
				<br /><br />
				<div style={{ textAlign: 'center', width: '100%' }}>
					<h2>{`$${this.state.budget} per person`}</h2>
				</div>
			</div>
		)
	}

	renderRooms() {
		return (
			<div style={comStyles().sectionContainer}>
				<h2>Rooms</h2>
				<br />
				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
					<div style={{ fontSize: '1.2rem', color: 'black' }}>Bedrooms</div>
					<div  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
						<Button type='ghost' shape='circle' onClick={() => this.setState({ bedrooms: this.state.bedrooms - 1.0})} icon='minus' disabled={this.state.bedrooms === 0} />
						<div style={{ fontSize: '1.2rem', margin: '0px 15px' }}>{this.state.bedrooms}</div>
						<Button type='ghost' shape='circle' onClick={() => this.setState({ bedrooms: this.state.bedrooms + 1.0})} icon='plus' disabled={this.state.bedrooms >= 10} />
					</div>
				</div>
				<br />
				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
					<div style={{ fontSize: '1.2rem', color: 'black' }}>Bathrooms</div>
					<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
						<Button type='ghost' shape='circle' onClick={() => this.setState({ bathrooms: this.state.bathrooms - 0.5 })} icon='minus' disabled={this.state.bathrooms === 0} />
						<div style={{ fontSize: '1.2rem', margin: '0px 15px' }}>{this.state.bathrooms}</div>
						<Button type='ghost' shape='circle' onClick={() => this.setState({ bathrooms: this.state.bathrooms + 0.5 })} icon='plus' disabled={this.state.bathrooms === 10} />
					</div>
				</div>
			</div>
		)
	}

	renderHomeType() {
		// <CheckboxsModule
		// 	onComplete={(data) => this.completedRoomOrEntirePlace(data)}
		// 	choices={[
		// 		{ id: 'entire_place', text: 'Only Entire Place', value: false, tooltip: (<p>Just your group, no unknown roommates.</p>) },
		// 		{ id: 'only_roommates_no_entire_place', text: 'Only Partial Places', value: false, tooltip: (<p>Possibily live with new random roommates in exchange for cheaper rent.</p>) },
		// 		{ id: 'show_both', text: 'Show Both', value: false },
		// 	]}
		// 	preselected={this.props.prefs.GROUP.WHOLE_OR_RANDOMS_AS_SCHEMAS}
		// />
		return (
			<div style={comStyles().sectionContainer}>
				<h2>Home type</h2>
				<br />
				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
					<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', width: '75%' }}>
						<div style={{ fontSize: '1.2rem', color: 'black' }}>Entire place</div>
						<p>Just your group, no unknown roommates</p>
					</div>
					<Checkbox
						id='only_want_entire_place'
						checked={this.state.entire_place}
						onChange={e => this.setState({ entire_place: !this.state.entire_place })}
						style={{ fontSize: '1.2rem' }}
						size='large'
					/>
				</div>
				<br />
				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
					<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', width: '75%' }}>
						<div style={{ fontSize: '1.2rem', color: 'black' }}>Private room</div>
						<p>Possibily share common spaces with new random roommates in exchange for cheaper rent</p>
					</div>
					<Checkbox
						id='only_roommates_no_entire_place'
						checked={this.state.private_room}
						onChange={e => this.setState({ private_room: !this.state.private_room, })}
						style={{ fontSize: '1.2rem' }}
						size='large'
					/>
				</div>

			</div>
		)
	}

	renderLeaseLength() {
		// <CounterModule
		// 	onComplete={(data) => this.completedLeaseLength(data)}
		// 	incrementerOptions={{
		// 		max: 19,
		// 		min: 1,
		// 		step: 1,
		// 		default: 12
		// 	}}
		// 	renderCountValue={(c) => {
		// 		if (c == 1) {
		// 			return 'monthly'
		// 		} else if (c > 18) {
		// 			return 'multi-year'
		// 		} else if (c == 12) {
		// 			return '1 year'
		// 		} else {
		// 			return (<span style={{ fontSize: '1.5rem' }}>{`${c} months`}</span>)
		// 		}
		// 	}}
		// 	initialData={{
		// 		count: this.props.prefs.MOVEIN.LEASE_LENGTH
		// 	}}
		// />
		return (
			<div style={comStyles().sectionContainer}>
				<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
					<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', width: '100%' }}>
						<div style={{ fontSize: '1.2rem', color: 'black' }}>Lease length</div>
						<p>Most common lease lengths are usually 6 months, 12 months, and multiples. </p>
					</div>
					<br />
					<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
						<Button type='ghost' shape='circle' onClick={() => this.setState({ lease_length: this.state.lease_length - 1 })} icon='minus' disabled={this.state.lease_length === 0} />
						<div style={{ fontSize: '1.2rem', margin: '0px 15px', color: 'black' }}>{`${this.state.lease_length} months`}</div>
						<Button type='ghost' shape='circle' onClick={() => this.setState({ lease_length: this.state.lease_length + 1 })} icon='plus' disabled={this.state.lease_length === 10} />
					</div>
				</div>
			</div>
		)
	}

	renderMainDest() {
		// <MapModule
		// 	onComplete={(data) => this.completedMainDestination(data)}
		// 	mapOptions={{ componentRestrictions: {} }}
		// 	initialData={{
		// 		address_components: [],
		// 		address_lat: this.props.prefs.LOCATION.DESTINATION_GEOPOINT.split(',')[0],
		// 		address_lng: this.props.prefs.LOCATION.DESTINATION_GEOPOINT.split(',')[1],
		// 		address_place_id: '',
		// 		address: this.props.prefs.LOCATION.DESTINATION_ADDRESS,
		// 	}}
		// />
		const focusedInput = (id) => {
		    if (this.mobile) {
		      document.getElementById(id).scrollIntoView({ behavior: "smooth", block: "center" })
		    }
		  }
		return (
			<div style={comStyles().sectionContainer}>
				<h2>Main Destination</h2>
				<p style={{ textAlign: 'left' }}>Where do you travel to the most often? This can be the location of work or school.</p>
				<p style={{ textAlign: 'left' }}>RentHero will search for places closest to your most commonly travelled location.</p>
				<br />
				<Input
					id='address--module'
					value={this.state.address}
					onChange={e => this.setState({ address: e.target.value })}
					placeholder='Main Destination'
					onFocus={() => focusedInput(`address--module`)}
					size='large'
				/>
				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', }}>
					<div />
					<div style={{ color: '#2faded', cursor: 'pointer', }} onClick={() => this.setState({ address: '', })}>Clear</div>
				</div>
				<br />
				<div id={`map--module`} style={{ height: '100px', width: '100%', borderRadius: '10px' }}></div>
			</div>
		)
	}

	renderMap(lat, lng) {
		console.log('RENDER MAP: ', lat, lng)
		document.getElementById(`map--module`).style.height = '250px'
		const coords = { lat, lng }
		const map = new google.maps.Map(document.getElementById(`map--module`), {
			center: coords,
			zoom: 13,
			disableDefaultUI: true,
		})
		const marker = new google.maps.Marker({position: coords, map: map})
		// document.getElementById(`map--${this.props.schema.id}`).scrollIntoView({ behavior: "smooth", block: "top" })
	}

	renderStickyFooter() {
		if (isMobile()) {
			return (
				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'fixed', bottom: 0, left: 0, zIndex: 150, width: '100%', background: 'rgba(256,256,256,0.9)', padding: '15px', borderTop: 'lightgray solid thin' }}>
					<Button type='primary' size='large' onClick={() => this.updateFilters()} style={{ width: '80%', }} disabled={!this.shouldFiltersUpdate() || !this.state.loaded || this.state.saving} loading={this.state.saving || !this.state.loaded}>
						Update Search
					</Button>
				</div>
			)
		} else {
			return (
				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'fixed', bottom: 0, left: 0, zIndex: 150, width: '40%', background: 'rgba(256,256,256,0.9)', padding: '15px', borderTop: 'lightgray solid thin' }}>
					<Button type='primary' size='large' onClick={() => this.updateFilters()} style={{ width: '80%', }} disabled={!this.shouldFiltersUpdate() || !this.state.loaded || this.state.saving} loading={this.state.saving || !this.state.loaded}>
						Update Search
					</Button>
				</div>
			)
		}
	}

	render() {
		return (
			<div id='FilterPopup' style={comStyles().container}>
        {
					this.renderStickyHeader()
				}
				<div style={{ height: '7vh', }} />
        	{
						this.renderPriceRange()
					}
				<Divider />
      		{
						this.renderRooms()
					}
        <Divider />
        	{
						this.renderHomeType()
					}
        <Divider />
        {
					this.renderLeaseLength()
				}
        <Divider />
      	{
					this.renderMainDest()
				}
        <div style={{ width: '100%', height: '70px' }}></div>
				{
					this.renderStickyFooter()
				}
			</div>
		)
	}
}

// defines the types of variables in this.props
FilterPopup.propTypes = {
	history: PropTypes.object.isRequired,
  prefs: PropTypes.object.isRequired,
  updatePreferences: PropTypes.func.isRequired,
  tenant_id: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
  saveListingsToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
FilterPopup.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(FilterPopup)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    prefs: redux.prefs,
    tenant_id: redux.auth.tenant_profile.tenant_id,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    updatePreferences,
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
		},
    sectionContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '20px',
			width: '100%',
    }
	}
}
