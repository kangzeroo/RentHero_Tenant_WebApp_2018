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
  Input,
} from 'antd'
import {
  Button,
} from 'antd-mobile'
import EditSearch from '../edits/EditSearch'
import { setCurrentListing } from '../../actions/listings/listings_actions'

class AdsPage extends Component {

  constructor() {
    super()
    this.state = {
      search_string: '',
      show_filter: false,
    }
  }

	componentDidUpdate(prevProps, prevState) {
    console.log(this.props.auth.authentication_loaded, this.props.auth.authenticated)
		if (!this.props.auth.authentication_loaded) {
			this.props.history.push('/')
		}
	}

  renderTitle(prefs) {
    if (this.state.show_filter) {
      return (
        <EditSearch
          onBack={() => this.setState({ show_filter: false })}
          onComplete={() => this.setState({ show_filter: false })}
        />
      )
    } else {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Input value={this.state.search_string} onChange={(e) => this.setState({ search_string: e.target.value })} placeholder={`Homes near ${prefs.LOCATION.DESTINATION_ADDRESS.split(',')[0]}`} />
          &nbsp;
          <Button onClick={() => this.setState({ show_filter: true })} type='ghost' size='small' style={{ width: '100px' }}>
            Filter {this.props.listings.all_listings.filter(li => li.IMAGES.length > 0).filter(li => li.ADDRESS.toLowerCase().indexOf(this.state.search_string.toLowerCase()) > -1).length}
          </Button>
        </div>
      )
    }
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
           dataSource={listings.filter(li => li.IMAGES.length > 0).filter(li => li.ADDRESS.toLowerCase().indexOf(this.state.search_string.toLowerCase()) > -1)}
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
  auth: PropTypes.object.isRequired,
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
    auth: redux.auth,
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
