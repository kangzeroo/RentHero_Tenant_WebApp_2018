
/*

  TOUR = {

      TENANT_ID: 'abc123',
      KEY: 'TOUR',
      DAYS_SEARCHING: 28,
      TOURS_BEEN_ON: 4,
      TOUR_READY_DATE: 'ISODateString',
      REALTOR_OPT_IN: true,

      // renting experience
      RENTING_EXP_AS: ['first time in Toronto'],                                  // save as CSV string
      RENTING_EXP_AS_SCHEMAS: [{ id, text, value }],                            // save as stringified json

      // currently working with a realtor
      HAS_REALTOR_AS: ['first time in Toronto'],                                  // save as CSV string
      HAS_REALTOR_AS_SCHEMAS: [{ id, text, value }],                            // save as stringified json

      // why not working with realtor
      WHY_NO_REALTOR_AS: ['pushy'],                                                 // save as CSV string
      WHY_NO_REALTOR_AS_SCHEMAS: [{ id, text, value }],                            // save as stringified json

      // general tour availability
      TOUR_APPROX_AVAIL_AS: ['weekdays after work'],                                  // save as CSV string
      TOUR_APPROX_AVAIL_AS_SCHEMAS: [{ id, text, value }],                           // save as stringified json

      // specific tour availability
      TOUR_SPECIFIC_AVAIL_AS: [{start, end}],                                                 // save as CSV string
      TOUR_SPECIFIC_AVAIL_AS_SCHEMAS: [{ id, label, value: dateRange }],                      // save as stringified json

      // renting experience
      CAN_DRIVE_TOURS_AS: ['might be able to drive'],                                  // save as CSV string
      CAN_DRIVE_TOURS_AS_SCHEMAS: [{ id, text, value }],                            // save as stringified json

  }

  // -------------------------- DIALOG #7 --------------------------- //


  MessageSegment                  0. Ok let's figure out when is a good time to go on a tour.
                                     First, a few questions.

  MultiOptionsSegment             1. This this your first time renting?
                                            a. First time ever
                                            b. First time in Toronto
                                            c. No

  CounterSegment                  2. How long have you been searching for? (in weeks)

  CounterSegment                  3. How many property tours have you gone on so far?

  MultiOptionsSegment             4. Are you currently working with a rental or real estate agent?
                                            a. Yes currently
                                            b. Not anymore
                                            c. No

  MultiOptionsSegment             4b. Why are you no longer working with them?
                                            a. Not helpful
                                            b. Too pushy
                                            c. Did not priotitize me
                                            d. unprofessional
                                            e. other
                                            multi

  DatePickerSegment               5. When is the earliest date you can start touring?


  MultiOptionsSegment             6. What is your availability for tours like? Select all that apply.
                                            a. anyday anytime
                                            b. weekdays after work
                                            c. weekdays during breaks
                                            d. weekends
                                            e. only a specific window
                                            f. other
                                            multi

  MultiDateRangeSegment           6a. Do you have specific times you are available?

  MultiDateRangeSegment           6e. What is your window of availability?

  MultiOptionsSegment             7. Will you or your representative be driving to property tours, or commuting?
                                            a. Definately Driving
                                            b. Possibly Driving
                                            c. Not Driving

  MultiOptionsSegment             8. You may be eligible for private tours if your budget and credit is good.
                                     Real estate agents can give you tours for free through RentHero.
                                     The difference between a public and private tour is time.
                                     When you go on public tours, you operate on the landlord's schedule.
                                     With multiple public tours, this often means you are running across town and taking more time off work, which can be very frustrating in a competitve market.
                                     With private tours, a licensed real estate agent has access to the keys and can show you multiple properties back-to-back.
                                     This is very time efficient and having a professional assist you improves your odds of succesfully renting. Click here for more details.
                                     Would you like to opt in to this option if it is available?
                                            a. Opt In
                                            b. Opt Out

  ActionSegment                   9. Ok your profile has been updated with your tour availabilities. Would you like to go back to browsing, or update your contact info?
                                              a. Back to Browsing
                                              b. Update Contact Info

*/
