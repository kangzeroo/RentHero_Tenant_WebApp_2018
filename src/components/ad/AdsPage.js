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
  List,
  Card,
} from 'antd'
import { setCurrentListing } from '../../actions/listings/listings_actions'

class AdsPage extends Component {

  constructor() {
    super()
    this.state = {

    }
  }

  renderTitle(prefs) {
    return (
      <div style={{ textAlign: 'left' }}>
        <h2>{`Homes for you near ${prefs.LOCATION.DESTINATION_ADDRESS.split(',')[0]}`}</h2>
      </div>
    )
  }

  renderProperties(listings) {
    return (
      <div>
        <List
           grid={{ gutter: 16, column: 2 }}
           loading={!this.props.loading_complete}
           pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 10,
            }}
           dataSource={listings.filter(li => li.IMAGES.length > 0)}
           renderItem={item => (
             <List.Item key={item.REFERENCE_ID}>
               <Card
                cover={<img src={item.IMAGES[0].url} style={{ maxHeight: '200px', borderRadius: '5px', }} />}
                bordered={false}
                bodyStyle={{
                  margin: '10px 0px',
                  padding: 0,
                }}
                style={{ padding: '10px', cursor: 'pointer' }}
                onClick={() => this.props.setListing(item, `/matches/${item.REFERENCE_ID}`)}
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
			<div id='AdsPage' style={comStyles().container}>
				{
          this.renderTitle(this.props.prefs)
        }
        {
          this.renderProperties(this.props.listings.all_listings)
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
AdsPage.propTypes = {
	history: PropTypes.object.isRequired,
  prefs: PropTypes.object.isRequired,
  listings: PropTypes.object.isRequired,
  setCurrentListing: PropTypes.func.isRequired,
  loading_complete: PropTypes.bool.isRequired,
  setListing: PropTypes.func.isRequired,          // passed in
}

// for all optional props, define a default value
AdsPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AdsPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    prefs: redux.prefs,
    listings: redux.listings,
    loading_complete: redux.app.loading_complete,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    setCurrentListing,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      padding: '20px'
		}
	}
}
