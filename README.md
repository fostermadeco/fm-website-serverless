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

Deploys to AWS. It is helpful to test lambda functions in the AWS browser console. 

Other basic commands [here](https://www.serverless.com/framework/docs/getting-started).

## What this does

This repo includes setup of an s3 bucket to store uploaded files from the website, like docs that accompany applications. The files are uploaded via signed url. This repo also includes the creation of a CloudFront delivery network for the documents in the s3 bucket. [ref](https://hackernoon.com/how-to-configure-cloudfront-using-cloudformation-template-2c263u56)

The files are protected via a lambda function that provides basic auth access. This function was created manually in the aws console. In a perfect world, this repo would also faciliate the creation of that, but ran out of time (not currently working).

If the process stops working, you can `serverless remove` and then you need to create the lambda function again manually. 