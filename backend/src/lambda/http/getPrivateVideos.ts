import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { getPrivateVideos } from '../../businesslogic/videos-controller';
import { createLogger } from '../../utils/logger';
import { getTokenFromEvent } from '../../auth/utils';

const logger = createLogger('getVideosHandler');

export const getPrivateVideosHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Get all public items from all users
  logger.info('Get videos for user', event);

  // Get current user
  const jwtToken = getTokenFromEvent(event);
  const videoId = (event.pathParameters && event.pathParameters.videoId) ? event.pathParameters.videoId : null;
  const videos = await getPrivateVideos(jwtToken, videoId)

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: videos
    })
  }
}

export const handler = middy(getPrivateVideosHandler).use(cors({ credentials: true }),)