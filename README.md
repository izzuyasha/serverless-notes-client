# serverless-notes-client
An example of client frontend for notes serverless architecture (see serverless-notes-api repository). Framework used is ReactJS with React Materialize for a Material Design look. Authentication is handled by Amazon Cognito.

# Setup:
-Download dependency : "npm install"

-In config.js, replace <BUCKET_NAME>, <API GATEWAY>, <USER_POOL_ID>, <APP_CLIENT_ID>, <AWS_REGION> and <IDENTITY_POOL_ID> with your own settings

-Create S3 bucket
 >Enable static web hosting . 
 >Build : "npm run build" . 
 >Upload to S3 : "aws s3 sync build/ s3://<BUCKET_NAME>"
 
-Create Cloudfront distribution
 >set Origin Domain Name as Endpoint from static web hosting . 
 >set Compress Objects Automatically to Yes . 
 >set Default Root Object to index.html .
 >click Create Distribution
 
-After finish, you will get Domain Name of your distribution. The app can be accessed from this Domain Name

-From here, you can host the app on the web or create hybrid apps which can still access the APIs
