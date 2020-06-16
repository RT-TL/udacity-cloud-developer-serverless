import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { createVideo } from '../api/todos-api'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface CreateVideoProps {
  auth: Auth
}

interface CreateVideoState {
  name?: string,
  description?: string,
  file: any
  uploadState: UploadState
}

export class CreateVideo extends React.PureComponent<
  CreateVideoProps,
  CreateVideoState
> {
  state: CreateVideoState = {
    file: undefined,
    name: undefined,
    description: undefined,
    uploadState: UploadState.NoUpload
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
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
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      if (!this.state.name) {
        alert('Name should be defined')
        return
      }

      if (!this.state.description) {
        alert('Description should be provided')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const newVideo = {
        name: this.state.name,
        description: this.state.description
      }
      await createVideo(this.props.auth.getIdToken(), newVideo, this.state.file)

      alert('Video created!')
    } catch (e) {
      alert('Could not create video: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <React.Fragment>
        <h1>Create new video</h1>
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
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="video/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </React.Fragment>
    )
  }

  renderButton() {
    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }
}
