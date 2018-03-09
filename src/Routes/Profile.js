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
  render() {

    if (this.props.data.loading) {
      return (
        <div className="flex w-100 h-100 items-center justify-center pt7">
          <Loading />
        </div>
      )
    }

    const { name, id } = this.props.data.profileQuery
    const posts = this.props.feedQuery.feed

    return (
      <div className="flex">
        <Card className="fl w-50">
          <Image centered size="small" src='/avatar.png' />
          <Card.Content textAlign="center">
            <Card.Header>{name}</Card.Header>
            <Card.Description>Whatever dude</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <a>
              <Icon name='user' />
              10 Friends
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

export default compose(
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