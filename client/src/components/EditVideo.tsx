import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getVideo, patchVideo } from '../api/videos-api'

interface EditVideoProps {
  match: {
    params: {
      videoId: string
    }
  }
  auth: Auth
}

interface EditVideoState {
  name: string,
  description: string
}

export class EditVideo extends React.PureComponent<
  EditVideoProps,
  EditVideoState
> {
  state: EditVideoState = {
    name: '',
    description: ''
  }

  async componentDidMount() {
    const videos = await getVideo(this.props.auth.getIdToken(), this.props.match.params.videoId)
    if(videos) {
      this.setState({...videos[0]});
    } else {
      alert('Could not load video.')
    }
  }


  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      name: event.target.value
    })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      description: event.target.value
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.name) {
        alert('Name is required')
        return
      }
      if (!this.state.description) {
        alert('Description is required')
        return
      }

      const update = {
        name: this.state.name,
        description: this.state.description
      }
      
      await patchVideo(this.props.auth.getIdToken(), this.props.match.params.videoId, update);
      alert('Video edit successful.')
    } catch (e) {
      alert('Could not edit the video' + e.message)
    } 
  }

  render() {
    return (
      <div>
        <h1>Edit Video</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
              <label>Name</label>
              <input 
                type="text"
                name="title"
                value={this.state.name}
                placeholder="Video title"
                onChange={this.handleNameChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Description</label>
              <textarea 
                name="description"
                placeholder="Describe your video"
                value={this.state.description}
                onChange={this.handleDescriptionChange}
              />
            </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        <Button
          type="submit"
        >
          Update
        </Button>
      </div>
    )
  }
}
