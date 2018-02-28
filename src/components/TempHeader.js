import React from 'react'
import {
  NavLink,
  Link,
} from 'react-router-dom'

import decode from 'jwt-decode'

class TempHeader extends React.Component {
  render() {
    
    const Authed = () => {
      const token = localStorage.getItem("token");
      try {
        decode(token);
      } catch (err) {
        return false;
      }
      return true;
    };

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
        {Authed() && <NavLink
          className="link dim f6 f5-ns dib mr3 black"
          activeClassName="gray"
          exact={true}
          to="/profile"
          title="Profile"
        >
          Profile
        </NavLink>
        }
        {!Authed() &&
          <NavLink
            className="link dim f6 f5-ns dib mr3 black"
            activeClassName="gray"
            exact={true}
            to="/register"
            title="Register"
          >
            Register
          </NavLink>}
        {!Authed() ?
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

export default TempHeader