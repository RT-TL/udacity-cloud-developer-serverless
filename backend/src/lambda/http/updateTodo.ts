import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
var AWS = require('aws-sdk');

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  const documentClient = new AWS.DynamoDB.DocumentClient();

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  var params = {
    TableName: todosTable,
    Key: { todoId : todoId },
    UpdateExpression: 'set name = :name, dueDate = :dueDate, done = :done',
    ExpressionAttributeValues: {
      ':name' : updatedTodo.name,
      ':dueDate' : updatedTodo.dueDate,
      ':done' : updatedTodo.done,
    }
  };


  documentClient.update(params, function(err, data) {
    if (err) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: ''
      }
    }
    else {
      return {
        statusCode: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: ''
      }
    }
  });
}