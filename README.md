# FM Website Serverless Application

Utilized in FM website for things like file uploads on forms. 

Built with [serverless framework](https://www.serverless.com/framework/docs). 

## Setup

```
npm install -g serverless
yarn
```

Logon to FM's AWS panel, go to IAM and get credentials for the user: `fm-website-serverless`. Add this file `~/.aws/credentials` and put this in it:

```
[default]
aws_access_key_id = {access_key_id}
aws_secret_access_key = {secret_access_key}
```

This is a [good tutorial](https://www.netlify.com/blog/2016/09/15/serverless-jam-a-serverless-framework-tutorial/) to follow to get setup. 

This is a [good tutorial](https://www.netlify.com/blog/2016/11/17/serverless-file-uploads/) for file uploads.

## Deploy

To update, just deploy it
```
serverless deploy
```

Deploys to AWS Lambda. It is helpful to test functions in the AWS browser console. 

Other basic commands [here](https://www.serverless.com/framework/docs/getting-started).