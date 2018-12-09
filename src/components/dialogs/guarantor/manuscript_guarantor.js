
/*

  GUARANTOR_DETAILS = {

    TENANT_ID: 'abc123',
    GUARANTOR_ID: 'xyz987',
    LEGAL_NAME: 'Stevie',
    EMAIL: 'stevie@email.com',
    PHONE: '4544354656',
    MAILING_ADDRESS: '456 Esther St',
    MAILING_GEOPOINT: '-43.567576,97.5678687',
    ...

  }


  // -------------------------- DIALOG #10 --------------------------- //


  MultiOptionsSegment        0. Hello ______, John Wu has selected you to be his guarantor to his lease.
                                This means you agree to be legally responsible for rent if John misses a payment.
                                Do you agree to be John's guarantor?
                                      a. Yes
                                      b. No

  InputSegment               1. What is your legal name?

  InputSegment               2. What is the best email to contact you at?

  InputSegment               3. What is the best phone to contact you at?

  MapSegment                 3. What is your mailing address?

  MultiOptionsSegment        4. Do you know what the difference between a credit score and a credit report is?
                                            a. Yes
                                            b. No

  MultiOptionsSegment        5. A credit score is a measurement of how well you pay back your debts....
                                It is mandatory, all landlords expect it as security and reassurance...
                                A credit report is a detailed breakdown of what debts your have on record, and your payment history.
                                Have you ever gotten any of the below credit reports done before?
                                            a. Canadian Report
                                            b. American Report
                                            c. UK Report
                                            d. Non-English Report
                                            e. None

  CounterSegment         6. What is your credit score?
                                            a. Enter in counter
                                            b. Don't Remember

  MultiOptionsSegment        7. In Toronto, landlords only accept Equifax credit reports within the last 3 months. Do you know how to get your Equifax credit score?
                                            a. Click here to learn how to do an Equifax credit report (takes 15 mins and costs $24 CAD - not affiliated with RentHero)
                                            b. Click here to upload your Equifax credit report.

  FileUploadSegment          8. Upload your official Equifax credit report here.

  FileUploadSegment          9. Upload your valid government ID here.

  MultiOptionsSegment        10. What sources of income do you have?
                                        a. employed full time
                                        b. employed part time
                                        c. self employed
                                        d. other

  InputSegment               10a/b_1. What is your job title? You can put multiple. (eg. Welder at a Machine Shop, Manager at Costco)

  CounterSegment             10a/b_1_2. What is your monthly total income from all jobs?

  MultiOptionsSegment        10a/b_1_2_3. Are you able to provide proof of income from your job? Select any that you can obtain.
                                        a. Paycheque from Employer
                                        b. Employment Letter with Salary
                                        c. Personal Income Tax Filing
                                        d. Bank Deposits Activity
                                        e. Other

  MultiOptionsSegment        10c_1. What type of self employed best describes your current situation?
                                        a. Gig Job (eg. Driving Uber, parcel delivery)
                                        b. Small Business (eg. Convinence store, Etsy store)
                                        c. Professional Services (eg. Law, Accounting, Management)
                                        d. Tech Startup (eg. SaaS, hardware, non-profit, tech)
                                        e. Content Creator (eg. Vlogger, Social Media Influencer)
                                        f. Other

  CounterSegment             10c_1_2. What is your total montly income from your self employment?

  MultiOptionsSegment        10c_1_2_3. Are you able to show consistent proof of income from your self employment, for at least the past 6 months?
                                     Select all options for proof of income you are able to obtain.
                                        a. Regular Payouts
                                        b. Irregular Payouts
                                        b. Personal Income Tax Filing
                                        c. Bank Deposits Activity
                                        d. None

  FileUploadSegment          11. Please upload and label your proofs of income.

  MessageSegment             12. Done! Thank you _____ for helping Chris Wu's rental as a guarantor. You may come back at any time to update documents.

*/
