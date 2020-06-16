import * as uuid from 'uuid';

import { VideoItem } from '../models/VideoItem';
import { VideoAccessModel } from '../databaseAccess/videos-access-model';
import { CreateVideoRequest } from '../requests/CreateVideoRequest';
import { UpdateVideoRequest } from '../requests/UpdateVideoRequest';
import { parseUserId } from '../auth/utils';
import { getImageBucketUrl } from '../lambda/utils';

const videoAccessModel = new VideoAccessModel();

export async function getPrivateVideos(jwtToken: string, videoId?: string): Promise<VideoItem[]> {
    const userId = parseUserId(jwtToken);

    if(videoId) return videoAccessModel.byId(videoId)
    return videoAccessModel.allForUser(userId);
}

export async function getPublicVideos(): Promise<VideoItem[]> {
    return videoAccessModel.all();
}

export async function publishVideo(videoId: string, jwtToken: string, publish: boolean): Promise<void> {
    const userId = parseUserId(jwtToken);
    const video = await videoAccessModel.get(videoId, userId);
    if(!video) {
        throw new Error(`Video ${videoId} not found for user ${userId}`)
    }
    return videoAccessModel.publish(videoId, userId, publish);
}

export async function createVideo(
    createTodoRequest: CreateVideoRequest,
    jwtToken: string,
): Promise<VideoItem> {
    const itemId = uuid.v4();
    const userId = parseUserId(jwtToken);

    return videoAccessModel.create({
        videoId: itemId,
        userId: userId,
        name: createTodoRequest.name,
        description: createTodoRequest.description,
        createdAt: new Date().toISOString(),
        public: 0,
        url: getImageBucketUrl(itemId)
    });
}

export async function update(
    videoId: string,
    updateVideoRequest: UpdateVideoRequest,
    jwtToken: string,
): Promise<void> {
    const userId = parseUserId(jwtToken);
    const video = await videoAccessModel.get(videoId, userId);
    videoAccessModel.update(video.videoId, userId, updateVideoRequest);
}

export async function deleteVideo(
    videoId: string,
    jwtToken: string,
): Promise<void> {
    const userId = parseUserId(jwtToken);
    const video = await videoAccessModel.get(videoId, userId);

    await videoAccessModel.delete(video.videoId, video.userId);
}

export async function setAttachmentUrl(
    videoId: string,
    attachmentUrl: string,
    jwtToken: string,
): Promise<void> {
    // Todo: use this function only as helper with create new video, upload file immediately
    const userId = parseUserId(jwtToken);
    const video = await videoAccessModel.get(videoId, userId);

    videoAccessModel.setAttachmentUrl(video.videoId, video.userId, attachmentUrl);
}