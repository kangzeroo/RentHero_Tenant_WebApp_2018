
/*

  DOCUMENTS = {
    ...DOCUMENTS,
    EMAIL: 'myname@email.com'
  }

  GROUP: {

        TENANT_ID: 'abc123',
        KEY: 'GROUP',
        GROUP_ID, 'asdf-gdg35t-sdfgdsf',
        GROUP_NAME: 'Winter 2019 Crew',
        CERTAIN_MEMBERS: 2,
        UNCERTAIN_MEMBERS: 3,
        MAX_TOTAL_GROUP: 1,
        BIO: '',

        // acceptable room types
        ACCEPTABLE_UNITS_AS: ['2 bed', '2+den'],                                        // save as CSV string
        ACCEPTABLE_UNITS_AS_SCHEMAS: [{ id, text, value }]

        // names of group members
        GROUP_MEMBERS_AS: ['Jessica', 'Steven'],                                        // save as CSV string
        GROUP_MEMBERS_AS_SCHEMAS: [{ id, text, value }]                                     // saved as stringified JSON

        // group description
        SEARCHING_AS: ['2 friends'],                                                      // save as CSV string
        SEARCHING_AS_SCHEMAS: [{ id, text, value }]                                      // saved as stringified JSON

        // prefer whole place or ok with random roommates
        WHOLE_OR_RANDOM_AS: ['whole place', 'random roommates'],                          // save as CSV string
        WHOLE_OR_RANDOMS_AS_SCHEMAS: [{ id, text, value }],                              // saved as stringified JSON

        // will someone live in the den?
        LIVE_IN_DEN_AS: ['show den'],                                                     // save as CSV string
        LIVE_IN_DEN_AS_SCHEMAS: [{ id, text, value }],                                   // saved as stringified JSON

        // whats the family like?
        FAMILY_MEMBERS_AS: ['2 adult', '1 elderly', '1 child'],                           // save as CSV string
        FAMILY_MEMBERS_AS_SCHEMAS: [{ id, text, value }],                                // saved as stringified JSON

        // any pets?
        PETS_AS: ['2 large dogs', '1 bird'],                                              // save as CSV string
        PETS_AS_SCHEMAS: [{ id, text, value }],                                          // saved as stringified JSON

  }


  // -------------------------- DIALOG #2 --------------------------- //


  MessageSegment                  0. Let's get more specific on what kind of rentals are suitable for your group!

  MultiOptionsSegment             1. So who are you searching with?
                                            a. just myself
                                            b. 2 friends
                                            c. 3+ friends
                                            d. a couple 💑
                                            e. a family of 3+

  MultiCounterSegment             1b/c. How many people are 100% certain they want to live together, and how many are uncertain (depending on price, property or timing)? (male and female)

  MultiInputSegment               1b/c_2. What are the names of your certain group members?

  MultiOptionsSegment             1b/c_2_3. Do you want to live in one place all to yourselves, or are you ok with meeting new roommates who are also searching? Roommates mean less space for cheaper rent.
                                            a. a place all to ourselves
                                            b. ok to meet new roommates
                                            c. show me both

  CounterSegment                  1b/c_2_3b. Be sure to fill out your roommate matching criteria later!

  MultiOptionsSegment             1b/c_2_3_4. Rent can be expensive. Do any roommates want to save money and live in a den? I can show you places with that possibility, but the max limit is 1 person in a den.
                                            a. no, we all want our own room
                                            b. yes, show me dens
                                            c. show me both

  MultiCounterSegment             1e. I am happy to serve your family 😊 How many people are you in total? Please include everyone who will sleep there.
                                            - adult x2
                                            - elderly x1
                                            - child x3

  MultiCounterSegment             2. Do you have any pets?
                                            - large dogs x2
                                            - parrot x1

  InputSegment                    3. What are you looking for in your next rental?

  InputSegment                    4. What is your email?

  MultiCounterSegment             3. What type of bedrooms would you like to see? (has a lockable door with a window)
                                            - 2 beds
                                            - 2+dens
                                            - 4 beds
                                            multi
                                            dynamic

  InputSegment                    5. What would you like to call your group?

  MultiCounterSegment             6. Make sure everyone in your group has this link

  ActionSegment                   7. Would you like to see your matches now, or update your roommate matching criteria?
                                            a. View matches
                                            b. Update roommate matching

*/
