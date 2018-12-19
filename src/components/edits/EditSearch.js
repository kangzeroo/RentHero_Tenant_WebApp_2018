// Compt for copying as a EditSearch
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'antd-mobile'
import { Card, Spin, Icon } from 'antd'
import CounterModule from '../modules/CounterModule'
import CheckboxsModule from '../modules/CheckboxsModule'
import MapModule from '../modules/MapModule'
import { updatePreferences } from '../../actions/prefs/prefs_actions'
import { saveTenantPreferences } from '../../api/prefs/prefs_api'


class EditSearch extends Component {

  constructor() {
    super()
    this.state = {
      loading: false,
      searchable: false,
    }
  }

  componentDidMount() {
    window.onpopstate = () => {
      history.pushState(null, null, `${this.props.location.pathname}`)
    }
  }

  completedBudget(data) {
    this.setState({
      loading: true,
      searchable: true,
    })
    saveTenantPreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.FINANCIALS.KEY,
      IDEAL_PER_PERSON: data.count,
    }).then((FINANCIALS) => {
      this.props.updatePreferences(FINANCIALS)
      this.setState({
        loading: false,
        searchable: true
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  completedBedrooms(data) {
    this.setState({
      loading: true,
      searchable: true,
    })
    saveTenantPreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.GROUP.KEY,
      CERTAIN_MEMBERS: data.count,
    }).then((GROUP) => {
      this.props.updatePreferences(GROUP)
      this.setState({
        loading: false,
        searchable: true
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  completedBathrooms(data) {
    this.setState({
      loading: true,
      searchable: true,
    })
    saveTenantPreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.GROUP.KEY,
      BATHROOMS: data.count,
    }).then((GROUP) => {
      this.props.updatePreferences(GROUP)
      this.setState({
        loading: false,
        searchable: true
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  completedLeaseLength(data) {
    this.setState({
      loading: true,
      searchable: true,
    })
    saveTenantPreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.MOVEIN.KEY,
      LEASE_LENGTH: data.count,
    }).then((MOVEIN) => {
      this.props.updatePreferences(MOVEIN)
      this.setState({
        loading: false,
        searchable: true
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  completedMainDestination(data) {
    this.setState({
      loading: true,
      searchable: true,
    })
    saveTenantPreferences({
      TENANT_ID: this.props.tenant_id,
      KEY: this.props.prefs.LOCATION.KEY,
      DESTINATION_ADDRESS: data.address,
      DESTINATION_GEOPOINT: `${data.address_lat},${data.address_lng}`
    }).then((LOCATION) => {
      console.log(LOCATION)
      this.props.updatePreferences(LOCATION)
      this.setState({
        loading: false,
        searchable: true
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  updateSearch() {
    if (this.state.searchable && !this.state.loading) {
      alert('Updating!')
    }
  }

	render() {
		return (
			<div id='EditSearch' style={comStyles().container}>
        <div style={{ width: '100%', height: '50px' }}></div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', position: 'fixed', top: '0px', width: '100%', zIndex: 5, backgroundColor: 'white' }}>
          <Icon onClick={() => window.history.back()} type='left' size='lg' style={{ padding: '20px', fontSize: '1.2rem', width: '50px' }} />
          <div style={{ width: '80%', height: '100%', fontSize: '0.9rem', fontWeight: 'bold', textAlign: 'left' }}>Update Search</div>
        </div>
        <Card title="Budget Per Person" style={{ maxWidth: '400px', margin: '20px' }}>
          <CounterModule
            onComplete={(data) => this.completedBudget(data)}
            incrementerOptions={{
              max: 3000,
              min: 300,
              step: 25,
              default: 1000,
            }}
            slider
            sliderOptions={{
              min: 300,
              max: 3000,
              step: 50,
              vertical: false,
            }}
            renderCountValue={(count) => `$ ${count}`}
            initialData={{
              count: this.props.prefs.FINANCIALS.IDEAL_PER_PERSON || 500
            }}
          />
        </Card>
        <Card title="Bedrooms" style={{ maxWidth: '400px', margin: '20px' }}>
          <CounterModule
            onComplete={(data) => this.completedBedrooms(data)}
            incrementerOptions={{
              max: 6,
              min: 0.5,
              step: 0.5,
              default: 1,
            }}
            renderCountValue={(count) => {
              if (count > 5) {
                return `5+`
              } else if (count === 0.5) {
                return `shared`
              } else {
                return `${count.toFixed(1)}`
              }
            }}
            initialData={{
              count: this.props.prefs.GROUP.CERTAIN_MEMBERS || 1
            }}
          />
        </Card>
        <Card title="Bathrooms" style={{ maxWidth: '400px', margin: '20px' }}>
          <CounterModule
            onComplete={(data) => this.completedBathrooms(data)}
            incrementerOptions={{
              max: 5,
              min: 0,
              step: 0.5,
              default: 1,
            }}
            renderCountValue={(count) => {
              if (count > 4) {
                return `4+`
              } else {
                return `${count.toFixed(1)}`
              }
            }}
            initialData={{
              count: this.props.prefs.GROUP.BATHROOMS || 1
            }}
          />
        </Card>
        <Card title="Lease Length" style={{ maxWidth: '400px', margin: '20px' }}>
          <CounterModule
            onComplete={(data) => this.completedLeaseLength(data)}
            incrementerOptions={{
              max: 19,
              min: 1,
              step: 1,
              default: 12
            }}
            renderCountValue={(c) => {
              if (c == 1) {
                return 'monthly'
              } else if (c > 18) {
                return 'multi-year'
              } else if (c == 12) {
                return '1 year'
              } else {
                return (<span style={{ fontSize: '1.5rem' }}>{`${c} months`}</span>)
              }
            }}
            initialData={{
              count: this.props.prefs.MOVEIN.LEASE_LENGTH
            }}
          />
        </Card>
        <Card title="Main Destination" style={{ maxWidth: '400px', margin: '20px' }}>
          <MapModule
            onComplete={(data) => this.completedMainDestination(data)}
            mapOptions={{ componentRestrictions: {} }}
            initialData={{
              address_components: [],
              address_lat: this.props.prefs.LOCATION.DESTINATION_GEOPOINT.split(',')[0],
              address_lng: this.props.prefs.LOCATION.DESTINATION_GEOPOINT.split(',')[1],
              address_place_id: '',
              address: this.props.prefs.LOCATION.DESTINATION_ADDRESS,
            }}
          />
        </Card>
        {
          this.state.searchable
          ?
          <div onClick={() => this.updateSearch()} style={{ width: '100%', height: '50px', position: 'fixed', bottom: '0px', left: '0px', backgroundColor: this.state.loading ? 'white' : '#2faded', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
            {
              this.state.loading
              ?
              <Spin />
              :
              'UPDATE SEARCH'
            }
          </div>
          :
          null
        }
        <div style={{ width: '100%', height: '70px' }}></div>
			</div>
		)
	}
}

// defines the types of variables in this.props
EditSearch.propTypes = {
	history: PropTypes.object.isRequired,
  prefs: PropTypes.object.isRequired,
  updatePreferences: PropTypes.func.isRequired,
  tenant_id: PropTypes.string.isRequired,
}

// for all optional props, define a default value
EditSearch.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(EditSearch)

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
