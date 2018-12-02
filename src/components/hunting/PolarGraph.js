// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import Chart from 'chart.js'
import { withRouter } from 'react-router-dom'


class PolarGraph extends Component {

  constructor() {
    super()
    this.state = {
      companies: [],
      sorted_companys_reviews: [],
      showCompanyPicker: false,
      showCompanyInfo: true,
    }
  }

  componentDidMount() {
    this.generateCharts()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.ads !== this.props.ads) {
      this.generateCharts()
    }
  }

  calculateColor(numBeds) {
    if (numBeds == 0) {
      return '#f0ad4e'
    } else if (numBeds <= 1.5) {
      return '#5cb85c'
    } else if (numBeds <= 2.5) {
      return '#337ab7'
    } else if (numBeds <= 3.5) {
      return '#d9534f'
    } else if (numBeds <= 4.5) {
      return '#5bc0de'
    } else if (numBeds <= 5.5) {
      return '#001d4a'
    }
  }

  calculateAvgBedPrice(currentBEDS, sorted_ads) {
    let matchingBeds = sorted_ads.filter((a) => {
      return a.BEDS == currentBEDS
    })
    let accBed = matchingBeds.reduce((acc, curr) => {
      return acc + curr.BEDS
    }, 0)
    let accPrice = matchingBeds.reduce((acc, curr) => {
      return acc + curr.PRICE
    }, 0)
    const avgBedPrice = accPrice/accBed
    console.log(accBed)
    console.log(accPrice)
    console.log(avgBedPrice.toFixed(0))
    return parseInt(avgBedPrice.toFixed(0))
  }

  generateCharts() {
    const sorted_ads = this.props.ads.sort((a,b) => {
      return a.BEDS - b.BEDS
    })
    const data = {
        datasets: [{
            data: sorted_ads.map(r => r.PRICE),
            backgroundColor: sorted_ads.map(r => this.calculateColor(r.BEDS))
        }],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: sorted_ads.map((a) => {
          // var lb = [`${r.name} on ${r.source} wrote ${moment(r.date).fromNow()}:`].concat(r.text.split('.'))
          var lb = [`${a.BEDS} BED`]
          return lb
        })
    }
    console.log(data)
    const ctx = document.getElementById('polarchart').getContext('2d');
    const chart = new Chart(ctx, {
        data: data,
        type: 'polarArea',
        options: {
          legend: {
            display: false,
          }
        }
    })
  }


	render() {
		return (
			<div id='PolarGraph' style={comStyles().container}>
        <canvas id='polarchart'></canvas>
			</div>
		)
	}
}

// defines the types of variables in this.props
PolarGraph.propTypes = {
	history: PropTypes.object.isRequired,
  ads: PropTypes.array.isRequired,          // passed in
}

// for all optional props, define a default value
PolarGraph.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(PolarGraph)

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
      justifyContent: 'center',
		}
	}
}
