import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router-dom'

import Post from '../components/Post'
import Loading from '../components/Loading'
import CreatePageWithMutation from './CreatePage'

import { Card, Icon, Image, Comment } from 'semantic-ui-react'

import 'tachyons'

class Profile extends React.Component {
  async addFriend(id, name) {
    await this.props.friendMutation({
      variables: {
        id: id,
        name: name
      }
    })
  }
  async removeFriend(id) {
    await this.props.unfriendMutation({
      variables: {
        target: id
      }
    })
  }

  render() {

    if (this.props.data.loading || this.props.meQuery.loading) {
      return (
        <div className="flex w-100 h-100 items-center justify-center pt7">
          <Loading />
        </div>
      )
    }

    const { name, id } = this.props.data.profileQuery
    const posts = this.props.feedQuery.feed
    const friendList = this.props.meQuery.me.friendList

    var friendCheck = friendList.find(x => x === id)

    return (
      <div className="flex">
        <Card className="fl w-50">
          <Image centered size="small" src='/avatar.png' />
          <Card.Content textAlign="center">
            <Card.Header>{name}</Card.Header>
            <Card.Description>Whatever dude</Card.Description>
            {friendCheck !== undefined
              ?
              <button onClick={() => this.addFriend(name, id)}>Add as friend</button>
              :
              <button onClick={() => this.removeFriend(id)}>Unfriend</button>
            }
          </Card.Content>
          <Card.Content extra>
            <a>
              <Icon name='user' />
              {friendList.map(friend => <div>{friend}</div>)}
            </a>

          </Card.Content>
        </Card>
        <div className="w-50 ml5">
          <CreatePageWithMutation wallId={id} wall={true} />
          <Comment.Group>
            {posts && posts.map(post =>
              <Post
                key={post.id}
                post={post}
                author={post.author}
                refresh={() => this.props.feedQuery.refetch()}
              />
            )}
          </Comment.Group>
        </div>
      </div>
    )
  }
}

const PROFILE_QUERY = gql`
  query profileQuery($id: ID){
      profileQuery(id: $id){
        id
        name
        friendList
      }
  }
  `

const FEED_QUERY = gql`
  query FeedQuery($wallId: ID){
    feed(wallId: $wallId){
      id
      text
      title
      createdAt
      wallId
      author {
        id
        name
      }
    }
  }
`

const FRIEND_MUTATION = gql`
  mutation friendMutation($target: ID!){
    addFriend(target: $target) {
    id
    name
  }
}
`
const UNFRIEND_MUTATION = gql`
  mutation unfriendMutation($target: ID!){
    deleteFriend(target: $target) {
    id
    name
  }
}
`

const ME_QUERY = gql`
  query meQuery {
    me {
      id
      friendList
    }
  }
`

export default compose(
  graphql(ME_QUERY, {
    name: "meQuery"
  }),
  graphql(FRIEND_MUTATION, {
    name: "friendMutation",
  }),
  graphql(UNFRIEND_MUTATION, {
    name: "unfriendMutation",
  }),
  graphql(FEED_QUERY, {
    name: "feedQuery",
    options: (props) => ({
      fetchPolicy: "cache-and-network",
      variables: {
        wallId: props.match.params.id
      },
    })
  }),
  graphql(PROFILE_QUERY, {
    name: "data",
    options: (props) => ({
      fetchPolicy: "cache-and-network",
      variables: {
        id: props.match.params.id
      },
    }),
  }),
  withRouter)(Profile)