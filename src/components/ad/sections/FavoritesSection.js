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
  Icon,
  List,
  Card,
  Badge,
} from 'antd'
import { isMobile } from '../../../api/general/general_api'

class FavoritesSection extends Component {

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
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Badge count={this.props.tenant_favorites.length} style={{ backgroundColor: '#52c41a' }} offset={[12, 0]}>
            <h2>My List</h2>
          </Badge>
          <a href='/app/favorites'>View All</a>
        </div>
        <br />
        <List
           grid={isMobile() ? { gutter: 16, column: 2 } : { gutter: 16, column: 3 }}
           loading={!this.props.loading_complete}
           dataSource={listings.splice(0, 3)}
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
                onClick={isMobile() ? () => this.props.setListing(item, `/matches/${item.REFERENCE_ID}`) : () => this.props.previewListing(item)}
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
			<div id='FavoritesSection' style={comStyles().container}>
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
FavoritesSection.propTypes = {
	history: PropTypes.object.isRequired,
  all_listings: PropTypes.array.isRequired,
  tenant_favorites: PropTypes.array.isRequired,
  loading_complete: PropTypes.bool.isRequired,
  previewListing: PropTypes.func.isRequired,      // passed in
}

// for all optional props, define a default value
FavoritesSection.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(FavoritesSection)

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
