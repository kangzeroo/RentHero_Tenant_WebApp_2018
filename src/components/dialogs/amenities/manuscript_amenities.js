
/*

  AMENITIES = {

      TENANT_ID: 'abc123',
      KEY: 'AMENITIES',
      LOOKING_FOR: '',

      // sqft sizes of rooms
      SIZE_PREF_AS: ['defined area', 'open to recommendations'],                   // save as CSV string
      SIZE_PREF_AS_SCHEMAS: [{ id, text, value }],                                // save as stringified json
      MIN_SQFT: 900,

      // utilities taken care of by landlord
      UTILTIES_INCL_AS: ['electricity', 'water'],                                  // save as CSV string
      UTILTIES_INCL_AS_SCHEMAS: [{ id, text, value }],                            // save as stringified json

      // private bath preference
      PRIVATE_BATH_AS: ['would be nice'],                                         // save as CSV string
      PRIVATE_BATH_AS_SCHEMAS: [{ id, text, value }],                            // save as stringified json

      // parking preference
      PARKING_SPOTS_AS: ['underground', 'street'],                                 // save as CSV string
      PARKING_SPOTS_AS_SCHEMAS: [{ id, text, value }],                            // save as stringified json
      PARKING_SPOTS_REQUIRED: 1,

      // private bath preference
      PRIVATE_BATH_AS: ['would be nice'],                                         // save as CSV string
      PRIVATE_BATH_AS_SCHEMAS: [{ id, text, value }],                            // save as stringified json

      // unit amenities
      UNIT_AMENITIES_AS: ['balcony', 'view', 'marble'],                           // save as CSV string
      UNIT_AMENITIES_AS_SCHEMAS: [{ id, text, value }],                         // save as stringified json

      // building amenities
      BUILDING_AMENITIES_AS: ['gym', 'pool', 'security'],                           // save as CSV string
      BUILDING_AMENITIES_AS_SCHEMAS: [{ id, text, value }],                         // save as stringified json

      // decore
      UNIT_AMENITIES_AS: ['modern', 'chic'],                           // save as CSV string
      UNIT_AMENITIES_AS_SCHEMAS: [{ id, text, value }],                         // save as stringified json
  }

  // -------------------------- DIALOG #6 --------------------------- //


  MessageSegment             1. Tell me more about what you're looking for in your next home.
                                I will prioritize places that most closely match your preferences, but still show non-exact matches.

  MultiOptionsSegment        2. How much space are you looking for in your rental?
                                      a. I need large space
                                      b. less space is ok
                                      c. show both

  CounterSegment             2. How many square feet do you want?

  MultiTagSegment            3. Which of these utilities do you prefer the landlord handle?
                                      a. Electricity
                                      b. Water
                                      c. Heating
                                      d. Insurance
                                      e. Wifi
                                      multi

  MultiOptionsSegment        3. Do you need a private bathroom for yourself? A private bathroom add more to the cost.
                                      a. Yes, I must
                                      b. Nice, but not necessary
                                      c. No

  MultiTagSegment            4. Which of the following suite amenities matter to you? Select all that apply.
                                      a. Walk-in closet
                                      b. Gas Stove
                                      c. Balcony
                                      d. Ensuite laundry
                                      e. Large kitchen
                                      f. Great view
                                      g. Air Conditioning
                                      h. Central Vacuum
                                      g. Other
                                      multi

  MultiOptionsSegment        5. Which of the following aesthetics appeal to you? Select all that apply.
                                      a. Modern Sophisticated
                                      b. Warm & Cozy
                                      c. Old School
                                      d. Glass
                                      e. Wood
                                      f. Concrete
                                      g. Carpet
                                      h. Other
                                      multi

  MultiOptionsSegment        6. Which of the following building amenities appeal to you? Select all that apply.
                                      a. Gym & Fitness
                                      b. Pool
                                      c. Party Room
                                      d. Study Lounge
                                      e. Grocery on Main Floor
                                      f. Food Court on Main Floor
                                      g. Rooftop Patio
                                      h. Underground Parking
                                      i. On-Premises Security
                                      i. Other
                                      multi

  CounterSegment             7. How many parking spots does your group need?

  MultiOptionsSegment        7a. Which types of parking spots are acceptable?
                                      a. Free Street Parking
                                      b. Private Outdoor Parking
                                      c. Private Indoor Parking
                                      d. Paid Street Parking

  InputSegment               8. Anything you would like to tell me about your amenity preferences?

  ActionSegment              9. Ok, I have re-ranked your matches to take these amenities into consideration. See matches.

*/
