import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

import Friend from './Friend'
import Loading from './Loading'

import 'tachyons'

class FriendBar extends Component {
  state = {
    friendList: []
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    if (this.props.friendQuery.loading) {
      return (
        <Menu size='mini' style={{ marginTop: "4rem" }} className='flex vertical right fixed'>
          <Loading />
        </Menu>
      )
    }

    return (
      <Menu size='mini' style={{ marginTop: "4rem", textAlign: 'center' }} className='flex vertical right fixed'>
        {this.props.friendQuery.sidebarFriendQuery.map(friend =>
          <Friend key={friend.id} friend={friend} history={this.props.history} />
        )}
      </Menu>
    )
  }
}

const FRIEND_QUERY = gql`
  query friendQuery{
    sidebarFriendQuery{
      id
      name
    }
  }
`

export default compose(
  graphql(FRIEND_QUERY, {
    name: "friendQuery",
    options: {
      fetchPolicy: "cache-first",
    }
  }),
  withRouter)(FriendBar)