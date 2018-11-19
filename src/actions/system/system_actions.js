import axios from 'axios'
// import {
//   ERROR,
// } from '../action_types'

// if there is a failure, we send this to Redux
// export const errorOccurred = (err) => {
//   // dispatch lets you send actions to Redux
//   return (dispatch) => {
//     dispatch({
//       type: ERROR,
//       payload: err,
//     })
//   }
// }

// manually send the final action object to redux
export const dispatchActionsToRedux = (actions) => {
  return (dispatch) => {
    actions.forEach((action) => {
      dispatch(action)
    })
  }
}
