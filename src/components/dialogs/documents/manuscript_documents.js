
/*

  DOCUMENTS = {

      TENANT_ID: 'abc123',
      KEY: 'DOCUMENTS',
      LEGAL_NAME: 'Jose Sanchez Rodriguez',
      PREFERRED_NAME: 'Joe',
      EMAIL: 'tenant@gmail.com',
      PHONE: '6474564564',
      GENDER: 'Male',
      AGE: 22,

      GUARANTOR: {
        NAME: '',
        EMAIL: '',
        PHONE: '',
      },

      // the urls of the credit report
      CREDIT_REPORT_AS: ['equifax'],                                                      // save as CSV string
      CREDIT_REPORT_AS_SCHEMAS: [{ id, label, value: url }],                              // save as stringified json
      CREDIT_SCORE: 710,

      // the urls of the government id
      GOVT_ID_AS: ['drivers license'],                                                // save as CSV string
      GOVT_ID_AS_SCHEMAS: [{ id, label, value: url }],                                // save as stringified json

      // the urls of the student id
      STUDENT_ID_AS: ['ryerson'],                                                      // save as CSV string
      STUDENT_ID_AS_SCHEMAS: [{ id, label, value: url }],                              // save as stringified json

      // the urls of the background check
      BACKGROUND_CHECK_AS: ['police'],                                                      // save as CSV string
      BACKGROUND_CHECK_AS_SCHEMAS: [{ id, label, value: url }],                              // save as stringified json

      // insurance options
      INSURANCE_AS: ['already have'],                                                      // save as CSV string
      INSURANCE_AS_SCHEMAS: [{ id, label, value: url }],                              // save as stringified json

}


  // -------------------------- DIALOG #8 --------------------------- //


  MessageSegment             1. Let's update your contact info and any documents you may have.

  InputSegment               2. What is your legal name?

  InputSegment               2. What is your preferred name?

  InputSegment               2. What is the best email to contact you at?

  InputSegment               3. What is the best phone to contact you at?

  MultiOptionsSegment        4. What is your gender?

  CounterSegment             5. What is your age?

  InputSegment               6. What is your guarantor's name?

  InputSegment               7. What is your guarantor's phone?

  InputSegment               8. What is your guarantor's email?

  ShareUrlSegment            9. Share this link with your guarantor for them to upload the necessary documents.
                                Or go to this link yourself if you are doing it for them.

  CounterSegment         10. What is your official Equifax credit score?

  FileUploadSegment          11. Upload your official Equifax credit report here.

  FileUploadSegment          12. Upload your valid government ID here.

  FileUploadSegment          13. Upload your proof of student status here.

  FileUploadSegment          14. Upload your background check here.

  ShareUrlSegment            15. Share this link with your references for them to easily contribute to your rent application.

  MultiOptionsSegment        16. Do you have renter's insurance?
                                        a. yes
                                        b. not yet

*/
