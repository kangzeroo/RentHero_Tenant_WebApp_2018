// This file sets our API URLS used throughout the app
// toggle these to access development versus production servers

// DEV
// export const ACCOUNTS_MICROSERVICE = 'https://localhost:7101'
export const AWS_FEDERATED_IDENTITY_ENV = 'us-east-1:11bcd4bb-a4cf-4eec-8bef-6c49488264cb'

// DEV
export const ACCOUNTS_MICROSERVICE = 'https://93d22e80.ngrok.io'
export const GET_LISTINGS_ENDPOINT = 'https://1w7f6p6d9c.execute-api.us-east-1.amazonaws.com/development/get-listings'
export const GET_LISTING_BY_REF_ENDPOINT = 'https://1w7f6p6d9c.execute-api.us-east-1.amazonaws.com/development/get-listings-by-ref'
export const GET_LISTING_BY_REFS_ENDPOINT = 'https://1w7f6p6d9c.execute-api.us-east-1.amazonaws.com/development/get-listings-by-refs'
export const GET_HEATMAP_ENDPOINT = 'https://1w7f6p6d9c.execute-api.us-east-1.amazonaws.com/development/get-heat-map'
export const UPDATE_TENANT_PROFILE = 'https://4htchmg8u3.execute-api.us-east-1.amazonaws.com/development/save-tenant-prefs'
export const GET_TENANT_PROFILE = 'https://4htchmg8u3.execute-api.us-east-1.amazonaws.com/development/get-tenant-prefs'

// PROD
// export const GET_LISTINGS_ENDPOINT = 'https://1w7f6p6d9c.execute-api.us-east-1.amazonaws.com/production/get-listings'
// export const GET_LISTING_BY_REF_ENDPOINT = 'https://1w7f6p6d9c.execute-api.us-east-1.amazonaws.com/production/get-listings-by-ref'
// export const GET_LISTING_BY_REFS_ENDPOINT = 'https://1w7f6p6d9c.execute-api.us-east-1.amazonaws.com/production/get-listings-by-refs'
// export const GET_HEATMAP_ENDPOINT = 'https://1w7f6p6d9c.execute-api.us-east-1.amazonaws.com/production/get-heat-map'
// export const UPDATE_TENANT_PROFILE = 'https://4htchmg8u3.execute-api.us-east-1.amazonaws.com/production/save-tenant-prefs'
// export const GET_TENANT_PROFILE = 'https://4htchmg8u3.execute-api.us-east-1.amazonaws.com/production/get-tenant-prefs'
