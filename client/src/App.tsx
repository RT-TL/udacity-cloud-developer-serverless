import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Menu, Segment } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { CreateVideo } from './components/CreateVideo'
import { EditVideo } from './components/EditVideo'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { MyVideos } from './components/MyVideos'
import { PublicVideos } from './components/PublicVideos'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div>
        <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  {this.generateMenu()}

                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }

  generateMenu() {
    return (
      <Menu>
        <Menu.Item name="home">
          <Link to="/">Home</Link> 
        </Menu.Item>
        <Menu.Item name="home">
          <Link to="/myVideos">My Videos</Link> 
        </Menu.Item>
        <Menu.Item name="create">
          <Link to="/createVideo">Create Video</Link>
        </Menu.Item>

        <Menu.Menu position="right">{this.logInLogOutButton()}</Menu.Menu>
      </Menu>
    )
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return (
        <React.Fragment>
          <Switch>
            <Route
            path="/"
            exact
            render={props => {
              return <PublicVideos {...props} />
            }}
            />
            <Route path="/" render={props => {
            return <LogIn auth={this.props.auth} />
          }}/>
          </Switch>
        </React.Fragment>
        )
    }
console.log(this.props);
    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <PublicVideos {...props} />
          }}
        />

      <Route
        path="/myvideos"
        exact
        render={props => {
          return <MyVideos {...props} auth={this.props.auth} />
        }}
      />

        <Route
          path="/createVideo"
          exact
          render={props => {
            return <CreateVideo {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/videos/:videoId/edit"
          exact
          render={props => {
            return <EditVideo {...props} auth={this.props.auth} />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
