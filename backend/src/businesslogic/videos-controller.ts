import * as uuid from 'uuid';

import { VideoItem } from '../models/VideoItem';
import { VideoAccessModel } from '../databaseAccess/videos-access-model';
import { CreateVideoRequest } from '../requests/CreateVideoRequest';
import { UpdateVideoRequest } from '../requests/UpdateVideoRequest';
import { parseUserId } from '../auth/utils';
import { getImageBucketUrl } from '../lambda/utils';

const videoAccessModel = new VideoAccessModel();

export async function getPrivateVideos(jwtToken: string): Promise<VideoItem[]> {
    return videoAccessModel.all();
}

export async function getPublicVideos(jwtToken: string): Promise<VideoItem[]> {
    const userId = parseUserId(jwtToken);
    return videoAccessModel.all(userId);
}

export async function createVideo(
    createTodoRequest: CreateVideoRequest,
    jwtToken: string,
): Promise<VideoItem> {
    const itemId = uuid.v4();
    const userId = parseUserId(jwtToken);
// To do: add file
    return videoAccessModel.create({
        videoId: itemId,
        userId: userId,
        name: createTodoRequest.name,
        description: createTodoRequest.description,
        createdAt: new Date().toISOString(),
        public: false,
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

    videoAccessModel.update(video.videoId, video.createdAt, updateVideoRequest);
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