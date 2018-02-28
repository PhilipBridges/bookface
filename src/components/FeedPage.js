import React from 'react'
import Post from '../components/Post'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import Loading from './Loading'

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
      <React.Fragment>
        <h1>Feed</h1>
        {this.props.feedQuery.feed &&
          this.props.feedQuery.feed.map(post => (
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
    feed {
      id
      text
      title
      isPublished
    }
  }
`

export default compose(
  graphql(FEED_QUERY, {
    name: "feedQuery", // name of the injected prop: this.props.feedQuery...
    options: {
      fetchPolicy: "network-only",
    },
  }),
)(FeedPage)
