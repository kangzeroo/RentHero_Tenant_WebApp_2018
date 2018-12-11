// Compt for copying as a CoverPage
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { isMobile } from '../../api/general/general_api'
import { withRouter } from 'react-router-dom'
import {

} from 'antd-mobile'
import { BLUE_PACKAGE, CLEAN_PAPER } from '../modules/AdvisorUI_v2/styles/color_packs'


class CoverPage extends Component {

	constructor() {
		super()
		this.state = {
			commentary: 'Ask me something',
			search_string: '',
			options: [
				{ id: '1', text: 'Set Budget', link: '/matches' },
				{ id: '2', text: 'Set Group Options', link: '/matches' },
				{ id: '3', text: 'Move In Dates', link: '/matches' },
				{ id: '4', text: 'Credit Report', link: '/matches' },
				{ id: '5', text: 'Set Location', link: '/matches' },
				{ id: '6', text: 'Wanted Amenities', link: '/matches' },
				{ id: '7', text: 'Tour Setup', link: '/matches' },
				{ id: '8', text: 'Upload Documents', link: '/matches' },
				{ id: '9', text: 'Roommate Search', link: '/matches' },
			]
		}
		this.mobile = false
	}

  componentDidMount() {
    this.mobile = isMobile()
		if (!this.mobile) {
			document.getElementById('searchbar').focus()
		}
  }

	renderNotificationBlock() {
		return (
			<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '25px', width: '45%', height: '100%', borderRadius: '10px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
				<h1 style={{ color: 'white' }}>NEXT TO DO</h1>
			</div>
		)
	}

	renderMagazines() {
		return (
			<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', width: '100vw', color: CLEAN_PAPER.FONT_COLOR, backgroundColor: CLEAN_PAPER.BACKGROUND_COLOR }}>
				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', height: '70%', maxWidth: '800px' }}>

						{
							this.renderNotificationBlock()
						}

						<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', width: '45%', height: '100%' }}>

							<div style={{ backgroundColor: 'rgba(0,0,0,0.2)', width: '100%', height: '40%', borderRadius: '10px', padding: '15px', margin: '0px 0px 5px 0px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
								SEE MAP
							</div>

							<div style={{ backgroundColor: 'rgba(0,0,0,0.2)', width: '100%', height: '40%', borderRadius: '10px', padding: '15px', margin: '5px 0px 5px 0px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
								3 NEW
							</div>

							<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', height: '20%', margin: '5px 0px 0px 0px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
								<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '10px', width: '48%', height: '100%' }}>
									10 FAVS
								</div>
								<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '10px', width: '48%', height: '100%' }}>
									34 TRASH
								</div>
							</div>

						</div>

				</div>
			</div>
		)
	}

	renderConvoSearch() {
		return (
			<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', height: '90vh', width: '100vw', backgroundColor: BLUE_PACKAGE.BACKGROUND_COLOR, padding: '15px 20px 20px 20px' }}>
				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '100px', width: '100%', maxWidth: '800px' }}>
					<input id='searchbar' placeholder={this.state.commentary} type='text' value={this.state.search_string} onChange={e => this.setState({ search_string: e.target.value })} style={comStyles().text_input} />
				</div>
				<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', width: '100%', borderRadius: '10px' }}>
					{
						this.state.options.filter((option) => {
							return option.text.toLowerCase().indexOf(this.state.search_string.toLowerCase()) > -1
						}).map((option) => {
							return (
								<div key={option.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', minHeight: '50px', padding: '5px', backgroundColor: 'rgba(256,256,256,0.8)', color: 'black' }}>{option.text}</div>
							)
						})
					}
				</div>
			</div>
		)
	}

	render() {
		return (
			<div id='CoverPage' style={comStyles().container}>
				{
					this.renderMagazines()
				}
				{
					this.renderConvoSearch()
				}
			</div>
		)
	}
}

// defines the types of variables in this.props
CoverPage.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
CoverPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(CoverPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

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
		},
    text_input: {
      background: BLUE_PACKAGE.INPUT_BACKGROUND,
      border: 'none',
      display: 'flex',
      outline: 'none',
      width: '100%',
      fontSize: '1.2rem',
      height: '30px',
      borderRadius: '10px',
      padding: '20px',
			textAlign: 'center',
      color: BLUE_PACKAGE.FONT_COLOR,
      WebkitBoxShadow: '0 2px 10px 1px rgba(0,0,0,0)',
      boxShadow: '0 2px 10px 1px rgba(0,0,0,0)',
      "::placeholder": {
        color: BLUE_PACKAGE.INPUT_PLACEHOLDER_COLOR,
      },
      "::-webkit-input-placeholder": {
        color: BLUE_PACKAGE.INPUT_PLACEHOLDER_COLOR,
      }
    },
	}
}
