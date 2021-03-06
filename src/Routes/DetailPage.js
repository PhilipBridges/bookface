import React from 'react'
import { graphql, compose } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import moment from 'moment'

import Loading from '../components/Loading'


class DetailPage extends React.Component {
  render() {
    if (this.props.postQuery.loading) {
      return (
        <div className="flex w-100 h-100 items-center justify-center pt7">
          <div><Loading /></div>
        </div>
      )
    }

    const { post } = this.props.postQuery

    let action = this._renderAction(post)

    return (
      <React.Fragment>
        <h1>{this.props.postQuery.post.author.name} </h1>
        <h2 className="f3 black-80 fw4 lh-solid">{post.title}</h2>
        <span>{moment(post.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</span>
        <p className="black-80 fw3">{post.text}</p>

        <span>
          {action}
        </span>
      </React.Fragment>
    )
  }

  _renderAction = (post) => {
    return (
      <a
        className="f6 dim br1 ba ph3 pv2 mb2 dib black pointer"
        onClick={() => this.deletePost(post.id)}
      >
        Delete
      </a>
    )
  }

  deletePost = async id => {
    await this.props.deletePost({
      variables: { id },
    })
    this.props.history.replace('/feed')
  }

}

const POST_QUERY = gql`
  query PostQuery($id: ID!) {
    post(id: $id) {
      createdAt
      id
      title
      text
      wallId
      author {
        id
        name
      }
    }
  }
`

const DELETE_MUTATION = gql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`

export default compose(
  graphql(POST_QUERY, {
    name: 'postQuery',
    options: props => ({
      variables: {
        id: props.match.params.id,
      },
    }),
  }),
  graphql(DELETE_MUTATION, {
    name: 'deletePost',
  }),
  withRouter,
)(DetailPage)
