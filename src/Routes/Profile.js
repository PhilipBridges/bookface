import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter, Link } from 'react-router-dom'

import Post from '../components/Post'
import Loading from '../components/Loading'
import CreatePageWithMutation from './CreatePage'

import { Card, Icon, Image, Comment } from 'semantic-ui-react'

import 'tachyons'

class Profile extends React.Component {
  state = {
    friendClick: false
  }
  async addFriend(proId) {
    this.setState({ friendClick: true })
    await this.props.friendMutation({
      variables: {
        target: proId
      }
    })
  }
  async removeFriend(id) {
    this.setState({ friendClick: true })
    await this.props.unfriendMutation({
      variables: {
        target: id
      }
    })
  }

  render() {

    if (this.props.meQuery.loading || this.props.friendQuery.loading) {
      return (
        <div className="flex w-100 h-100 items-center justify-center pt7">
          <Loading />
        </div>
      )
    }

    const { proName, proId } = this.props.friendQuery.friendQuery
    const posts = this.props.feedQuery.feed
    const friendList = this.props.friendQuery.friendQuery.friendList

    var friendCheck = friendList.find(x => x.id === this.props.match.params.id)

    return (
      <div className="flex">
        <Card className="fl w-50">
          <Image centered size="small" src='/avatar.png' />
          <Card.Content textAlign="center">
            <Card.Header>{proName}</Card.Header>
            <Card.Description>Whatever dude</Card.Description>
            {friendCheck === undefined
              ?
              <button disabled={this.state.friendClick} 
              onClick={() => this.addFriend(proId)}>{this.state.friendClick ? "Added!" : "Add as friend"}</button>
              :
              <button disabled={this.state.friendClick} 
              onClick={() => this.removeFriend(proId)}>{this.state.friendClick ? "Unfriended :(" : "Unfriend"}</button>
            }
          </Card.Content>
          <Card.Content extra>
            <Icon name='user' />
            {friendList.map(friend => <div key={friend.id}><Link to={`/profile/${friend.id}`}>{friend.name}</Link></div>)}

          </Card.Content>
        </Card>
        <div className="w-50 ml5">
          <CreatePageWithMutation wallId={proId} wall={true} />
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

const FRIEND_QUERY = gql`
  query friendQuery($target: ID!){
  friendQuery(target: $target){
    proId
    proName
    friendList {
      id
      name
    }
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
  }
}
`
const UNFRIEND_MUTATION = gql`
  mutation unfriendMutation($target: ID!){
    deleteFriend(target: $target) {
    id
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
  graphql(FEED_QUERY, {
    name: "feedQuery",
    options: (props) => ({
      fetchPolicy: "cache-and-network",
      variables: {
        wallId: props.match.params.id
      },
    })
  }),
  graphql(FRIEND_QUERY, {
    name: "friendQuery",
    options: (props) => ({
      fetchPolicy: "cache-and-network",
      variables: {
        target: props.match.params.id
      },
    }),
  }),
  graphql(FRIEND_MUTATION, {
    name: "friendMutation",
  }),
  graphql(UNFRIEND_MUTATION, {
    name: "unfriendMutation",
  }),
  withRouter)(Profile)