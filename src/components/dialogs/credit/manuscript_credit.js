
/*

  CREDIT = {

    TENANT_ID: 'abc123',
    KEY: 'CREDIT',
    GUESSED_CREDIT_SCORE: 600,

    // past credit report experience
    PAST_CREDIT_EXP_AS: ['done once before but forgot'],                                // save as CSV string
    PAST_CREDIT_EXP_AS_SCHEMAS: [{ id, text, value }],                                // save as stringified json

    // what the tenant guessed their credit provider was
    GUESSED_CREDIT_AS: ['canadian credit', 'american credit'],                        // save as CSV string
    GUESSED_CREDIT_AS_SCHEMAS: [{ id, text, value }],                                // save as stringified json

  }


  // -------------------------- DIALOG #4 --------------------------- //


  MultiOptionsSegment             1. Let's talk about credit scores.
                                     Is this the first time you've done a credit report?
                                            a. Yes
                                            b. No, but I forgot
                                            b. No, never

  MultiOptionsSegment             2. A credit score is a measurement of how well you pay back your debts....
                                     It is mandatory, all landlords expect it as security and reassurance...
                                     A credit report is a detailed breakdown of what debts your have on record, and your payment history.
                                     Have you ever gotten any of the below credit reports done before?
                                            a. Canadian Report
                                            b. American Report
                                            c. UK Report
                                            d. Non-English Report
                                            e. None

  CounterSegment              3. What is your credit score? It's ok to guess!
                                            a. Enter in counter
                                            b. Don't Remember

  MultiOptionsSegment             4. In Toronto, landlords only accept Equifax credit reports within the last 3 months.
                                     Anyone in your group paying the rent needs to have one, as well as any guarantors.
                                            a. Click here to learn how to do an Equifax credit report (takes 15 mins and costs $24 CAD - not affiliated with RentHero)
                                            b. Click here to share a link with your guarantors on how to do an Equifax credit score.

  FileUploadSegment               5. You can upload your credit report here, or do it another time.

  ActionSegment                   6. Back to my matches

*/
