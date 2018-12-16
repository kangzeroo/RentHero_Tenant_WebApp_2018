// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'antd-mobile'
import { getFavoritesForTenant, } from '../../api/tenant/tenant_api'
import { saveTenantFavoritesToRedux } from '../../actions/tenant/tenant_actions'

class TenantFavorites extends Component {

  constructor() {
    super()
    this.state = {

    }
  }

  componentWillMount() {
    if (this.props.tenant_favorites && this.props.tenant_favorites.length > 0) {
      console.log(this.props.tenant_favorites)
    } else if (this.props.tenant_profile && this.props.tenant_profile.tenant_id) {
      this.getFavoritesForTenant(this.props.tenant_profile.tenant_id)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.tenant_profile !== nextProps.tenant_profile) {
      console.log('LETS GET SOME FAVS')
      this.getFavoritesForTenant(nextProps.tenant_profile.tenant_id)
    }
  }

  getFavoritesForTenant(tenant_id) {
    console.log(tenant_id)
    getFavoritesForTenant(tenant_id)
      .then((data) => {
        console.log(data)
        this.props.saveTenantFavoritesToRedux(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

	render() {
		return (
			<div id='TenantFavorites' style={comStyles().container}>
				TenantFavorites
			</div>
		)
	}
}

// defines the types of variables in this.props
TenantFavorites.propTypes = {
	history: PropTypes.object.isRequired,
  tenant_profile: PropTypes.object.isRequired,
  tenant_favorites: PropTypes.array.isRequired,
  saveTenantFavoritesToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
TenantFavorites.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(TenantFavorites)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    tenant_profile: redux.auth.tenant_profile,
    tenant_favorites: redux.tenant.favorites,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    saveTenantFavoritesToRedux,
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
