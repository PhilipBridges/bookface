import React from 'react'
import Post from '../components/Post'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router-dom'

import Loading from '../components/Loading'

import 'tachyons'
import { Icon } from 'semantic-ui-react'

class FeedPage extends React.Component {
  state = {
    disablePage: false,
    count: 0
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.location.key !== nextProps.location.key) {
      this.props.feedQuery.refetch()
    }
  }

  onFetchMore = () => {
      const { fetchMore } = this.props.feedQuery;
      const feedQuery = this.props.feedQuery.allFeed
      const after = feedQuery[feedQuery.length - 1].id.toString()
      setTimeout(this.setState({ disablePage: true }), 500)

      this.setState({ count: this.state.count + 1 })
      fetchMore({
        query: FEED_QUERY,
        variables: { first: 5, after },
        updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {
          return {
            allFeed: [
              ...previousResult.allFeed, ...fetchMoreResult.allFeed,
            ],
          };
        },
      });
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
        {this.props.feedQuery.allFeed &&
          !this.props.feedQuery.loading &&
          this.props.feedQuery.allFeed.map(post => (
            <Post
              key={!this.props.feedQuery.loading && post.id}
              post={!this.props.feedQuery.loading && post}
              refresh={() => this.props.feedQuery.refetch()}
            />
          ))}
        {this.props.feedQuery.allFeed &&
          !this.props.feedQuery.loading && this.props.feedQuery.allFeed.length === 0 &&
          <div style={{ textAlign: 'center' }}>No posts! (Make some on your profile or search for friends)</div>}
        {this.props.feedQuery.allFeed.length !== 0 &&
          <Icon onClick={() => this.onFetchMore()} style={{ paddingLeft: '50%' }} name='chevron down' />
        }
      </React.Fragment>
    )
  }
}

const FEED_QUERY = gql`
  query FeedQuery($first: Int, $after: String, $last: Int, $before: String){
    allFeed(orderBy: createdAt_DESC, first: $first, last: $last, before: $before, after: $after){
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
      variables: {
        first: 5,
        after: undefined,
        last: undefined,
        before: undefined
      },
    },
  }),
  withRouter)(FeedPage)
