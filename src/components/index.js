import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

import FeedPage from './FeedPage'
import CreatePage from './CreatePage'
import DetailPage from './DetailPage'
import Register from './Register'
import Login from './Login'
import Inbox from './Inbox'
import Profile from './Profile'

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
      {Authed() ? <Header isAuthed={Authed()} /> : null}
      <Switch>
        <Route path="/register" component={Register} />
        <Route exact path="/login" render={() => (
          Authed() ? (
            <Redirect to="/"/>
          ) : (
            <Login/>
          )
        )}/>
        <PrivateRoute exact path="/" component={FeedPage} />
        <PrivateRoute path="/create" component={CreatePage} />
        <PrivateRoute path="/inbox" component={Inbox} />
        <PrivateRoute path="/post/:id" component={DetailPage} />
        <PrivateRoute exact path="/profile/:id" component={Profile} />
      </Switch>
    </div>
  </Router>