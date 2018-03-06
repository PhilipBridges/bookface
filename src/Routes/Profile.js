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

    const { email, name, posts } = this.props.data.profileQuery

    return (
      <div className="flex">
        <Card className="fl w-50">
          <Image centered size="small" src='/avatar.png' />
          <Card.Content textAlign="center">
            <Card.Header>{name}</Card.Header>
            <Card.Meta>email: {email}</Card.Meta>
            <Card.Description>Whatever dude</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <a>
              <Icon centered name='user' />
              10 Friends
            </a>
          </Card.Content>
        </Card>
        <div className="w-50 ml5">
          <CreatePageWithMutation wall={true}/>
          <Comment.Group>
            {posts && posts.map(post =>
              <Post
                key={post.id}
                post={post}
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
        posts {
          id
          createdAt
          author {
            id
            name
          }
          title
          text
        }
      }
  }
  `

export default compose(
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