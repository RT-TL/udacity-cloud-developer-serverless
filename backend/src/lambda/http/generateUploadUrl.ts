import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'
import * as AWSXRay from 'aws-xray-sdk';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { setAttachmentUrl } from '../../businessLogic/todos-controller'
import { createLogger } from '../../utils/logger'
import { getTokenFromEvent } from '../../auth/utils'
import { getImageBucketUrl } from '../utils'

const bucketName = process.env.ATTACHMENTS_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const XAWS = AWSXRay.captureAWS(AWS);
let options: AWS.S3.Types.ClientConfiguration = { signatureVersion: 'v4', };
const logger = createLogger('generateUploadUrlHandler');
const s3bucket = new XAWS.S3(options);

if (process.env.IS_OFFLINE) {
  options = {
      ...options,
      s3ForcePathStyle: true,
      endpoint: 'localstack:4572',
  };
}

export const generateUploadUrlHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Generate upload url', event)
  const todoId = event.pathParameters.todoId
  const jwtToken = getTokenFromEvent(event)
  const imgId = uuid.v4()

  setAttachmentUrl(
    todoId,
    getImageBucketUrl(imgId),
    jwtToken,
  );

  const uploadUrl = s3bucket.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })

  return {
    statusCode: 201,
    body: JSON.stringify({
      uploadUrl
    })
  }
}

export const handler = middy(generateUploadUrlHandler).use(cors({ credentials: true }));
