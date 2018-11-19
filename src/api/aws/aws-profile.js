import { CognitoUserPool } from 'amazon-cognito-identity-js'
import 'amazon-cognito-js'
import AWS from 'aws-sdk/global'
import { AWS_FEDERATED_IDENTITY_ENV } from '../API_URLS'

const REGION = 'us-east-1'
// const USER_POOL_ID = 'us-east-1_YSySxXy4r'
// const CLIENT_ID = '71lguiml06s1j9i7ub1k8skirp'
const CORPORATION_USER_POOL_ID = 'us-east-1_ueLNqdv7l'
const CORPORATION_CLIENT_ID = 'v658686di26fa8pfjtvj1669i'

AWS.config.update({
	region: REGION
})
// const studentData = {
//   UserPoolId: USER_POOL_ID,
//   ClientId: CLIENT_ID
// }

const staffData = {
    UserPoolId: CORPORATION_USER_POOL_ID,
    ClientId: CORPORATION_CLIENT_ID
}

// export const TENANT_KMS_ID = '2157ccf4-5dc3-442e-b49a-02e6077eadcb'
// export const ENCRYPTED_COMMUNICATIONS_KMS_ID = '10212ee5-c669-4bb0-95e7-2145a32e3463'

export const BUCKET_NAME = 'renthero-images'
// export const ENCRYPTED_BUCKET_NAME = 'rentburrow3-tenant-images'
// export const ENCRYPTED_BUCKET_NAME = 'test-encrypted-images-rentburrow'

export const staffPool = new CognitoUserPool(staffData);
export const STAFF_USERPOOL_ID = `cognito-idp.${REGION}.amazonaws.com/${CORPORATION_USER_POOL_ID}`

// export const studentPool = new CognitoUserPool(studentData);
// export const STUDENT_USERPOOL_ID = `cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`

export const generate_LANDLORD_IDENTITY_POOL_ID = () => {
	return AWS_FEDERATED_IDENTITY_ENV
}
