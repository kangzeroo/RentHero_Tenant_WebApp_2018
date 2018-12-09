
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
      EMPLOYED_AS_SCHEMAS: [{ id, text, value }],                                          // saved as stringified JSON

      // student info
      STUDIED_AS: ['phd cs uwaterloo', 'CFA'],                                              // save as CSV string
      STUDIED_AS_SCHEMAS: [{ id, text, value }],                                           // saved as stringified JSON
      STUDYING: '',

      // self employed info
      SELF_EMPLOYED_AS: ['gig worker', 'small business']                                    // save as CSV string
      SELF_EMPLOYED_AS_SCHEMAS: [{ id, text, value }],                                     // saved as stringified JSON
      JOB_TITLES: ['chef', 'repairman'],                                                    // save as CSV string

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


  // -------------------------- DIALOG #1 --------------------------- //


  CounterSegment             1. What is your ideal price per person?

  MessageSegment             2. I will help you calculate the affordability of different rentals based on your income.
                                These details will not be shared unless you choose to put it on your rent applications.

  MultiOptionsSegment        3. Are you currently working or studying? Select all that apply.
                                        a. employed full time
                                        b. employed part time
                                        c. student
                                        d. self employed
                                        e. unemployed
                                        f. retired
                                        multi

  CounterSegment             3a/b_1. What is your monthly total income after tax from all your jobs?

  MultiTagSegment            3a/b_2. What is your job title? You can put multiple. (eg. Welder at a Machine Shop, Manager at Costco)

  MultiOptionsSegment        3a/b_2_3. Are you able to provide proof of income from your job? Select any that you can obtain.
                                        a. Paycheque from Employer
                                        b. Employment Letter with Salary
                                        c. Personal Income Tax Filing
                                        d. Bank Deposits Activity
                                        e. Other
                                        multi


  MultiOptionsSegment        3c_2. Are you able to provide proof of student status? Select any that you can obtain.
                                        a. Student Card
                                        b. Transcript
                                        c. Tuition Bill
                                        multi

  MultiOptionsSegment        3d_1. What type of self employed best describes your current situation?
                                        a. Gig Job (eg. Driving Uber, parcel delivery)
                                        b. Small Business (eg. Convinence store, Etsy store)
                                        c. Professional Services (eg. Law, Accounting, Management)
                                        d. Tech Startup (eg. SaaS, hardware, non-profit, tech)
                                        e. Content Creator (eg. Vlogger, Social Media Influencer)
                                        f. Other
                                        multi

  CounterSegment             3d_1_2. What is your total montly income from your self employment?

  MultiOptionsSegment        3d_1_2_3. Are you able to show consistent proof of income from your self employment, for at least the past 6 months?
                                     Select all options for proof of income you are able to obtain.
                                        a. Regular Payouts
                                        b. Irregular Payouts
                                        b. Personal Income Tax Filing
                                        c. Bank Deposits Activity
                                        d. None
                                        multi

  MultiOptionsSegment        3ef_1. Do you receive any corporate, government or social assistance payments?
                                        a. ODSP - Ontario Disability Support Program
                                        b. OSAP - Ontario Student Assistance Plan
                                        c. Ontario Works - Unemployment Assistance
                                        d. Retirement Pension
                                        e. Other
                                        multi

  CounterSegment             3ef_1b/c/d/e. What is your monthly total from all those assistance programmes?

  MultiCounterSegment        3ef_1b/c/d/e_2. Are you able to provide proof of income from your assistance payments?
                                        a. Bank Deposits Activity
                                        b. Official Government Document
                                        c. Regular Payouts
                                        d. I cannot provide proof
                                        multi

  MultiOptionsSegment        4. Do you receive any regular money from any other sources?
                                        a. Family Assistance
                                        b. Investments (including Trust Funds, real estate, AirBnb, Turo)
                                        c. Cash Jobs
                                        multi

  MultiOptionsSegment        4a_1. If your rent is too high to personally pay, is your family willing to sign your lease as a guarantor?
                                   This means they are legally liable for rent if you do not pay it.
                                   In order to be your guarantor, that family member has to be a Canadian Citizen or Permanent Resident.
                                     a. Yes, I have Canadian Guarantor
                                     b. No, I have International Guarantor
                                     c. No, I do not have a Guarantor
                                     d. No, I do not need a Guarantor

  CounterSegment             3e_1_2_3. What is the monthly total of your family, investments and other income sources?

  MultiCounterSegment        4. Your monthly income is seperated into regular and adhoc income.
                                Based on your answers, are these are your correct amounts? Please modify if necessary.

  MultiOptionsSegment        5. Landlords in Ontario typically expect 2 months of rent as deposit. Do you have $_____ of cash available in your bank for deposit?
                                        a. Yes, I have that right now ($_____)
                                        b. No, but I will have it in time ($_____)
                                        c. No, I am not sure if I can get that in time ($_____)

  MultiOptionsSegment        5-NoIncome-NoGuarantor. Since you have no income and no guarantor, landlords will expect a higher rent deposit as a form of security.
                                                     Are you able to get $_______ (4 months of rent) in cash?
                                        a. Yes
                                        b. No

  MultiOptionsSegment        6. Some rentals allow multiple names on the lease, but others only allow 1 name.
                                Who's name will legally be on the lease agreement? Whoever's names it is signed under is responsible for rent payment, damages and legal responsibility.
                                        a. Just Me
                                        b. Select People in my Group
                                        c. Everyone in my Group
                                        d. Undecided

  MessageSegment             6a/b_1. By signing the lease entirely in your name, any roommates that pay you rent are technically sublets. Click here to learn more about lease liability.
                                     If your own personal income is not enough to cover the entire lease, you will need to tell the landlord that your roommates are paying you.
                                     They will all need to provide proof of income too.

 MultiOptionsSegment         7. Select all the levels of education you have completed or in process of completing.
                                         a. High School
                                         b. Apprenticeship
                                         c. Undergraduate
                                         d. Graduate
                                         e. PhD
                                         f. Professional Certification
                                         g. Other
                                         multi

  InputSegment               7b/c/d/e/f. What do you study and where? (eg. Accounting at Sheraton, Nursing at Ryerson)

  MultiOptionsSegment        8. Based on your financial status, your target rent price of $_____ is (very affordable/affordable/too expensive).
                                You are spending ___% of your monthly income on rent, whereas the max recommended is 30%.
                                Would you like to change your budget or keep it?
                                        a. Change my budget
                                        b. Keep it

  CounterSegment             8a_1. Update your personal budget.

  CounterSegment             9. Sometimes the perfect place is a little bit outside your ideal budget. How flexible are you in rent if the place is right?

  ActionSegment              10. Ok, I found some matches for you. Do you want to see them now, or would you like to update your group's housing options?
                                        a. See my matches
                                        b. Update Housing Options

*/
