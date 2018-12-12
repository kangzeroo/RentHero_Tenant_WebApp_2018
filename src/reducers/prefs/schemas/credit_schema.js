
export const CREDIT = {

  KEY: 'CREDIT',
  TENANT_ID: '',

  GUESSED_CREDIT_SCORE: 600,

  // past credit report experience
  // PAST_CREDIT_EXP_AS: ['done once before but forgot'],                                // save as CSV string
  // PAST_CREDIT_EXP_AS_SCHEMAS: [{ id, text, value }],                                // save as stringified json
  PAST_CREDIT_EXP_AS: [],                                // save as CSV string
  PAST_CREDIT_EXP_AS_SCHEMAS: [],                                // save as stringified json

  // what the tenant guessed their credit provider was
  // PAST_CREDIT_BRANDS_AS: ['canadian credit', 'american credit'],                        // save as CSV string
  // PAST_CREDIT_BRANDS_AS_SCHEMAS: [{ id, text, value }],                                // save as stringified json
  PAST_CREDIT_BRANDS_AS: [],                        // save as CSV string
  PAST_CREDIT_BRANDS_AS_SCHEMAS: [],                                // save as stringified json

}
