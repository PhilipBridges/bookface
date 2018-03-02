import React from 'react'
import { withRouter } from 'react-router-dom'
import { graphql, compose, withApollo } from 'react-apollo'
import gql from 'graphql-tag'

import { setContext } from 'apollo-link-context'

import 'semantic-ui-css/semantic.min.css';
import 'tachyons'
import '../index.css'

import { Menu } from 'semantic-ui-react'

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'home',
    }
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name }, this.props.history.push(`${name}`))

  logout = async (e) => {
    setContext(() => ({
      headers: {
        "Authorization": localStorage.removeItem("token"),
      }
    }))
    localStorage.removeItem("token")
    this.props.client.resetStore()
    this.props.history.replace("/")
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.location.key !== nextProps.location.key && this.props.userQuery) {
      this.props.userQuery.refetch()
    }
  }

  render() {
    const authed = localStorage.getItem("token")
    const { activeItem } = this.state

    return (
      <Menu inverted>
        <Menu.Item name='/' active={activeItem === 'home'} onClick={this.handleItemClick}>Home</Menu.Item>
        {authed
          ?
          <React.Fragment>
            <Menu.Item name='messages' active={activeItem === 'messages'} onClick={this.handleItemClick} />
            <Menu.Item name='friends' active={activeItem === 'friends'} onClick={this.handleItemClick} />
            <Menu.Item name='profile' active={activeItem === 'profile'} onClick={this.handleItemClick}>Profile</Menu.Item>
            <Menu.Item name='logout' active={activeItem === 'logout'} onClick={this.logout} />
          </React.Fragment>
          :
          <React.Fragment>
            <Menu.Item name='register' active={activeItem === 'register'} onClick={this.handleItemClick} />
            <Menu.Item name='login' active={activeItem === 'login'} onClick={this.handleItemClick} />
          </React.Fragment>
        }
      </Menu>
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
  withApollo,
  graphql(ME_QUERY, {
    name: "userQuery",
    options: {
      fetchPolicy: "network-only",
    },
    skip: (ownProps) => !ownProps.isAuthed,
  }),
  withRouter)(Header)