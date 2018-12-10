
/*

  LOCATION = {

      TENANT_ID: 'abc123',
      KEY: 'LOCATION',

      // how set are you on your location preferences?
      PREFERENCES_AS: ['defined area', 'open to recommendations'],                   // save as CSV string
      PREFERENCES_AS_SCHEMAS: [{ id, text, value }],                                // save as stringified json

      // polygon of location preferences
      GEO_POLYGON: [{lat,lng}],

      // daily commute info
      DESTINATION_ADDRESS: '123 Main St',
      DESTINATION_GEOPOINT: '-72.5465747,45.6577878',
      DESTINATION_ARRIVAL: '11:00',

      // modes of transportation
      TRANSPORT_MODES_AS: ['driving', 'transit', 'carpool'],                          // save as CSV string
      TRANSPORT_MODES_AS_SCHEMAS: [{ id, text, value }],                             // save as stringified json

      // desired nearby
      DESIRED_NEARBY_AS: ['cafes', 'daycares', 'gyms'],                              // save as CSV string
      DESIRED_NEARBY_AS_SCHEMAS: [{ id, text, value }],                             // save as stringified json

  }


  // -------------------------- DIALOG #5 --------------------------- //


  MapSegment                      1. I can calculate your daily commute to work or school. Is the below address correct?

  TimePickerSegment               3. What time do you need to be at work by?

  MultiOptionsSegment             4. What is your main modes of transportation?
                                            a. Driving
                                            b. Transit
                                            c. Walking
                                            d. Bicycling
                                            e. Carpool
                                            f. Other
                                            multi

  MultiTagSegment                 5. Which of these do you care about having nearby?
                                            a. Groceries
                                            b. Public Transit
                                            c. Cafes
                                            d. Bars
                                            e. Resturants
                                            f. Convinence Stores
                                            g. Daycare
                                            h. Parks
                                            i. Fitness Facilities
                                            j. Shopping Malls
                                            k. Other
                                            multi

  MultiOptionsSegment             1. Would you like to define exactly where you want to live, or are you ok with recommendations?
                                            a. Define Exactly Where to Live --> Go to MapPolygonDrawer
                                            b. Define Preferances, but still give me recommendations --> Go to MapPolygonDrawer
                                            c. Just give me recommendations ---> Go to matches


*/
