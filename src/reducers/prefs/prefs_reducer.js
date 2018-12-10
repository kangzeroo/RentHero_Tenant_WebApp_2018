import {
  UPDATE_PREFERENCES,
} from '../../actions/action_types'
import { FINANCIALS } from './schemas/financials_schema'
import { GROUP } from './schemas/group_schema'
import { MOVEIN } from './schemas/movein_schema'
import { CREDIT } from './schemas/credit_schema'
import { LOCATION } from './schemas/location_schema'
import { AMENITIES } from './schemas/amenities_schema'
import { TOUR } from './schemas/tour_schema'
import { DOCUMENTS } from './schemas/documents_schema'
import { ROOMMATES } from './schemas/roommates_schema'

const INITIAL_STATE = {
  TENANT_ID: '',
  FINANCIALS,
  GROUP,
  MOVEIN,
  CREDIT,
  LOCATION,
  AMENITIES,
  TOUR,
  DOCUMENTS,
  ROOMMATES,
}

export default (state = INITIAL_STATE, action) => {
  let new_state = state
  switch (action.type) {
    case UPDATE_PREFERENCES:
      return {
        ...state,
        [action.payload.KEY]: {
          ...state[action.payload.KEY],
          ...action.payload
        }
      }
    default:
      return {
        ...state,
      }
  }
}
