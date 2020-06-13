import 'source-map-support/register'
import * as middy from 'middy'
import {cors} from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { createTodo } from '../../businessLogic/todos-controller';
import { createLogger } from '../../utils/logger';
import { getTokenFromEvent } from '../../auth/utils'

const logger = createLogger('createTodoHandler');

export const createHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Create todo item')

  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const jwtToken = getTokenFromEvent(event);
  const newItem = await createTodo(newTodo, jwtToken);
  
  return {
      statusCode: 201,
      body: JSON.stringify({
          item: newItem,
      }),
  };

}

export const handler = middy(createHandler).use(cors({ credentials: true }),);  