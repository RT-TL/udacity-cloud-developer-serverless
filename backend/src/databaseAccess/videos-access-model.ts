import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { VideoItem } from '../models/VideoItem';
import { VideoUpdate } from '../models/VideoUpdate';

function createDynamoDBClient(): DocumentClient {
  if (process.env.IS_OFFLINE) {
      return new AWS.DynamoDB.DocumentClient({
          region: 'localhost',
          endpoint: 'localstack:4569',
          sslEnabled: false,
      });
  }
  return new AWS.DynamoDB.DocumentClient();
}

export class VideoAccessModel {
  public constructor(
    private readonly documentClient: DocumentClient = createDynamoDBClient(),
    private readonly videosTable = process.env.VIDEOS_TABLE,
  ) { }

  public async all(userId?: string): Promise<VideoItem[]> {
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

  public async update(
    videoId: string,
    createdAt: string,
    videoUpdate: VideoUpdate,
  ): Promise<void> {
    this.documentClient
      .update({
        TableName: this.videosTable,
        Key: {
          videoId,
          createdAt,
        },
        UpdateExpression:
          'set #n = :name, public = :public, description = :description',
        ExpressionAttributeValues: {
          ':name': videoUpdate.name,
          ':description': videoUpdate.description,
          ':public': videoUpdate.public,
        },
        ExpressionAttributeNames: {
          '#n': 'name', 
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