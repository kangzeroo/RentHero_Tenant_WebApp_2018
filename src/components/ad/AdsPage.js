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
  Divider,
  Icon,
  Tooltip,
  Button,
} from 'antd'
// import {
//   Button,
// } from 'antd-mobile'
import EditSearch from '../edits/EditSearch'
import FavoritesSection from './sections/FavoritesSection'
import { setCurrentListing } from '../../actions/listings/listings_actions'
import { isMobile } from '../../api/general/general_api'

class AdsPage extends Component {

  constructor() {
    super()
    this.state = {
      search_string: '',
      show_filter: false,
      mobile: false,
    }
  }

  componentWillMount() {
    this.setState({
			mobile: isMobile()
		}, () => console.log(this.state))
  }

	componentDidUpdate(prevProps, prevState) {
    console.log(this.props.auth.authentication_loaded, this.props.auth.authenticated)
		if (!this.props.auth.authentication_loaded) {
			this.props.history.push('/')
		}
	}

  renderTitle() {
    return (
      <div>
        <div style={{ textAlign: 'left' }}>
          <h2>{`Relevant Listings for you`}</h2>
          <p>{`Here are the most relevant listings we've found for you, based on the information you've provided for us. If you'd like for your search to be even more specific, please `}<a href='/app/profile' target='_blank'>Click Here</a></p>
        </div>
        <Button type='primary' icon='caret-right' onClick={() => this.props.history.push('/slideshow')} style={{ borderRadius: '25px', width: '50%' }} size='large'>
          Start Slideshow
        </Button>
      </div>
    )
  }

  renderSearchAndFilter(prefs) {
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
          <Input value={this.state.search_string} onChange={(e) => this.setState({ search_string: e.target.value })} placeholder={`Search homes near ${prefs.LOCATION.DESTINATION_ADDRESS.split(',')[0]}`} />
          &nbsp;
          <Tooltip title='Filter'>
            <Icon type='filter' theme="twoTone" onClick={() => this.setState({ show_filter: true })} size='large' style={{ fontSize: '1.5rem' }} />
          </Tooltip>
          {
            this.state.mobile
            ?
            <Button onClick={() => this.props.history.push('/map')} type='ghost' size='small' style={{ width: '50px', margin: '0px 0px 0px 5px' }}>
              <i className='ion-ios-location' style={{ fontSize: '0.9rem' }} />
            </Button>
            :
            null
          }
        </div>
      )
    }
  }

  renderProperties(listings) {
    return (
      <div id='Listings'>
        <br />
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

  renderFavoritesSection() {
    return (
      <div id='MyList'>
        <Divider />
        <FavoritesSection

        />
      </div>
    )
  }


	render() {
		return (
			<div id='AdsPage' style={comStyles().container}>
				{
          this.renderTitle()
        }
        <Divider />
        {
          this.renderSearchAndFilter(this.props.prefs)
        }
        {
          this.renderProperties(this.props.listings.all_listings)
        }
        {
          this.renderFavoritesSection()
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
