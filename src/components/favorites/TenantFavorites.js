// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import {
  Card,
  List,
  Icon,
  Badge,
  Divider,
} from 'antd'
import { getFavoritesForTenant, } from '../../api/tenant/tenant_api'
import { saveTenantFavoritesToRedux } from '../../actions/tenant/tenant_actions'
import { isMobile } from '../../api/general/general_api'

class TenantFavorites extends Component {

  constructor() {
    super()
    this.state = {
      favorites_to_show: [],
    }
  }

  componentWillMount() {
    if (this.props.all_listings && this.props.tenant_favorites) {
      this.findFavs(this.props.all_listings, this.props.tenant_favorites)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.all_listings !== nextProps.all_listings) {
      this.findFavs(nextProps.all_listings, nextProps.tenant_favorites)
    }
    if (this.props.tenant_favorites && nextProps.tenant_favorites) {
      this.findFavs(nextProps.all_listings, nextProps.tenant_favorites)
    }
  }

  findFavs(all_listings, tenant_favorites) {
    let favs = all_listings.filter((li) => {
      return tenant_favorites.filter((tf) => {
        return li.REFERENCE_ID === tf.property_id
      }).length > 0
    })
    console.log(favs)
    this.setState({
      favorites_to_show: favs,
    })
  }

  renderFavorites(listings) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <br />
        <List
           grid={isMobile() ? { gutter: 16, column: 1 } : { gutter: 16, column: 3 }}
           loading={!this.props.loading_complete}
           dataSource={listings}
           renderItem={item => (
             <List.Item key={item.REFERENCE_ID}>
               <Card
                cover={<img src={item.IMAGES[0].url} style={{ maxHeight: '150px', borderRadius: '5px', }} />}
                bordered={false}
                bodyStyle={{
                  margin: '10px 0px',
                  padding: 0,
                }}
                style={{ padding: '10px', cursor: 'pointer' }}
                onClick={() => window.open(`${window.location.origin}/matches/${item.REFERENCE_ID}`)}
               >
                  <Card.Meta
                    title={item.TITLE}
                    description={
                      <div>
                        <div>{`${item.BEDS} Beds ${item.BATHS} Baths`}</div>
                        <div>{`$${item.PRICE} Per month`}</div>
                        <div>{`Posted ${moment(item.DATE_POSTED).fromNow()}`}</div>
                      </div>
                    }
                    style={{
                      textAlign: 'left',
                    }}
                  />
               </Card>
             </List.Item>
           )}
        />
      </div>

    )
  }

	render() {
		return (
			<div id='TenantFavorites' style={comStyles().container}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Badge count={this.props.tenant_favorites && this.props.tenant_favorites.length > 0 ? this.props.tenant_favorites.length : 0} style={{ backgroundColor: '#52c41a' }} offset={[12, 0]}>
            <h2>My List</h2>
          </Badge>
          <Icon type='share' style={{ fontSize: '1.2rem' }} />
        </div>
        <Divider />
        {
          this.state.favorites_to_show && this.state.favorites_to_show.length > 0
          ?
          this.renderFavorites(this.state.favorites_to_show)
          :
          <div />
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
TenantFavorites.propTypes = {
	history: PropTypes.object.isRequired,
  all_listings: PropTypes.array.isRequired,
  tenant_favorites: PropTypes.array.isRequired,
  loading_complete: PropTypes.bool.isRequired,
}

// for all optional props, define a default value
TenantFavorites.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(TenantFavorites)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    all_listings: redux.listings.all_listings,
    tenant_favorites: redux.tenant.favorites,
    loading_complete: redux.app.loading_complete,
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
      padding: '20px',
      overflowY: 'scroll'
		}
	}
}
