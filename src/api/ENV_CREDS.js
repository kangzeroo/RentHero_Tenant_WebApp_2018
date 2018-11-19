// This file sets our API URLS used throughout the app
// toggle these to access development versus production servers

// DEV
export const GOOGLE_CLIENT_AUTH_CREDS = {
  apiKey: 'AIzaSyCf3Suz_71Tz7i3K9V_PV1sA3mcrDJwGEM',
  clientId: '541729321219-9rhli48jm24ugu08481v6re29s259l8h.apps.googleusercontent.com',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest', 'https://www.googleapis.com/discovery/v1/apis/people/v1/rest', 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  scope: 'profile email'
}
export const TYPEFORMS = {
  basic_form_id: 'xvmqm2',
  advanced_form_id: 'f2E1MJ',
  seeking_form_id: 'ksLFy7',
}

// STAGING
// export const GOOGLE_CLIENT_AUTH_CREDS = {
//   apiKey: 'AIzaSyC5Z8IJv4dWLrO4mmCCZvSCcprYJNSKKJc',
//   clientId: '483373000213-4ibu5htlgnc3j9i8k77u333q3311h1pk.apps.googleusercontent.com',
//   discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest', 'https://www.googleapis.com/discovery/v1/apis/people/v1/rest', 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
//   scope: 'profile email'
// }
// export const TYPEFORMS = {
//   basic_form_id: 'ifU237',
//   advanced_form_id: 'ahqTtD',
//   seeking_form_id: 'XtmuhV',
// }

// PROD
// export const GOOGLE_CLIENT_AUTH_CREDS = {
//   apiKey: 'AIzaSyAEIiRo3I4zQ-7M9KluXKP5fVH9xzHzrAc',
//   clientId: '403941177278-dmkqtgevp3u06ba92jkmdapd9ii9d34d.apps.googleusercontent.com',
//   discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest', 'https://www.googleapis.com/discovery/v1/apis/people/v1/rest', 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
//   scope: 'profile email'
// }
// export const TYPEFORMS = {
//   basic_form_id: 'UfpZsV',
//   advanced_form_id: 'wYKJkp',
//   seeking_form_id: 'CAEphf',
// }
