import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { VideoItem } from '../models/VideoItem'
import { VideoUpdate } from '../models/VideoUpdate'
const AWSXRay = require('aws-xray-sdk')

const PUBLIC_INDEX = process.env.PUBLIC_INDEX
const VIDEO_INDEX = process.env.VIDEO_INDEX
const XAWS = AWSXRay.captureAWS(AWS);

function createDynamoDBClient(): DocumentClient {
  if (process.env.IS_OFFLINE) {
      return new AWS.DynamoDB.DocumentClient({
          region: 'localhost',
          endpoint: 'localstack:4569',
          sslEnabled: false,
      });
  }
  return new XAWS.DynamoDB.DocumentClient()
}

export class VideoAccessModel {
  public constructor(
    private readonly documentClient: DocumentClient = createDynamoDBClient(),
    private readonly videosTable = process.env.VIDEOS_TABLE,
  ) { }

  public async all(): Promise<VideoItem[]> {
    const result = await this.documentClient
      .query({
        TableName: this.videosTable,
        IndexName: PUBLIC_INDEX,
        KeyConditionExpression: "#p = :public",
        ExpressionAttributeNames: { "#p": "public" },
        ExpressionAttributeValues: {
          ':public': 1,
        },
      })
      .promise();

    console.log('Public search response is ', result)
    const items = result.Items;
    return items as VideoItem[];
  }

  public async byId(videoId: string): Promise<VideoItem[]> {
    const result = await this.documentClient
    .query({
      TableName: this.videosTable,
      IndexName: VIDEO_INDEX,
      KeyConditionExpression: 'videoId = :videoId',
      ExpressionAttributeValues: {
        ':videoId': videoId
      },
    })
    .promise();

    const items = result.Items;
    return items as VideoItem[];
  }

  public async allForUser(userId: string): Promise<VideoItem[]> {
    const result = await this.documentClient
    .query({
      TableName: this.videosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    })
    .promise();

    const items = result.Items;
    return items as VideoItem[];
  }

  public async get(videoId: string, userId: string): Promise<VideoItem> {
    const result = await this.documentClient
      .query({
        TableName: this.videosTable,
        KeyConditionExpression: 'videoId = :videoId and userId = :userId',
        ExpressionAttributeValues: {
          ':videoId': videoId,
          ':userId': userId,
        },
      })
      .promise();

    const item = result.Items[0];
    return item as VideoItem;
  }

  public async create(videoItem: VideoItem): Promise<VideoItem> {
    await this.documentClient
      .put({
        TableName: this.videosTable,
        Item: videoItem,
      })
      .promise();

    return videoItem;
  }

  public async publish(videoId, userId, publish: boolean): Promise<void> {
    const status = publish ? 1 : 0
    this.documentClient.update({
      TableName: this.videosTable,
      Key: {
        userId,
        videoId
      },
      UpdateExpression: 'set #p = :public',
      ExpressionAttributeValues: {
        ':public': status
      },
      ExpressionAttributeNames: {
        '#p': 'public'
      },
      ReturnValues: 'UPDATED_NEW'  
    })
    .promise();
  }

  public async update(
    videoId: string,
    userId: string,
    videoUpdate: VideoUpdate,
  ): Promise<void> {
    this.documentClient
      .update({
        TableName: this.videosTable,
        Key: {
          userId,
          videoId
        },
        UpdateExpression:
          'set #n = :name, description = :description',
        ExpressionAttributeValues: {
          ':name': videoUpdate.name,
          ':description': videoUpdate.description
        },
        ExpressionAttributeNames: {
          '#n': 'name'
        },
        ReturnValues: 'UPDATED_NEW',
      })
      .promise();
  }

  public async setAttachmentUrl(
    videoId: string,
    userId: string,
    attachmentUrl: string,
  ): Promise<void> {
    this.documentClient
      .update({
        TableName: this.videosTable,
        Key: {
          videoId,
          userId,
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': attachmentUrl,
        },
        ReturnValues: 'UPDATED_NEW',
      })
      .promise();
  }

  public async delete(videoId: string, userId: string): Promise<void> {
    this.documentClient
      .delete({
        TableName: this.videosTable,
        Key: {
          userId,
          videoId,
        },
      })
      .promise();
  }
}