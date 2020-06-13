import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { deleteTodo } from '../../businessLogic/todos-controller';
import { createLogger } from '../../utils/logger';
import { getTokenFromEvent } from '../../auth/utils'

const logger = createLogger('deleteTodoHandler');

export const deleteHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Delete todo event', event)
  const todoId = event.pathParameters.todoId
  const jwtToken = getTokenFromEvent(event)

  await deleteTodo(todoId, jwtToken)

  return {
    statusCode: 204,
    body: 'Item deleted'
  }
}

export const handler = middy(deleteHandler).use(cors({ credentials: true}),)