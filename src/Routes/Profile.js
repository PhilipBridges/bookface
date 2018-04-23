import React from 'react'
import { graphql, compose, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter, Link } from 'react-router-dom'
import Dropzone from 'react-dropzone';
import Post from '../components/Post'
import Loading from '../components/Loading'
import CreatePageWithMutation from './CreatePage'

import { Card, Image, Comment, Grid, Message } from 'semantic-ui-react'

import 'tachyons'

class Profile extends React.Component {
  state = {
    friendClick: false,
    uploading: '',
    error: ''
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.key !== nextProps.location.key) {
      this.props.feedQuery.refetch()
      this.props.friendQuery.refetch()
    }
  }

  async addFriend(proId) {
    this.setState({ friendClick: true })
    await this.props.friendMutation({
      variables: {
        target: proId,
        text: "Hey! Be my friend!"
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

    if (this.props.meQuery.loading || this.props.friendQuery.loading || this.props.feedQuery.loading) {
      return (
        <div className="flex w-100 h-100 items-center justify-center pt7">
          <Loading />
        </div>
      )
    }

    const { proName, proId, profilePic } = this.props.friendQuery.friendQuery
    const posts = this.props.feedQuery.feed
    const friendList = this.props.friendQuery.friendQuery.friendList
    const me = this.props.meQuery.me.id

    var friendCheck = friendList.find(x => x.id === me)

    return (
      <div>
        <Card className="flex fl w-50">
          {me === proId ?
            <Mutation mutation={uploadFileMutation}>
              {mutate => (
                <Dropzone
                  minSize={5}
                  maxSize={200000}
                  disabledStyle={{}}

                  onDropRejected={() => {
                    this.setState({ error: 'Image too big. (Maximum of 200KB' })
                    setTimeout(() => {
                      this.setState({ error: '' })
                    }, 3000);
                  }}

                  onDropAccepted={async ([file]) => {
                    if (file) {
                      await mutate({ variables: { file } })
                      this.props.friendQuery.refetch()
                    }
                  }}


                >

                  <Image style={{ borderRadius: '15px' }} centered size="small" src={profilePic} />

                  {this.state.error !== '' &&
                    <Message size='tiny' warning>
                      <Message.Header>{this.state.error}</Message.Header>
                    </Message>}


                  <p style={{ textAlign: 'center' }} >Click to upload</p>
                </Dropzone>

              )}
            </Mutation>
            :
            <Image centered size="small" style={{ borderRadius: '15px' }} src={profilePic} />
          }
          <Card.Content textAlign="center">
            <Card.Header>{proName}</Card.Header>
            <Card.Description>Whatever dude</Card.Description>

            {friendCheck === undefined
              && me !== this.props.match.params.id
              &&
              <button disabled={this.state.friendClick}
                onClick={() => this.addFriend(proId)}>{this.state.friendClick ? "Added!" : "Add as friend"}</button>
            }

            {friendCheck !== undefined && me !== this.props.match.params.id
              &&
              <button disabled={this.state.friendClick}
                onClick={() => this.removeFriend(proId)}>{this.state.friendClick ? "Unfriended :(" : "Unfriend"}</button>
            }

          </Card.Content>
          <div className="tc flex flex-column">
            <Grid container columns={3}>

              {friendList.map(friend => {

                return (
                  <Grid.Column key={friend.id}>
                    <Link to={`/profile/${friend.id}`}>
                      <Image style={{ borderRadius: '15px' }} src={friend.profilePic} />
                      {friend.name}
                    </Link>
                  </Grid.Column>
                )
              })
              }

            </Grid>
          </div>
        </Card>
        <div className="ml5">
          <CreatePageWithMutation wallId={proId} wall={true} />
          <Comment.Group style={{ textAlign: 'center' }} className="flex flex-column ml5 pa4 tac">
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

const uploadFileMutation = gql`
  mutation($file: Upload!) {
          uploadFile(file: $file)
      }
    `;

const FRIEND_QUERY = gql`
  query friendQuery($target: ID!){
          friendQuery(target: $target){
          proId
          proName
          profilePic
          friendList {
            id
            name
            profilePic
          }
        }
      }
    `

const FEED_QUERY = gql`
  query FeedQuery($wallId: ID, ){
      feed(wallId: $wallId, orderBy: createdAt_DESC){
      id
      text
      title
      createdAt
      wallId
      author {
          id
          name
          profilePic
        }
      }
    }
  `

const FRIEND_MUTATION = gql`
  mutation createRequest($target: ID!, $text: String){
          createRequest(target: $target, text: $text)
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
      fetchPolicy: "cache-first",
      variables: {
        wallId: props.match.params.id
      },
    })
  }),
  graphql(FRIEND_QUERY, {
    name: "friendQuery",
    options: (props) => ({
      fetchPolicy: "cache-first",
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