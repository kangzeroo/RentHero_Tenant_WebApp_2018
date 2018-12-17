// AWS Cognito for authenticating user_id
// https://github.com/aws/amazon-cognito-identity-js

import uuid from 'uuid'
import AWS from 'aws-sdk/global'
// import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails, CognitoIdentityCredentials, WebIdentityCredentials } from 'amazon-cognito-identity-js';
import 'amazon-cognito-js'
import { staffPool, STAFF_USERPOOL_ID, generate_TENANT_IDENTITY_POOL_ID } from './aws-profile'
// import AWS_CognitoIdentity from 'aws-sdk/clients/cognitoidentity'
// import AWS_CognitoSyncManager from 'aws-sdk/clients/cognitosync'
import { AWS_FEDERATED_IDENTITY_ENV } from '../ENV_CREDS'

AWS.config.update({
	region: 'us-east-1'
})

export const retrieveTenantFromLocalStorage = () => {
  const p = new Promise((res, rej) => {
    // const x = localStorage.getItem('renthero_tenant_token')
		const x = localStorage.getItem('userObj')
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
      } else if (login_token.type === 'unauth') {
				loginsObj = { 'www.amazon.com': login_token.accessToken }
			}

      if (login_token) {
				console.log(loginsObj)
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: generate_TENANT_IDENTITY_POOL_ID(),
          Logins: loginsObj,
        })
				AWS.config.credentials.refresh(() => {
					console.log(AWS.config.credentials)

					AWS.config.credentials.get(function() {
						const client = new AWS.CognitoSyncManager()

						if (AWS.config.credentials.expired) {
							rej('Expired credentials')
						} else {
							console.log('LOGGED IN')
							localStorage.setItem('tenant_id', AWS.config.credentials.data.IdentityId)
							res({
								IdentityId: AWS.config.credentials.data.IdentityId,
							})
						}
					})
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
        IdentityPoolId: generate_TENANT_IDENTITY_POOL_ID(),
        Logins: loginItem,
      })
      console.log(AWS.config.credentials)

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

export function registerPasswordlessAuth0WithCognito(id_token){
	const p = new Promise((res, rej) => {
		// console.log('registerFacebookLoginWithCognito')
		// console.log(response)
		// Check if the user logged in successfully.
		  if (id_token) {

		    // console.log('You are now logged in.');
		    const cognitoidentity = new AWS.CognitoIdentity();

				const loginItem = {
					 'renthero.auth0.com': id_token
				}

				const localLoginItem = {
					 accessToken: id_token
				}

		    // Add the Facebook access token to the Cognito credentials login map.
		    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		      IdentityPoolId: generate_TENANT_IDENTITY_POOL_ID(),
		      Logins: loginItem,
		    })

        AWS.config.credentials.refresh(() => {
          console.log(AWS.config.credentials)
          localStorage.setItem('userObj', JSON.stringify({ type: 'passwordless', ...localLoginItem, }))
          localStorage.setItem('header_token', JSON.stringify(id_token))
          // AWS Cognito Sync to sync Facebook
          AWS.config.credentials.get(function(err) {
            console.log(err)
            const client = new AWS.CognitoSyncManager();

              console.log(AWS.config.credentials)
              if (AWS.config.credentials.data && AWS.config.credentials.data.IdentityId) {
								console.log('LOGGED IN')
                localStorage.setItem('tenant_id', AWS.config.credentials.data.IdentityId)
                res({
                  IdentityId: AWS.config.credentials.data.IdentityId
                })
              } else {
                res({
                  IdentityId: 'UNSIGNED'
                })
              }

          })
        })


		  } else {
		    // console.log('There was a problem logging you in.');
				rej('No access token found')
		  }
	})
	return p
}

export const unauthRoleTenant = () => {
	const p = new Promise((res, rej) => {
		// Add the UNAUTHENTICATED_TENANT user to the Cognito credentials login map.
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: generate_TENANT_IDENTITY_POOL_ID()
		})
		// AWS Cognito Sync to sync Facebook
		AWS.config.credentials.get(() => {
			const client = new AWS.CognitoSyncManager()

			if (AWS.config.credentials.expired) {
				localStorage.removeItem('userObj')
			}

			console.log(AWS.config.credentials)

			const userObj = {
				type: 'unauth',
				accessToken: AWS.config.credentials.sessionToken,
				// tenant_id: AWS.config.credentials.data.IdentityId,
			}

			localStorage.setItem('userObj', JSON.stringify(userObj))
			// localStorage.setItem('unauth_token', AWS.config.credentials.sessionToken)
			localStorage.setItem('tenant_id', AWS.config.credentials.data.IdentityId)
			res({
				tenant_id: AWS.config.credentials.data.IdentityId,
				unauthRoleStudent: true,
			})
		})
		// res({
		// 	id: 'COGNITO_UNAUTH_USER'
		// })
	})
	return p
}


export const signOutTenant = () => {
	const p = new Promise((res, rej) => {
		localStorage.removeItem('email')
		localStorage.removeItem('phone')
		localStorage.removeItem('userObj')
		localStorage.removeItem('tenant_id')
		localStorage.removeItem('header_token')
	})
	return p
}
