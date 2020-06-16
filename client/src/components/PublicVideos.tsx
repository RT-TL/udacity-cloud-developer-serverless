import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
  Header,
  Loader,
  Card,
  Grid,
  Container
} from 'semantic-ui-react'

import { getVideos } from '../api/videos-api'
import { Video } from '../types/Video'
import VideoCard from './VideoCard';

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
      console.log('Received videos:',videos)
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
        <Header as="h1">Public Videos</Header>

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
    return(
      <Container>
        {this.state.videos.map((video) => {
          return ( 
            <VideoCard video={video} />
          )
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
