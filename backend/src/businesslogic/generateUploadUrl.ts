import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk';
import { setAttachmentUrl } from './videos-controller'
import { createLogger } from '../utils/logger'
import { getImageBucketUrl } from '../lambda/utils'

const bucketName = process.env.VIDEOS_BUCKET
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

export const generateUploadUrl = (videoId: string, jwtToken: string) => {
  logger.info('Generate upload url', videoId)

  setAttachmentUrl(
    videoId,
    getImageBucketUrl(videoId),
    jwtToken,
  );

  const uploadUrl = s3bucket.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: videoId,
    Expires: parseInt(urlExpiration)
  })

  return uploadUrl
}