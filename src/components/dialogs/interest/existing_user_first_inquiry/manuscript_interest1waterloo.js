

/*


FINANCIALS = {

    TENANT_ID: 'abc123',
    KEY: 'FINANCIALS',
    IDEAL_PER_PERSON: 1100,
    DEPOSIT_CASH: 2400,
    BUDGET_FLEXIBILITY: 200,

    // income calculations
    INCOME: {
      EMPLOYED: 1000,
      SELF_EMPLOYED: 1000,
      WELFARE: 0,
      OTHER: 1000,
      REPORTED_REGULAR: 2000,
      REPORTED_ADHOC: 1000,
    },

    // guarantor status
    GUARANTOR_STATUS_AS: ['canadian'],                                                    // save as CSV string
    GUARANTOR_STATUS_AS_SCHEMAS: [{ id, text, value }],                                  // saved as stringified JSON

    // what proof of incomes can we provide?
    PROOF_OF_INCOMES_AS: ['osap', 'paycheque'],                                           // save as CSV string
    PROOF_OF_INCOMES_AS_SCHEMAS: [{ id, text, value }]                                   // saved as stringified JSON

    // employment status
    EMPLOYED_AS: ['part_time', 'full_time', 'self_employed', 'unemployed', 'student'],    // save as CSV string
    EMPLOYED_AS_SCHEMAS: [{ id, text, value }],                                       // saved as stringified JSON
    JOB_TITLES: ['chef', 'repairman'],                                              // saved as stringified JSON

    // student info
    STUDIED_AS: ['phd cs uwaterloo', 'CFA'],                                              // save as CSV string
    STUDIED_AS_SCHEMAS: [{ id, text, value }],

    // self employed info
    SELF_EMPLOYED_AS: ['gig worker', 'small business']                                    // save as CSV string
    SELF_EMPLOYED_AS_SCHEMAS: [{ id, text, value }],                                             // save as CSV string

    // welfare info
    WELFARE_AS: ['odsp', 'osap'],                                                         // save as CSV string
    WELFARE_AS_SCHEMAS: [{ id, text, value }],                                           // saved as stringified JSON

    // other income info
    OTHER_INCOME_AS: ['family', 'investments'],                                           // save as CSV string
    OTHER_INCOME_AS_SCHEMAS: [{ id, text, value }],                                      // saved as stringified JSON

    // who legally signs the lease?
    SIGN_LEASE_AS: ['just myself'],                                                       // save as CSV string
    SIGN_LEASE_AS_SCHEMAS: [{ id, text, value }],                                        // saved as stringified JSON

  }

  --------------------------------------------------------------------------------------------------

  ActionSegment             1. Thanks for your interest in 123 Main Street
                                        a. First Time Visitor
                                    --> b. Existing User, First Inquiry
                                        c. Existing User, Third Inquiry

  MultiOptionsSegment        2. Are you currently working or studying? Select all that apply.
                                        a. employed full time
                                        b. employed part time
                                        c. student
                                        d. self employed
                                        e. unemployed
                                        f. retired
                                        multi

  MultiInputSegment          3a/b_2. What is your job title? You can put multiple. (eg. Welder at a Machine Shop, Manager at Costco)


  MultiOptionsSegment        3c_2. Are you able to provide proof of student status? Select any that you can obtain.
                                        a. Student Card
                                        b. Transcript
                                        c. Tuition Bill
                                        multi

  MultiOptionsSegment        4a_1. If your rent is too high to personally pay, is your family willing to sign your lease as a guarantor?
                                   This means they are legally liable for rent if you do not pay it.
                                   In order to be your guarantor, that family member has to be a Canadian Citizen or Permanent Resident.
                                     a. Yes, I have Canadian Guarantor
                                     b. No, I have International Guarantor
                                     c. No, I do not have a Guarantor

   MultiOptionsSegment        3ef_1. Do you receive any corporate, government or social assistance payments?
                                         a. ODSP - Ontario Disability Support Program
                                         b. OSAP - Ontario Student Assistance Plan
                                         c. Ontario Works - Unemployment Assistance
                                         d. Retirement Pension
                                         e. None
                                         f. Other
                                         multi
                                         skip

  MultiOptionsSegment        3d_1. What type of self employed best describes your current situation?
                                        a. Gig Job (eg. Driving Uber, parcel delivery)
                                        b. Small Business (eg. Convinence store, Etsy store)
                                        c. Professional Services (eg. Law, Accounting, Management)
                                        d. Tech Startup (eg. SaaS, hardware, non-profit, tech)
                                        e. Content Creator (eg. Vlogger, Social Media Influencer)
                                        f. Other
                                        multi

  ActionSegment              5. Thanks for your application! The property manager will review your application and be in contact shortly.


*/
