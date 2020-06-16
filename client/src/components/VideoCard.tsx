import * as React from 'react'

import {
  Card
} from 'semantic-ui-react'

import { Video } from '../types/Video'

interface Props {
    video: Video,
    children?: any
}

const VideoCard = ({video, children}:Props) => {
    return (
        <Card>
            <video width="100%" height="auto" controls>
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <Card.Content>
                <Card.Header>{video.name}</Card.Header>
                <Card.Meta>
                <span className='date'>Uploaded on {video.createdAt}</span>
                </Card.Meta>
                <Card.Description>
                {video.description}
                </Card.Description>
                <Card.Content extra>
                    {children}
                </Card.Content>
            </Card.Content>
        </Card>
    )
}

export default VideoCard