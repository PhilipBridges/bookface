import React from 'react'
import Post from '../components/Post'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router-dom'

import Loading from '../components/Loading'

import 'tachyons'

class FeedPage extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.location.key !== nextProps.location.key) {
      this.props.feedQuery.refetch()
    }
  }

  render() {
    if (this.props.feedQuery.loading) {
      return (
        <div className="flex w-100 h-100 items-center justify-center pt7">
          <Loading />
        </div>
      )
    }

    return (
      <React.Fragment >
        {this.props.feedQuery.allFeed &&
          this.props.feedQuery.allFeed.map(post => (
            <Post
              key={post.id}
              post={post}
              refresh={() => this.props.feedQuery.refetch()}
            />
          ))}
        {this.props.children}
      </React.Fragment>
    )
  }
}

const FEED_QUERY = gql`
  query FeedQuery {
    allFeed(orderBy: createdAt_DESC){
      id
      text
      title
      createdAt
      author {
        id
        name
      }
    }
  }
`

export default compose(
  graphql(FEED_QUERY, {
    name: "feedQuery", // name of the injected prop: this.props.feedQuery...
    options: {
      fetchPolicy: "cache-first",
    },
  }),
withRouter)(FeedPage)
