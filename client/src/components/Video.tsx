import dateFormat from 'dateformat'
import { History } from 'history'
//import update from 'immutability-helper'
import ReactPlayer from 'react-player'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
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
        {this.state.videos.map((video, pos) => {
          return (
            <Grid.Row key={video.videoId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  //onChange={() => this.onTodoCheck(pos)}
                  checked={video.public}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {video.name}
              </Grid.Column>
              <Grid.Column width={16} floated="left">
                {video.description}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(video.videoId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onVideoDelete(video.videoId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {video.url && (
                <ReactPlayer url={video.url} />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
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
