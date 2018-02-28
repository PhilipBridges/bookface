import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom'

import FeedPage from './FeedPage'
import CreatePage from './CreatePage'
import DetailPage from './DetailPage'
import Register from './Register'
import Login from './Login'
import Profile from './Profile'
import MessageForm from './MessageForm'

import PublicRoute from './PublicRoute'

import 'semantic-ui-css/semantic.min.css';
import 'tachyons'
import '../index.css'

export default () =>
  <Router>
    <Switch>
      <PublicRoute exact path="/" component={FeedPage} />
      <PublicRoute path="/create" component={CreatePage} />
      <PublicRoute path="/post/:id" component={DetailPage} />
      <PublicRoute path="/register" component={Register} />
      <PublicRoute path="/login" component={Login} />
      <PublicRoute path="/profile" component={Profile} />
      <PublicRoute path="/profile/message" component={MessageForm} />
    </Switch>
  </Router>