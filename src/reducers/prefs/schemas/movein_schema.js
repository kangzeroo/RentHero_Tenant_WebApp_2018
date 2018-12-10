

export const MOVEIN = {

  KEY: 'MOVEIN',
  TENANT_ID: '',

  TOUR_READY_DATE: null,
  IDEAL_MOVEIN_DATE: null,
  MIN_MOVEIN_DATE: null,
  MAX_MOVEIN_DATE: null,
  LEASE_LENGTH: 12,

  FROM_CITY: '',
  FROM_CITY_GEOPOINT: '',
  CURRENT_LEASE_END_DATE: null,
  MOVING_REASON: '',

  // how soon are they looking to move in?
  // URGENCY_AS: ['urgent'],                                                       // save as CSV string
  // URGENCY_AS_SCHEMAS: [{ id, text, value }],                                   // save as stringified json
  URGENCY_AS: [],                                                       // save as CSV string
  URGENCY_AS_SCHEMAS: [],                                   // save as stringified json

  // status of their current lease
  // CURRENT_LEASE_AS: ['leaving'],                                                // save as CSV string
  // CURRENT_LEASE_AS_SCHEMAS: [{ id, text, value }],                             // save as stringified json
  CURRENT_LEASE_AS: [],                                                // save as CSV string
  CURRENT_LEASE_AS_SCHEMAS: [],                             // save as stringified json

  // has the 2 months notice been given?
  // NOTICE_GIVEN_AS: ['given notice'],                                            // save as CSV string
  // NOTICE_GIVEN_AS_SCHEMAS: [{ id, text, value }],                              // save as stringified json
  NOTICE_GIVEN_AS: [],                                            // save as CSV string
  NOTICE_GIVEN_AS_SCHEMAS: [],                              // save as stringified json

  // are they able to go on tours, or will they need a rep?
  // TOUR_REP_AS: ['myself', 'realtor'],                                           // save as CSV string
  // TOUR_REP_AS_SCHEMAS: [{ id, text, value }],                                  // save as stringified json
  TOUR_REP_AS: [],                                           // save as CSV string
  TOUR_REP_AS_SCHEMAS: [],                                  // save as stringified json

  // what factors will determine their decision?
  // DECISION_FACTORS_AS: ['timing', 'availability'],                              // save as CSV string
  // DECISION_FACTORS_AS_SCHEMAS: [{ id, text, value }],                          // save as stringified json
  DECISION_FACTORS_AS: [],                              // save as CSV string
  DECISION_FACTORS_AS_SCHEMAS: [],                          // save as stringified json

}
