import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { getPublicVideos } from '../../businesslogic/videos-controller';
import { createLogger } from '../../utils/logger';

const logger = createLogger('getVideosHandler');

export const getPublicVideosHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Get all private items for a current user
  logger.info('Get public videos', event);

  // Get current user
  const videos = await getPublicVideos()

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: videos
    })
  }
}

export const handler = middy(getPublicVideosHandler).use(cors({ credentials: true }),)