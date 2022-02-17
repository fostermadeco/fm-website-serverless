'use strict';

const AWS = require('aws-sdk');


module.exports.requestUploadURL = async (event, context, callback) => {
  const s3 = new AWS.S3();
  const params = JSON.parse(event.body);
  
  const s3Params = {
    Bucket: 'fm-website-apply-docs',
    Key:  params.name,
    ContentType: params.type,
    ACL: 'public-read',
  };
  
  const uploadURL = s3.getSignedUrl('putObject', s3Params);

  callback(null, {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://happy-joliot-c09cdf.netlify.app',
    },
    body: JSON.stringify({ uploadURL: uploadURL }),
  });

};
