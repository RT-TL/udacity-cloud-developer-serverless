import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Grid,
  Header,
  Card,
  Loader
} from 'semantic-ui-react'

import { deleteVideo, getMyVideos, publishVideo, unpublishVideo } from '../api/videos-api'
import Auth from '../auth/Auth'
import { Video } from '../types/Video'
import VideoCard from './VideoCard'

interface VideosProps {
  auth: Auth
  history: History
}

interface VideosState {
  videos: Video[]
  newTodoName: string
  loadingTodos: boolean
}

export class MyVideos extends React.PureComponent<VideosProps, VideosState> {
  state: VideosState = {
    videos: [],
    newTodoName: '',
    loadingTodos: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoName: event.target.value })
  }

  onEditButtonClick = (videoId: string) => {
    this.props.history.push(`/videos/${videoId}/edit`)
  }
  
  onVideoPublish = async (pos: number) => {
    try {
      this.state.videos[pos].public 
        ? await unpublishVideo(this.props.auth.getIdToken(), this.state.videos[pos].videoId)
        : await publishVideo(this.props.auth.getIdToken(), this.state.videos[pos].videoId)
    } catch {
      alert(`Video ${this.state.videos[pos].public ? 'unpublish' : 'publish'} failed`)
    }
  }
    

  onVideoDelete = async (pos: number) => {
    try {
      await deleteVideo(this.props.auth.getIdToken(), this.state.videos[pos].videoId)
      this.setState({
        videos: this.state.videos.filter(video => video.videoId != this.state.videos[pos].videoId)
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
        loadingTodos: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }


  render() {
    return (
      <div>
        <Header as="h1">My Videos</Header>

        {this.renderVideos()}
      </div>
    )
  }

  renderVideos() {
    if (this.state.loadingTodos) {
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
            <VideoCard video={video} key={video.videoId}>
              <Card.Content extra>
                <div className='ui three buttons'>
                  <Link to={`/videos/${video.videoId}/edit`}>
                    <Button basic color='blue'>
                      Edit
                    </Button>
                  </Link> 

                  <Button basic color='green' onClick={() => this.onVideoPublish(pos)}>
                    {video.public ? 'Unpublish' : 'Publish'} {video.public}
                  </Button>

                  <Button basic color='red' onClick={() => this.onVideoDelete(pos)}>
                    Delete
                  </Button>
                </div>
              </Card.Content>
            </VideoCard>
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
