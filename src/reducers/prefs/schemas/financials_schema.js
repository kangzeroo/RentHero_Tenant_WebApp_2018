
export const FINANCIALS = {

    KEY: 'FINANCIALS',

    IDEAL_PER_PERSON: 0,
    DEPOSIT_CASH: 0,
    BUDGET_FLEXIBILITY: 0,

    // income calculations
    INCOME: {
      EMPLOYED: 0,
      SELF_EMPLOYED: 0,
      WELFARE: 0,
      OTHER: 0,
      REPORTED_REGULAR: 0,
      REPORTED_ADHOC: 0,
    },

    // guarantor status
    // GUARANTOR_STATUS_AS: ['canadian'],                                                    // save as CSV string
    // GUARANTOR_STATUS_AS_SCHEMAS: [{ id, text, value }],                                  // saved as stringified JSON
    GUARANTOR_STATUS_AS: [],                                                    // save as CSV string
    GUARANTOR_STATUS_AS_SCHEMAS: [],                                  // saved as stringified JSON

    // what proof of incomes can we provide?
    // PROOF_OF_INCOMES_AS: ['osap', 'paycheque'],                                           // save as CSV string
    // PROOF_OF_INCOMES_AS_SCHEMAS: [{ id, text, value }]                                   // saved as stringified JSON
    PROOF_OF_INCOMES_AS: [],                                           // save as CSV string
    PROOF_OF_INCOMES_AS_SCHEMAS: [],                                   // saved as stringified JSON

    // employment status
    // EMPLOYED_AS: ['part_time', 'full_time', 'self_employed', 'unemployed', 'student'],    // save as CSV string
    // EMPLOYED_AS_SCHEMAS: [{ id, text, value }],                                          // saved as stringified JSON
    EMPLOYED_AS: [],    // save as CSV string
    EMPLOYED_AS_SCHEMAS: [],                                          // saved as stringified JSON

    // student info
    // STUDIED_AS: ['phd cs uwaterloo', 'CFA'],                                              // save as CSV string
    // STUDIED_AS_SCHEMAS: [{ id, text, value }],                                           // saved as stringified JSON
    // STUDYING: '',
    STUDIED_AS: [],                                              // save as CSV string
    STUDIED_AS_SCHEMAS: [],                                           // saved as stringified JSON
    STUDYING: '',

    // self employed info
    // SELF_EMPLOYED_AS: ['gig worker', 'small business']                                    // save as CSV string
    // SELF_EMPLOYED_AS_SCHEMAS: [{ id, text, value }],                                     // saved as stringified JSON
    // JOB_TITLES: ['chef', 'repairman'],                                                    // save as CSV string
    SELF_EMPLOYED_AS: [],                                    // save as CSV string
    SELF_EMPLOYED_AS_SCHEMAS: [],                                     // saved as stringified JSON
    JOB_TITLES: [],                                                    // save as CSV string

    // welfare info
    // WELFARE_AS: ['odsp', 'osap'],                                                         // save as CSV string
    // WELFARE_AS_SCHEMAS: [{ id, text, value }],                                           // saved as stringified JSON
    WELFARE_AS: [],                                                         // save as CSV string
    WELFARE_AS_SCHEMAS: [],                                           // saved as stringified JSON

    // other income info
    // OTHER_INCOME_AS: ['family', 'investments'],                                           // save as CSV string
    // OTHER_INCOME_AS_SCHEMAS: [{ id, text, value }],                                      // saved as stringified JSON
    OTHER_INCOME_AS: [],                                           // save as CSV string
    OTHER_INCOME_AS_SCHEMAS: [],                                      // saved as stringified JSON

    // who legally signs the lease?
    // SIGN_LEASE_AS: ['just myself'],                                                       // save as CSV string
    // SIGN_LEASE_AS_SCHEMAS: [{ id, text, value }],                                        // saved as stringified JSON
    SIGN_LEASE_AS: [],                                                       // save as CSV string
    SIGN_LEASE_AS_SCHEMAS: [],                                        // saved as stringified JSON

  }
