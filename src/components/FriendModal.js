import React from 'react'
import { Button, Modal, Header } from 'semantic-ui-react'
import gql from 'graphql-tag'
import moment from 'moment'
import { Subscription } from 'react-apollo'

import MessageBar from './MessageBar'
import client from '../apollo'

import 'tachyons'

class FriendModal extends React.Component {
  state = {
    data: '',
    datedList: null
  }

  modalOpen = async () => {
    const response = await client.query({
      query: BOX_QUERY,
      variables: { sender: this.props.friend.id },
    })
    this.setState({ data: response })
    return response
  }

  render() {

    const messageList = this.state.data.data && !this.state.data.data.loading ? this.state.data.data.boxQuery : null
    const senderList = messageList !== null && messageList.filter(message => message.sender.id === this.props.friend.id)
    const targetList = messageList !== null && messageList.filter(message => message.sender.id !== this.props.friend.id)

    const newList = senderList && senderList.concat(targetList)

    const datedList = newList && newList.sort(function (a, b) {
      if (a.createdAt > b.createdAt) {
        return true
      }
      return datedList
    })

    if (datedList && this.state.datedList === null) {
      this.setState({ datedList })
    }

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
        <div className="flex flex-column pb3 pt3">
          <Subscription
            subscription={MESSAGE_SUBSCRIPTION}
            variables={{ sender: this.props.friend.id }}
          >
            {({ data, loading }) => (
              <div>
                {data && data.message && this.setState({ datedList: [...this.state.datedList, data.message.node] })}
              </div>
            )}
          </Subscription>
          {this.state.datedList && this.state.datedList.map(message => {
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