import dateFormat from 'dateformat'
import { History } from 'history'
//import update from 'immutability-helper'
import * as React from 'react'
import ReactPlayer from 'react-player'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  //Input,
  //Image,
  Loader
} from 'semantic-ui-react'

import { getMyVideos } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Video } from '../types/Video'

interface VideosProps {
  auth: Auth
  history: History
}

interface VideosState {
  videos: Video[]
  newTodoName: string
  loadingTodos: boolean
}

export class PublicVideos extends React.PureComponent<VideosProps, VideosState> {
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
/*
  onVideoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newTodo = await createVideo(this.props.auth.getIdToken(), {
        name: this.state.newTodoName,
        dueDate
      })
      this.setState({
        todos: [...this.state.todos, newTodo],
        newTodoName: ''
      })
    } catch {
      alert('Todo creation failed')
    }
  }
*/
/*
  onTodoCheck = async (pos: number) => {
    try {
      const video = this.state.videos[pos]
      await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
        name: todo.name,
        dueDate: todo.dueDate,
        done: !todo.done
      })
      this.setState({
        todos: update(this.state.todos, {
          [pos]: { done: { $set: !todo.done } }
        })
      })
    } catch {
      alert('Todo deletion failed')
    }
  }
*/
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
        <Header as="h1">VIDEOs</Header>

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
          Loading VIDEOs
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
              <Grid.Column width={16} floated="right">
                {video.description}
              </Grid.Column>
              <Grid.Column width={16}>
              {video.url && (
                <ReactPlayer url={video.url} size="small" wrapped />
              )}
              </Grid.Column>
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
