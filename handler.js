'use strict';

const AWS = require('aws-sdk');
const Contentful = require('contentful');
const Algoliasearch = require('algoliasearch');

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
      'Access-Control-Allow-Origin': 'https://happy-joliot-c09cdf.netlify.app',
    },
    body: JSON.stringify({ uploadURL: uploadURL }),
  });

};

module.exports.algoliaJournal = async (event, context, callback) => {
  console.log({event, context, callback});
  const body = JSON.parse(event.body);
  const { id } = body.fields.journalPost['en-US'].sys;

  const { createClient } = Contentful;
  const {
    FM_CONTENTFUL_SPACE_ID: space,
    FM_CONTENTFUL_ACCESS_TOKEN: accessToken
  } = process.env;

  const { ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY, ALGOLIA_INDEX } = process.env;
  const algoliaClient = Algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
  const index = algoliaClient.initIndex(ALGOLIA_INDEX);
  
  const ctfClient = createClient({
    space,
    accessToken
  });

  console.log(ALGOLIA_INDEX, id);
  console.log({index});

  try {
    const entry = await ctfClient.getEntry(id);

    console.log({entry});
    console.log(JSON.stringify(entry.fields.image));

    const entryForAlgolia = {
      objectID: body.sys.id,
      url: '/test',
      title: body.fields.name['en-US'],
      summary: entry.fields.summary,
      body: '',
      author: `${entry.fields.author.fields.firstName} ${entry.fields.author.fields.lastName}`,
      image: `https:${entry.fields.image.fields.media.fields.file.url}`,
      ...entry.fields.technologies && { technologies: entry.fields.technologies.map(t => t.fields.title) },
      ...entry.fields.solutions && { solutions: entry.fields.solutions.map(t => t.fields.title) },
      ...entry.fields.services && { services: entry.fields.services.map(t => t.fields.title) },
      ...entry.fields.companyTopics && { companyTopics: entry.fields.companyTopics.map(t => t.fields.title) },
    };

    const indexedContent = await index.saveObject(entryForAlgolia);

    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://api.contentful.com',
      },
      body: JSON.stringify({ 'indexedContent': indexedContent })
    })
  } catch(e) {
    console.error(e);
    callback(null, {
      statusCode: 502
    });
  }
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