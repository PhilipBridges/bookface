import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import FeedPage from './FeedPage'
import CreatePage from './CreatePage'
import DetailPage from './DetailPage'
import Register from './Register'
import Login from './Login'
import Profile from './Profile'
import MessageForm from './MessageForm'

import PrivateRoute from './PrivateRoute'
import Header from './Header'
import decode from 'jwt-decode'

import 'semantic-ui-css/semantic.min.css';
import 'tachyons'
import '../index.css'

const Authed = () => {
  const token = localStorage.getItem("token")
  try {
    decode(token);
  } catch (err) {
    return false;
  }
  return true;
};

export default () =>
  <Router>
    <div>
      <Header isAuthed={Authed()}/>
      <Switch>
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <PrivateRoute exact path="/" component={FeedPage} />
        <PrivateRoute path="/create" component={CreatePage} />
        <PrivateRoute path="/post/:id" component={DetailPage} />
        <PrivateRoute path="/profile" component={Profile} />
        <PrivateRoute path="/profile/message" component={MessageForm} />
      </Switch>
    </div>
  </Router>