import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
const docClient = new XAWS.DynamoDB.DocumentClient()

import { parseUserId, getTokenFromEvent } from '../../auth/utils';

const todosTable = process.env.TODOS_TABLE
const todosIdIndex = process.env.TODOS_ID_INDEX

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user

  // Get current user
  console.log('Processing event: ', event)
  const jwtToken = getTokenFromEvent(event);
  const userId = parseUserId(jwtToken);

  if (!userId) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'No user logged in.'
      })
    }
  }

  // Get all todos
  const todos = await getTodosPerUser(userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: todos
    })
  }
}



async function getTodosPerUser(userId: string) {
  const result = await docClient.query({
    TableName: todosTable,
    indexName: todosIdIndex,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    },
    ScanIndexForward: false
  }).promise()

  return result.Items
}
