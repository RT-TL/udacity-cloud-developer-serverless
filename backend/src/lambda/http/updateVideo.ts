import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { UpdateVideoRequest } from '../../requests/UpdateVideoRequest'
import { update } from '../../businesslogic/videos-controller'
import { createLogger } from '../../utils/logger'
import { getTokenFromEvent } from '../../auth/utils'

const logger = createLogger('updateVideoHandler');

export const updateVideosHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Update a video', event);
  const videoId = event.pathParameters.videoId
  const updatedVideo: UpdateVideoRequest = JSON.parse(event.body)
  const jwtToken = getTokenFromEvent(event);
  
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  await update(videoId, updatedVideo, jwtToken);
  
  return {
    statusCode: 204,
    body: ''
  }
}

export const handler = middy(updateVideosHandler).use(cors({ credentials: true }))