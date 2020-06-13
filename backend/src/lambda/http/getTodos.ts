import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { getAllTodos } from '../../businessLogic/todos-controller';
import { createLogger } from '../../utils/logger';
import { getTokenFromEvent } from '../../auth/utils';

const logger = createLogger('getTodosHandler');

export const getTodosHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  logger.info('Get todos for user', event);

  // Get current user
  const jwtToken = getTokenFromEvent(event);
  const todos = await getAllTodos(jwtToken)

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: todos
    })
  }
}

export const handler = middy(getTodosHandler).use(cors({ credentials: true }),)