import React from 'react'
import { Button, Modal, Header } from 'semantic-ui-react'
import gql from 'graphql-tag'
import moment from 'moment'
import { Subscription, Query } from 'react-apollo'

import MessageBar from './MessageBar'
import client from '../apollo'

import 'tachyons'

class FriendModal extends React.Component {
  state = {
    data: '',
  }

  modalOpen = async () => {
    const response = await client.query({
      query: BOX_QUERY,
      variables: { sender: this.props.friend.id },
      fetchPolicy: 'network-only'
    })
    return response
  }

  render() {
    return (
      <Modal
        closeOnDimmerClick={true}
        closeOnDocumentClick={true}
        onOpen={() => this.modalOpen()}
        dimmer={false}
        style={{ margin: "auto", marginTop: "auto", position: 'absolute', bottom: 0, right: 0, maxWidth: '25%' }}
        trigger={<Button>{this.props.friend.name}</Button>}
        size='tiny'
      >
        <Header>{this.props.friend.name}</Header>

          <Query query={BOX_QUERY} variables={{ sender: this.props.friend.id }}>
            {({ loading, data, subscribeToMore }) => {
              if (loading) {
                return null;
              }

              subscribeToMore({
                document: MESSAGE_SUBSCRIPTION,
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
                <div className="flex flex-column pb3 pt3">
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
              )
            }}
          </Query>

        <MessageBar target={this.props.friend.name} />
      </Modal>
    )
  }
}

const BOX_QUERY = gql`
query boxQuery($sender: ID!){
          boxQuery(sender: $sender, orderBy: createdAt_DESC){
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