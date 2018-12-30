

export const LOCATION = {

    KEY: 'LOCATION',
    TENANT_ID: '',

    // how set are you on your location preferences?
    // PREFERENCES_AS: ['defined area', 'open to recommendations'],                   // save as CSV string
    // PREFERENCES_AS_SCHEMAS: [{ id, text, value }],                                // save as stringified json
    PREFERENCES_AS: '',                   // save as CSV string
    PREFERENCES_AS_SCHEMAS: [],                                // save as stringified json

    // polygon of location preferences
    // GEO_POLYGON: [{lat,lng}],
    GEO_POLYGON: [],

    // daily commute info
    DESTINATION_ADDRESS: '200 University Ave W, Waterloo, ON N2L 3G1',
    DESTINATION_GEOPOINT: '43.473811,-80.531618',
    DESTINATION_ARRIVAL: 540,

    // modes of transportation
    TRANSPORT_MODES_AS: '',                          // save as CSV string
    TRANSPORT_MODES_AS_SCHEMAS: [],                             // save as stringified json

    // desired nearby
    DESIRED_NEARBY_AS: '',                              // save as CSV string
    DESIRED_NEARBY_AS_SCHEMAS: [],                             // save as stringified json

}
