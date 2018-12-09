
/*

  ROOMMATES = {

      TENANT_ID: 'abc123',
      KEY: 'ROOMMATES',
      AGE: 24,
      GENDER: 'male',

      ALLERGIES_MEDICAL: '',
      WEEKDAY_SLEEPTIME: '',
      WEEKEND_SLEEPTIME: '',
      MOST_TIME_SPENT: '',
      DO_FOR_FUN: '',
      BRIEF_BIO: '',
      HATE_WHEN: '',

      MAX_ROOMMATES: 5,
      MIN_ROOMMATE_AGE: 18,
      MAX_ROOMMATE_AGE: 30,

      // acceptable gender of roommates
      ACCEPTABLE_GENDER_AS: ['any gender'],                                              // save as CSV string
      ACCEPTABLE_GENDER_AS_SCHEMAS: [{ id, text, value }],                              // save as stringified json

      // lgbt identification
      LGBT_AS: ['yes'],                                                     // save as CSV string
      LGBT_AS_SCHEMAS: [{ id, text, value }],                              // save as stringified json

      // lgbt friendly
      LGBT_FRIENDLY_AS: ['yes'],                                                     // save as CSV string
      LGBT_FRIENDLY_AS_SCHEMAS: [{ id, text, value }],                              // save as stringified json

      // nearterm future goals
      FUTURE_GOALS_AS: ['career', 'love'],                                          // save as CSV string
      FUTURE_GOALS_AS_SCHEMAS: [{ id, text, value }],                              // save as stringified json

      // drug use
      DRUG_USE_AS: ['alcohol', 'cannabis'],                                     // save as CSV string
      DRUG_USE_AS_SCHEMAS: [{ id, text, value }],                              // save as stringified json

      // religion
      RELIGION_AS: ['muslim'],                                                  // save as CSV string
      RELIGION_AS_SCHEMAS: [{ id, text, value }],                              // save as stringified json

      // ethnicity
      ETHNICITY_AS: ['east asian', 'white'],                                     // save as CSV string
      ETHNICITY_AS_SCHEMAS: [{ id, text, value }],                              // save as stringified json
  }



  // -------------------------- DIALOG #9 --------------------------- //



  MessageSegment                  1. I am about to ask you some personal questions.
                                     None of these will be shared with a landlord, they are only used to help us understand and serve your needs better.
                                     Answering is optional, but we encourage you to answer as many as possible.
                                            a. Ok

  CounterSegment                  2. What is your age?

  MultiOptionsSegment             3. What gender are you?
                                            a. Male
                                            b. Female
                                            c. Other

  CounterSegment                  4. At most how many roommates are you ok with?

  MultiOptionsSegment             5. What gender of roommates are you ok with?
                                            a. only male
                                            b. only female
                                            c. any

  MultiCounterSegment             6. What is the min and max age of roommates you are ok with?

  InputSegment                    7. Do you identify with any LGBT sexual orientations? If not, skip this question.
                                            a. Yes
                                            b. No

  MultiOptionsSegment             8. Are you LGBT friendly?
                                            a. Yes
                                            b. No
                                            c. Other

  InputSegment                    9. Do you have any allergies or medical conditions?

  TimePickerSegment               10. What time do you usually sleep on weekdays?

  TimePickerSegment               10. What time do you usually sleep on weekends?

  InputSegment                    11. Where do you usually spend most of your time?

  InputSegment                    12. What do you like to do for fun?

  MultiTagSegment                 13. Which of these match your goals for the near future?
                                            a. Build my career
                                            b. Love
                                            b. Raise a family
                                            c. Have fun
                                            d. Meet lots of people
                                            e. Get settled in
                                            f. No idea what I'm gonna do with my life
                                            g. Travel
                                            h. Save Money
                                            j. Other

  MultiOptionsSegment             14. Do you enjoy any of these substances?
                                            a. Alcohol
                                            b. Cannabis
                                            c. Cigerettes/Vape
                                            d. Other

  InputSegment                    15. What is one thing you hate if roommates do?

  InputSegment                    16. Write a brief bio about yourself for potential roommates to see.

  MultiTagSegment                 17. Canada welcomes its diversity of religions. Do you identify with any of these religions?
                                      This will not be shared with anyone.
                                            a. Muslim
                                            b. Christian
                                            c. Hindu
                                            d. Buddist
                                            e. Sikh
                                            f. Judaism
                                            g. Agnostic/Athiest
                                            h. Other

  MultiTagSegment                 18. Canada welcomes its diversity of ethnicities. Do you identify with any of these ethnic backgrounds?
                                      This will not be shared with anyone.
                                            a. White
                                            b. Black
                                            c. Caribbean
                                            d. African
                                            e. East Asian
                                            f. South Asian
                                            g. SouthEast Asian
                                            h. Central Asian
                                            i. Polynesian
                                            j. Hispanic
                                            k. Arabic
                                            l. Iranian
                                            m. Turkish
                                            n. Jewish
                                            o. Native American
                                            p. Western European
                                            q. Eastern European
                                            r. Other

    ActionSegment                   19. Ok I've filtered out the rentals that fit your move-in preferences.
                                    Some online ads don't mention the move-in date or lease length, so I will still show those.
                                    Ready to see your matches?
*/
