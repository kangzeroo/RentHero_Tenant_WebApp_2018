
/*

  MOVEIN = {

    TENANT_ID: 'abc123',
    TOUR_READY_DATE: 'ISODateString()',
    IDEAL_MOVEIN_DATE: 'ISODateString()',
    MIN_MOVEIN_DATE: 'ISODateString()',
    MAX_MOVEIN_DATE: 'ISODateString()',
    LEASE_LENGTH: 12,

    FROM_CITY: 'Santiago, Chile',
    FROM_CITY_GEOPOINT: '43.5676437,-57.7867765',
    CURRENT_LEASE_END_DATE: 'ISODateString()',
    MOVING_REASON: '',

    // how soon are they looking to move in?
    URGENCY_AS: ['urgent'],                                                       // save as CSV string
    URGENCY_AS_SCHEMAS: [{ id, text, value }],                                   // save as stringified json

    // status of their current lease
    CURRENT_LEASE_AS: ['leaving'],                                                // save as CSV string
    CURRENT_LEASE_AS_SCHEMAS: [{ id, text, value }],                             // save as stringified json

    // has the 2 months notice been given?
    NOTICE_GIVEN_AS: ['given notice'],                                            // save as CSV string
    NOTICE_GIVEN_AS_SCHEMAS: [{ id, text, value }],                              // save as stringified json

    // are they able to go on tours, or will they need a rep?
    TOUR_REP_AS: ['myself', 'realtor'],                                           // save as CSV string
    TOUR_REP_AS_SCHEMAS: [{ id, text, value }],                                  // save as stringified json

    // what factors will determine their decision?
    DECISION_FACTORS_AS: ['timing', 'availability'],                              // save as CSV string
    DECISION_FACTORS_AS_SCHEMAS: [{ id, text, value }],                          // save as stringified json

  }


  // -------------------------- DIALOG #3 --------------------------- //


                                     Let's talk about move in dates
  MultiOptionsSegment             1. How urgent is your movein?
                                            a. urgent
                                            b. flexible
                                            c. just browsing
                                            d. exact date
  DatePickerSegment               2. What is the ideal movein date?
  DateRangeSegment                3. Whats your movein range?
  MapSegment                      4. Where are you moving from? What is your current city?
                                            a/b. Hamilton, ON, Canada or Rio DeJaniro, Brazil
  DatePickerSegment               4b. Only if current city is outside Ontario: When will you arrive in Ontario and be ready to go on tours?
  MultiOptionsSegment             4a. Only if current city is in ON, Canada: What is your current housing situation?
                                            a. leaving a lease
                                            b. want to escape a lease
                                            c. sublet
                                            d. no lease
                                            e. with family
  MultiOptionsSegment             4aa. Only if current housing situation is leaving an existing lease: Have you given your mandatory 2 months notice yet?
                                            a. not yet, want secure first
                                            b. did not know
                                            c. notice given
                                            d. landlord doesnt care
  DatePickerSegment               4aaa. If not given 2 months notice: When does your current lease end?
  MultiOptionsSegment             5. Will you be able to visit properties in person, or will you need a representative to help? (friend, family, or agent)
                                            a. myself
                                            b. friends or family
                                            c. need realtor
                                            multi
  CounterSegment                  6. How long of a lease are you looking for?
  InputSegment                    7. Can you tell me a little bit about why you're moving?
  MultiOptionsSegment             8. Which of these are the biggest factors to your movein choice?
                                            a. good price & location
                                            b. good timing
                                            c. good availability
                                            d. group
                                            e. saved enough money
                                            f. got job
                                            g. other
                                            multi
  ActionSegment                   Ok I've filtered out the rentals that fit your move-in preferences.
                                  Some online ads don't mention the move-in date or lease length, so I will still show those.
                                  Ready to see your matches?
*/
