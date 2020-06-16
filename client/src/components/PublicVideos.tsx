import dateFormat from 'dateformat'
import { History } from 'history'
//import update from 'immutability-helper'
import * as React from 'react'
import ReactPlayer from 'react-player'
import {
  Grid,
  Header,
  Loader,
  Card,
  Container
} from 'semantic-ui-react'

import { getVideos } from '../api/videos-api'
import { Video } from '../types/Video'

interface VideosProps {
  history: History
}

interface VideosState {
  videos: Video[]
  loadingVideos: boolean
}

export class PublicVideos extends React.PureComponent<VideosProps, VideosState> {
  state: VideosState = {
    videos: [],
    loadingVideos: true
  }

  async componentDidMount() {
    try {
      const videos = await getVideos()
      this.setState({
        videos,
        loadingVideos: false
      })
    } catch (e) {
      alert(`Failed to fetch videos: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">VIDEOs</Header>

        {this.renderVideos()}
      </div>
    )
  }

  renderVideos() {
    if (this.state.loadingVideos) {
      return this.renderLoading()
    }

    return this.renderVideoList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Videos
        </Loader>
      </Grid.Row>
    )
  }

  renderVideoList() {
    return (
      <Container>
        {this.state.videos.map((video, pos) => {
          <Card>
            <ReactPlayer url={video.url} size="small" wrapped />
            <Card.Content>
              <Card.Header>{video.name}</Card.Header>
              <Card.Meta>
                <span className='date'>Uploaded on {video.createdAt}</span>
              </Card.Meta>
              <Card.Description>
                {video.description}
              </Card.Description>
            </Card.Content>
          </Card>
        })}
      </Container>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
