import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import moment from 'moment'


import { Comment, Divider, Button } from 'semantic-ui-react'

const _deleteMessage = async (props) => {
  await props.deleteMessage({
    variables: {
      id: props.id
    }
  })
  props.history.replace('/profile')
}

const Message = (props) =>
  <Comment>
    <Comment.Content className="w-50 no-underline inline-block">
    <p>{moment(props.message.createdAt).format('MMMM Do YYYY, h:mm a')}</p>
      <Comment.Author as='a'>{props.message.sender.name} => {props.message.target.name}</Comment.Author>
      <Comment.Metadata>
      </Comment.Metadata>
      <Comment.Text>{props.message.text}</Comment.Text>
    </Comment.Content>
    <Button onClick={() => _deleteMessage(props)}>Delete</Button>
    <Divider />
  </Comment>


const DELETE_MESSAGE = gql`
  mutation deleteMessage($id: ID!){
    deleteMessage(id: $id){
      id
    }
  }
`

export default graphql(DELETE_MESSAGE, {
  name: 'deleteMessage'
})(Message)