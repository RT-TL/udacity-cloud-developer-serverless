import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { deleteVideo } from '../../businesslogic/videos-controller';
import { createLogger } from '../../utils/logger';
import { getTokenFromEvent } from '../../auth/utils'

const logger = createLogger('deleteVideoHandler');

export const deleteHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Delete video', event)
  const videoId = event.pathParameters.videoId
  const jwtToken = getTokenFromEvent(event)

  await deleteVideo(videoId, jwtToken)

  return {
    statusCode: 204,
    body: 'Item deleted'
  }
}

export const handler = middy(deleteHandler).use(cors({ credentials: true}),)