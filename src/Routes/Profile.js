import React from 'react'
import { graphql, compose, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter, Link } from 'react-router-dom'
import Dropzone from 'react-dropzone';
import axios from 'axios';

import Post from '../components/Post'
import Loading from '../components/Loading'
import CreatePageWithMutation from './CreatePage'

import { Card, Image, Comment, Grid, Message } from 'semantic-ui-react'

import 'tachyons'

class Profile extends React.Component {
  state = {
    friendClick: false,
    profilePic: '/avatar.png',
    error: ''
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.key !== nextProps.location.key) {
      this.props.feedQuery.refetch()

      let proId = nextProps.match.params.id
      axios.get(`${process.env.REACT_APP_URI}/pics/${proId}/profile.jpg`)
        .then(res => {
          this.setState({ profilePic: res.request.responseURL })
        })
        .catch(err => this.setState({ profilePic: '/avatar.png' }))
    }
  }

  componentDidMount() {
    let proId = this.props.match.params.id
    if (proId) {
      axios.get(`${process.env.REACT_APP_URI}/pics/${proId}/profile.jpg`)
        .then(res => {
          this.setState({ profilePic: res.request.responseURL })
        })
        .catch(error => this.setState({ profilePic: '/avatar.png' }))
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
    const me = this.props.meQuery.me.id

    var friendCheck = friendList.find(x => x.id === me)

    return (
      <div>
        <Card className="flex fl w-50">
          {me === proId ?
            <Mutation mutation={uploadFileMutation}>
              {mutate => (
                <Dropzone
                  minSize={0}
                  maxSize={256000}
                  disabledStyle={{}}

                  onDropRejected={() => {
                    this.setState({ error: 'Image too big. (Maximum of 256KB' })
                    setTimeout(() => {
                      this.setState({ error: '' })
                    }, 3000);
                  }}

                  onDropAccepted={async ([file]) => {
                    if (file) {
                      await mutate({ variables: { file } })

                      let proId = this.props.match.params.id
                      await axios.get(`${process.env.REACT_APP_URI}/pics/${proId}/profile.jpg`)
                        .then(res => {
                          this.setState({ profilePic: res.request.responseURL })
                        })
                        .catch(this.setState({ profilePic: '/avatar.png' }))
                    }
                  }}>

                  <Image style={{ borderRadius: '15px' }} centered size="small" src={this.state.profilePic} />

                  {this.state.error !== '' &&
                    <Message size='tiny' warning>
                      <Message.Header>{this.state.error}</Message.Header>
                    </Message>}
                  <p style={{ textAlign: 'center' }} >Click to upload</p>
                </Dropzone>
              )}
            </Mutation>
            :
            <Image centered size="small" style={{ borderRadius: '15px' }} src={this.state.profilePic} />
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

                async function g() {
                  let check = null
                  try {
                    check = await axios.get(`${process.env.REACT_APP_URI}/pics/${friend.id}/profile.jpg`)
                  }
                  catch (err) {
                    return err.response
                  }
                  return check
                }

                const picCheck = g().then(res => res.status)

                return (
                  <Grid.Column key={friend.id}>
                    {console.log(picCheck)}
                    {picCheck ? <div>Congrats</div> : <div>Nope</div>}
                    <Link to={`/profile/${friend.id}`}>
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
        friendList {
          id
      name
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