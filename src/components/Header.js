import React from 'react'
import {
  NavLink,
  Link,
} from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { setContext } from 'apollo-link-context'

import 'semantic-ui-css/semantic.min.css';
import 'tachyons'
import '../index.css'

import { Sidebar, Segment, Button, Menu, Image, Icon } from 'semantic-ui-react'

import TempHeader from './TempHeader'

class Header extends React.Component {

  logout = (e) => {
    setContext(() => ({
      headers: {
        "Authorization": localStorage.removeItem("token"),
      }
    }))
    localStorage.removeItem("token")
    this.props.history.replace("/")
  };

  

  componentWillReceiveProps(nextProps) {
    if (this.props.location.key !== nextProps.location.key) {
      this.props.userQuery.refetch()
    }
  }

  render() {
    if (this.props.userQuery.loading) {
      return <TempHeader />
    }

    return (
      <nav className="pa3 pa4-ns">
        <NavLink
          className="link dim f6 f5-ns dib mr3 black"
          activeClassName="gray"
          exact={true}
          to="/"
          title="Feed"
        >
          Feed
        </NavLink>
        {this.props.isAuthed && <NavLink
          className="link dim f6 f5-ns dib mr3 black"
          activeClassName="gray"
          exact={true}
          to="/profile"
          title="Profile"
        >
          Profile
        </NavLink>
        }
        {!this.props.isAuthed &&
          <NavLink
            className="link dim f6 f5-ns dib mr3 black"
            activeClassName="gray"
            exact={true}
            to="/register"
            title="Register"
          >
            Register
          </NavLink>}
        {!this.props.isAuthed ?
          <NavLink
            className="link dim f6 f5-ns dib mr3 black"
            activeClassName="gray"
            exact={true}
            to="/login"
            title="Login"
          >
            Login
          </NavLink>
          :
          <NavLink
            className="link dim f6 f5-ns dib mr3 black"
            activeClassName="gray"
            exact={true}
            to="/"
            title="logout"
            onClick={this.logout}
          >
            Logout
          </NavLink>
        }

        <Link
          to="/create"
          className="f6 link dim br1 ba ph3 pv2 fr mb2 dib black"
        >
          + Create Post
          </Link>
      </nav>
    )

  }
}

const ME_QUERY = gql`
  query userQuery {
    me {
      id
      name
    }
}
`

export default compose(
  graphql(ME_QUERY, {
    name: "userQuery",
    optimisticResponse: {
      __typename: "User",
      me: {
        name: "User",
      }
    }
  }),
  withRouter)(Header)