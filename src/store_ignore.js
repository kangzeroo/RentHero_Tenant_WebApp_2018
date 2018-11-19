import { createLogger } from 'redux-logger'

// paste Redux actions here and you will see their change log on the chrome console
// be sure to import the actions
const listOfBlacklisted = [
]

// function to send those change logs onto chrome console
const filteredLogger = createLogger({
	predicate: (getState, action) => {
		// toggle allow = true
		let allow = true
		listOfBlacklisted.forEach((black) => {
			if (black === action.type) {
				allow = true
			}
		})
		return allow
	}
})

export default filteredLogger
