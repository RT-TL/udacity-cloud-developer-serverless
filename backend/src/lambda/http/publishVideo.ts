import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { publishVideo } from '../../businesslogic/videos-controller'
import { createLogger } from '../../utils/logger'
import { getTokenFromEvent } from '../../auth/utils'

const logger = createLogger('updateVideoHandler');

export const publishVideoHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Publish video', event);
  const videoId = event.pathParameters.videoId
  const jwtToken = getTokenFromEvent(event);
  await publishVideo(videoId, jwtToken, true);
  
  return {
    statusCode: 204,
    body: ''
  }
}

export const handler = middy(publishVideoHandler).use(cors({ credentials: true }))