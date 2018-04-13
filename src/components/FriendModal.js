import React from 'react'
import { Button, Modal, Header, Icon } from 'semantic-ui-react'
import gql from 'graphql-tag'
import moment from 'moment'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import { Scrollbars } from 'react-custom-scrollbars';

import MessageBar from './MessageBar'
import client from '../apollo'

import 'tachyons'

var _ = require('lodash');

class FriendModal extends React.Component {
  state = {
    data: '',
    last: '',
    after: '',
  }

  modalOpen = async () => {
    const response = await client.query({
      query: BOX_QUERY,
      variables: { sender: this.props.friend.id },
      fetchPolicy: 'network-only'
    })
    await this.refs.query.refs.scrollbar.scrollToBottom()
    return response
  }

  render() {
    return (
      <Modal
        closeOnDimmerClick={true}
        closeOnDocumentClick={true}
        onOpen={() => this.modalOpen()}
        dimmer={false}
        style={{ margin: "auto", marginTop: "auto", position: 'absolute', bottom: 0, right: 0, maxWidth: '20%' }}
        trigger={<Button size='tiny'>{this.props.friend.name}</Button>}
        size='tiny'
      >
        <Header>
          <Link to={`/profile/${this.props.friend.id}`}>{this.props.friend.name}</Link>
        </Header>

        <Query ref='query' query={BOX_QUERY} variables={{ sender: this.props.friend.id, first: 10, before: undefined }}
        >
          {({ loading, data, subscribeToMore, fetchMore }) => {
            if (loading) {
              return null;
            }
            let before = this.state.last === '' ? data.boxQuery[0].id : this.state.last

            const onFetchMore = (values) => {
              if (data.boxQuery.length >= 1) {

                fetchMore({
                  query: BOX_QUERY,
                  variables: { last: 10, after: before, sender: this.props.friend.id },
                  updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {
                    if ([...fetchMoreResult.boxQuery].length >= 1) {
                      this.setState({ last: fetchMoreResult.boxQuery[0].id })
                      const response = {
                        boxQuery: [...previousResult.boxQuery, ...fetchMoreResult.boxQuery]
                      }
                      var filteredArray = _.uniqBy(response.boxQuery, function (x) { return x.id }).sort(function (a, b) {
                        if (a.createdAt > b.createdAt) {
                          return true
                        }
                        return filteredArray
                      })
                      if (response.boxQuery.length > 1) {
                        return {
                          boxQuery: [...filteredArray]
                        }
                      }
                    }
                  },
                });
              }
            }

            subscribeToMore({
              document: MESSAGE_SUBSCRIPTION,
              variables: { first: 10 },
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const message = subscriptionData.data.message.node;
                const newList = prev.boxQuery.filter(msg => msg.id !== message.id)
                return {
                  boxQuery: [...newList, message]
                }
              }
            });
            return (
              <Scrollbars
                ref='scrollbar'
                onScrollFrame={(values) => {
                  if (values.top === 0) {
                    onFetchMore(values)
                  }
                }}
                style={{ width: undefined, height: 200 }}>
                <div className="flex flex-column pb3 pt3">

                  <Icon style={{ paddingLeft: '50%' }} name='chevron up' />

                  {data && data.boxQuery.map(message => {
                    if (message.sender.id === this.props.friend.id) {
                      return (
                        <div style={{ float: 'left', paddingLeft: '1rem' }} key={message.id}>
                          {message.text} <span style={{ fontSize: '.7rem' }}>@ {moment(message.createdAt).format('ddd, h:mm a')}</span>
                        </div>
                      )
                    }
                    return (
                      <div style={{ float: 'right', marginLeft: 'auto', paddingRight: '1rem' }} key={message.id}>
                        {message.text} <span style={{ fontSize: '.7rem' }}>@ {moment(message.createdAt).format('ddd, h:mm a')}</span>
                      </div>
                    )
                  })}
                </div>
              </Scrollbars>
            )
          }}
        </Query>
        <MessageBar target={this.props.friend.name} />
      </Modal>
    )
  }
}

const BOX_QUERY = gql`
query boxQuery($sender: ID!, $first: Int, $last: Int, $before: String){
          boxQuery(first: $first, last: $last, before: $before, sender: $sender, orderBy: createdAt_DESC){
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

const MESSAGE_SUBSCRIPTION = gql`
  subscription {
          message(orderBy: createdAt_DESC){
          node {
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
    }
  }
  `;

export default FriendModal