'use strict';

const AWS = require('aws-sdk');

module.exports.requestUploadURL = async (event, context, callback) => {
  const s3 = new AWS.S3();
  const params = JSON.parse(event.body);
  
  const s3Params = {
    Bucket: 'fm-website-apply-docs',
    Key:  params.name,
    ContentType: params.type,
    ACL: 'private',
  };
  
  const uploadURL = s3.getSignedUrl('putObject', s3Params);

  callback(null, {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ uploadURL: uploadURL }),
  });

};

// function managed in AWS, not here, but for reference
// module.exports.authAccess = async (event, context, callback) => {
//   // Get request and request headers
//   const request = event.Records[0].cf.request;
//   const headers = request.headers;

//   // Configure authentication
//   const authUser = 'USER';
//   const authPass = 'PASS';

//   // Construct the Basic Auth string
//   const authString = 'Basic ' + new Buffer(authUser + ':' + authPass).toString('base64');

//   // Require Basic authentication
//   if (typeof headers.authorization == 'undefined' || headers.authorization[0].value != authString) {
//       const body = 'Unauthorized';
//       const response = {
//           status: '401',
//           statusDescription: 'Unauthorized',
//           body: body,
//           headers: {
//               'www-authenticate': [{key: 'WWW-Authenticate', value:'Basic'}]
//           },
//       };
//       callback(null, response);
//   }

//   // Continue request processing if authentication passed
//   callback(null, request);
// };