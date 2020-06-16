import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../auth/utils";

const bucketName = process.env.VIDEOS_BUCKET

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

export function getImageBucketUrl(id) {
  return `https://${bucketName}.s3.amazonaws.com/${id}`
}
