import 'source-map-support/register'
import * as uuid from 'uuid'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { parseUserId, getTokenFromEvent } from '../../auth/utils';
import { TodoItem } from '../../models/TodoItem';

const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  const jwtToken = getTokenFromEvent(event);
  const userId = parseUserId(jwtToken);
  const newItem = await createTodo(newTodo, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem
    })
  }
}


export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const documentClient = new AWS.DynamoDB.DocumentClient();
  const todoId = uuid.v4()
  const item = {
    todoId: todoId,
    userId: userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    createdAt: new Date().toISOString(),
    attachmentUrl: createTodoRequest.attachmentUrl || null,
    done: false
  }
  
  await documentClient.put({
    TableName: todosTable,
    Item: item
  }).promise()

  return item
}
