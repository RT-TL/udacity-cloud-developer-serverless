import { apiEndpoint } from '../config'
import { Todo } from '../types/Todo';
import { Video } from '../types/Video';
import { CreateTodoRequest } from '../types/CreateTodoRequest';
import { CreateVideoRequest } from '../types/CreateVideoRequest';
import Axios from 'axios'
import { UpdateVideoRequest } from '../types/UpdateVideoRequest';

export async function getTodos(idToken: string): Promise<Todo[]> {
  console.log('Fetching todos')

  const response = await Axios.get(`${apiEndpoint}/todos`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Todos:', response.data)
  return response.data.items
}

export async function getMyVideos(idToken: string): Promise<Video[]> {
  console.log('Fetching videos')

  const response = await Axios.get(`${apiEndpoint}/videos`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Videos:', response.data)
  return response.data.items
}

export async function createVideo(idToken: string, newVideo: CreateVideoRequest, file: Buffer): Promise<Video> {
  // Send newVideo
  const response = await Axios.post(`${apiEndpoint}/videos`,  JSON.stringify(newVideo), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })

  // Receive back the upload URL and upload video file
  uploadFile(response.data.item.uploadUrl, file)

  return response.data.item
}


export async function patchVideo(
  idToken: string,
  videoId: string,
  updatedVideo: UpdateVideoRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/videos/${videoId}`,  JSON.stringify(updatedVideo), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteVideo(
  idToken: string,
  videoId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/videos/${videoId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  todoId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/todos/${todoId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
