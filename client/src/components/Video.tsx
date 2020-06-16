import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import VideoCard from './VideoCard'

import {
  Grid,
  Header,
  Loader
} from 'semantic-ui-react'

import { deleteVideo, getMyVideos } from '../api/videos-api'
import Auth from '../auth/Auth'
import { Video } from '../types/Video'

interface VideosProps {
  auth: Auth
  history: History
}

interface VideosState {
  videos: Video[]
  loadingVideos: boolean
}

export class Videos extends React.PureComponent<VideosProps, VideosState> {
  state: VideosState = {
    videos: [],
    loadingVideos: true
  }

  onEditButtonClick = (videoId: string) => {
    this.props.history.push(`/videos/${videoId}/edit`)
  }

  onVideoDelete = async (videoId: string) => {
    try {
      await deleteVideo(this.props.auth.getIdToken(), videoId)
      this.setState({
        videos: this.state.videos.filter(video => video.videoId != videoId)
      })
    } catch {
      alert('Video deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const videos = await getMyVideos(this.props.auth.getIdToken())
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
      <Grid padded>
        {this.state.videos.map((video) => {
          return (
            <VideoCard video={video} />
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
