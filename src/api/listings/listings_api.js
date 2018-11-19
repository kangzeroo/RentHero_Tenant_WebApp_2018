import moment from 'moment'
import axios from 'axios'

export const getListings = () => {
	const p = new Promise((res, rej) => {
		axios.post('https://1w7f6p6d9c.execute-api.us-east-1.amazonaws.com/development/get-listings', {})
			.then((data) => {
				console.log(data)
				res(data.data.data)
			})
			.catch((err) => {
				console.log(err)
				rej(err)
			})
	})
	return p
}
