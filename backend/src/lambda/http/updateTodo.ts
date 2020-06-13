import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { update } from '../../businessLogic/todos-controller'
import { createLogger } from '../../utils/logger'
import { getTokenFromEvent } from '../../auth/utils'

const logger = createLogger('updateTodoHandler');

export const updateTodosHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Update a todo', event);
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  const jwtToken = getTokenFromEvent(event);
  
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  await update(todoId, updatedTodo, jwtToken);
  
  return {
    statusCode: 204,
    body: ''
  }
}

export const handler = middy(updateTodosHandler).use(cors({ credentials: true }))