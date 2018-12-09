
/*

  referenceDetails = {
      tenant_id: 'abc123',
      reference_id: 720,
      name: 'Equifax',
      relationship: 's3_url',
      phone: '',
      email: '',
      reference_text: 'Jake is awesome because...',
      reference_files: [{ type: 'reference_letter', label: 'For Jake', url: 'https://' }]
  }


  // -------------------------- DIALOG # --------------------------- //


  MultiOptionsSegment             1. Hello _____, Jake has selected you to be one of his references for his rental application.
                                     All you need to do is write a brief description on what makes Jake a good person to rent to.
                                     You may be called by a landlord to verify details.
                                     Are you ok with this?
                                            - Yes
                                            - No

  InputSegment                    2. What is your legal name?

  InputSegment                    3. What is your relationship to Jake? (placeholder if what Jake wrote)

  InputSegment                    4. Would you prefer to write a reference here, or upload a PDF reference? PDFs are great if you are able to add a company letterhead.
                                            a. Write it here
                                            b. Upload a PDF

  InputSegment                    4a. What makes Jake a good tenant to rent to?

  FileUploadSegment               4b. Upload your reference letter here, talking about why Jake is a good tenant to rent to.

  InputSegment                    5. What is the best phone number to reach you at?

  InputSegment                    6. What is the best email to reach you at?

  MessageSegment                  7. Thanks so much for helping with Jake's rental application. You can always come back to this link to update it.

*/
