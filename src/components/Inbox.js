import React from 'react'
import Message from '../components/Message'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import MessageForm from './MessageForm'
import Loading from './Loading'

import 'tachyons'

class Inbox extends React.Component {
  state = {
    disablePage: false,
    count: 0
  }
  onFetchMore = () => {
    const { fetchMore } = this.props.messageQuery;
    const messageQuery = this.props.messageQuery.messageQuery
    const after = messageQuery[messageQuery.length - 1].id.toString()

    setTimeout(this.setState({ disablePage: true }), 500)

    this.setState({ count: this.state.count + 1 })
    fetchMore({
      query: MESSAGE_QUERY,
      variables: { first: 10, after },
      updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {
        return {
          ...previousResult,
          // Add the new matches data to the end of the old matches data.
          messageQuery: [
            ...fetchMoreResult.messageQuery,
          ],
        };
      },
    });
  }

  onFetchBack = () => {
    const { fetchMore } = this.props.messageQuery;
    const messageQuery = this.props.messageQuery.messageQuery
    const before = messageQuery[0].id.toString()

    setTimeout(this.setState({ disablePage: true }), 500)

    this.setState({ count: this.state.count - 1 })
    fetchMore({
      query: MESSAGE_QUERY,
      variables: { last: 10, before },
      updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {
        return {
          ...previousResult,
          // Add the new matches data to the end of the old matches data.
          messageQuery: [
            ...fetchMoreResult.messageQuery,
          ],
        };
      },
    });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.location.key !== nextProps.location.key) {
      this.props.messageQuery.refetch()
      this.props.userQuery.refetch()
    }
    this.setState({ disablePage: false })
  }

  render() {

    if (this.props.messageQuery.loading || this.props.userQuery.loading) {
      return (
        <div className="flex w-100 h-100 items-center justify-center pt7">
          <Loading />
        </div>
      )
    }

    const messages = this.props.messageQuery.messageQuery
    const user = this.props.userQuery.me

    return (
      <React.Fragment>
        <h1>Profile ({user.name})</h1>
        <button disabled={this.state.count === 0 || this.state.disablePage} onClick={() => this.onFetchBack()}>
          back
        </button>
        <button disabled={messages.length < 10 || this.state.disablePage} onClick={() => this.onFetchMore()}>
          next
          </button>
        <div className="flex w-75">
          <div className="flex flex-column w-100">
            {messages &&
              messages.map(message => (
                <Message
                  id={message.id}
                  key={message.id}
                  message={message}
                  refresh={() => messages.refetch()}
                  deleteMessage={() => this.props.deleteMessage}
                  history={this.props.history}
                />
              ))}
          </div>
          <MessageForm history={this.props.history} sender={user} className="flex inline-flex margin-auto" />
        </div>
        {this.props.children}
      </React.Fragment>
    )
  }
}

const MESSAGE_QUERY = gql`
query messageQuery($first: Int, $after: String, $last: Int, $before: String){
  messageQuery(first: $first, after: $after, last: $last, before: $before, orderBy: createdAt_DESC){
	  id
    text
    sender {
      id
      name
    }
    target {
      id
    }
    createdAt
	} 
}`

const ME_QUERY = gql`
  query userQuery {
    me {
      id
      name
    }
  }
`

const DELETE_MESSAGE = gql`
  mutation deleteMessage($id: ID!){
    deleteMessage(id: $id){
      id
    }
  }
`

export default compose(
  graphql(MESSAGE_QUERY, {
    name: 'messageQuery',
    options: {
      fetchPolicy: "cache-and-network",
      variables: {
        first: 10,
        after: undefined,
      },
    },
  }),
  graphql(ME_QUERY, {
    name: 'userQuery',
    options: {
      fetchPolicy: "cache-and-network",
    },
  }),
  graphql(DELETE_MESSAGE, {
    name: 'deleteMessage'
  })
)(Inbox)
