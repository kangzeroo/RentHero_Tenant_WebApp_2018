

export const DOCUMENTS = {

    KEY: 'DOCUMENTS',
    TENANT_ID: '',

    LEGAL_NAME: '',
    PREFERRED_NAME: '',
    EMAIL: '',
    PHONE: '',
    GENDER: '',
    AGE: 18,

    GUARANTOR: {
      NAME: '',
      EMAIL: '',
      PHONE: '',
    },

    // the urls of the credit report
    // CREDIT_REPORT_AS: ['equifax'],                                                      // save as CSV string
    // CREDIT_REPORT_AS_SCHEMAS: [{ id, label, value: url }],                              // save as stringified json
    // CREDIT_SCORE: 710,
    CREDIT_REPORT_AS: '',                                                      // save as CSV string
    CREDIT_REPORT_AS_SCHEMAS: [],                              // save as stringified json
    CREDIT_SCORE: 600,

    // the urls of the government id
    // GOVT_ID_AS: ['drivers license'],                                                // save as CSV string
    // GOVT_ID_AS_SCHEMAS: [{ id, label, value: url }],                                // save as stringified json
    GOVT_ID_AS: '',                                                // save as CSV string
    GOVT_ID_AS_SCHEMAS: [],                                // save as stringified json

    // the urls of the student id
    // STUDENT_ID_AS: ['ryerson'],                                                      // save as CSV string
    // STUDENT_ID_AS_SCHEMAS: [{ id, label, value: url }],                              // save as stringified json
    STUDENT_ID_AS: '',                                                      // save as CSV string
    STUDENT_ID_AS_SCHEMAS: [],                              // save as stringified json

    // the urls of the background check
    // BACKGROUND_CHECK_AS: ['police'],                                                      // save as CSV string
    // BACKGROUND_CHECK_AS_SCHEMAS: [{ id, label, value: url }],                              // save as stringified json
    BACKGROUND_CHECK_AS: '',                                                      // save as CSV string
    BACKGROUND_CHECK_AS_SCHEMAS: [],                              // save as stringified json

    // insurance options
    // INSURANCE_AS: ['already have'],                                                      // save as CSV string
    // INSURANCE_AS_SCHEMAS: [{ id, label, value: url }],                              // save as stringified json
    INSURANCE_AS: '',                                                      // save as CSV string
    INSURANCE_AS_SCHEMAS: [],                              // save as stringified json
}
