// AWS Cognito for authenticating user_id
// https://github.com/aws/amazon-cognito-identity-js

import uuid from 'uuid'
import AWS from 'aws-sdk/global'
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails, CognitoIdentityCredentials, WebIdentityCredentials } from 'amazon-cognito-identity-js';
import { staffPool, STAFF_USERPOOL_ID, generate_LANDLORD_IDENTITY_POOL_ID } from './aws-profile'
// import AWS_CognitoIdentity from 'aws-sdk/clients/cognitoidentity'
// import AWS_CognitoSyncManager from 'aws-sdk/clients/cognitosync'

export const retrieveStaffFromLocalStorage = () => {
  const p = new Promise((res, rej) => {
    const x = localStorage.getItem('login_token')
    if (x) {
      const login_token = JSON.parse(x)
      const cognitoIdentity = new AWS.CognitoIdentity()
      let loginsObj = null
      if (login_token.type === 'passwordless') {
        loginsObj = { 'renthero.auth0.com': login_token.accessToken }
      } else if (login_token.type === 'google') {
        loginsObj = { 'accounts.google.com': login_token.accessToken }
      } else if (login_token.type === 'cognito') {
        loginsObj = { [STAFF_USERPOOL_ID]: login_token.accessToken }
      }
      if (login_token) {
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: generate_LANDLORD_IDENTITY_POOL_ID(),
          Logins: login_token,
        })
        console.log(AWS.config.credentials)

        AWS.config.credentials.get(function() {
          const client = new AWS.CognitoSyncManager()

          if (AWS.config.credentials.expired) {
            rej('Expired credentials')
          } else {
            localStorage.setItem('user_id', AWS.config.credentials.data.IdentityId)
            res({
              IdentityId: AWS.config.credentials.data.IdentityId,
            })
          }
        })
      } else {
        rej('No specified Login method')
      }
    } else {
      rej('No Saved Login Token found')
    }
  })
  return p
}

export function registerGoogleLoginWithCognito(accessToken) {
  const p = new Promise((res, rej) => {
    // Check if the user logged in successfully
    console.log('registerGoogleLoginWithCognito')

    if (accessToken) {
      console.log('You are now logged in')

      const cognitoIdentity = new AWS.CognitoIdentity()
      const loginItem = {
        'accounts.google.com': accessToken
      }

      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: generate_LANDLORD_IDENTITY_POOL_ID(),
        Logins: loginItem,
      })

      // dno if we need this right now
      localStorage.setItem('login_token', JSON.stringify(loginItem))
      localStorage.setItem('header_token', JSON.stringify(accessToken))

      AWS.config.credentials.get(function() {
        const client = new AWS.CognitoSyncManager()
        console.log(AWS.config.credentials)
        console.log('yeee')
        localStorage.setItem('user_id', AWS.config.credentials.data.IdentityId)
        res({
          IdentityId: AWS.config.credentials.data.IdentityId,
        })
      })
    } else {
      console.log('there was a problem logging in!')
      rej('No access token provided')
    }
   })
  return p
}

export const signOutLandlord = () => {
	const p = new Promise((res, rej) => {
		const cognitoUser = staffPool.getCurrentUser()
		if (cognitoUser) {
			cognitoUser.signOut()
		} else {
      localStorage.clear()
    }
	})
	return p
}
