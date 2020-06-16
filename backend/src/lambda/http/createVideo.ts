import 'source-map-support/register'
import * as middy from 'middy'
import {cors} from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateVideoRequest } from '../../requests/CreateVideoRequest';
import { createVideo } from '../../businesslogic/videos-controller';
import { createLogger } from '../../utils/logger';
import { getTokenFromEvent } from '../../auth/utils'
import { generateUploadUrl } from '../../businesslogic/generateUploadUrl';
const logger = createLogger('createVideoHandler');

export const createHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Create video')

  const newVideo: CreateVideoRequest = JSON.parse(event.body)
  const jwtToken = getTokenFromEvent(event);
  const newItem = await createVideo(newVideo, jwtToken);
  const uploadUrl = generateUploadUrl(newItem.videoId, jwtToken);

  return {
      statusCode: 201,
      body: JSON.stringify({
          item: {
            ...newItem,
            uploadUrl
          },
      }),
  };
}

export const handler = middy(createHandler).use(cors({ credentials: true }),);  