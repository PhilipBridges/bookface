import React from 'react'
import { withRouter } from 'react-router-dom'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class CreatePage extends React.Component {
  state = {
    title: '',
    text: '',
  }

  render() {
    const wallPost = this.props.wall

    return (
      <div className="pa4 flex justify-center bg-white">
        <form onSubmit={this.handlePost}>
          {!wallPost && <h1>Create Post</h1>}
          {!wallPost && <input
            autoFocus
            className="w-100 pa2 mv2 br2 b--black-20 bw1"
            onChange={e => this.setState({ title: e.target.value })}
            placeholder="Title"
            type="text"
            value={this.state.title}
          />}
          <textarea
            className="db w-100 ba bw1 b--black-20 pa2 br2 mb2"
            cols={50}
            onChange={e => this.setState({ text: e.target.value })}
            placeholder="Write a post!"
            rows={8}
            value={this.state.text}
          />
          <input
            className={`pa3 bg-black-10 bn ${this.state.text &&
              this.state.title &&
              'dim pointer'}`}
            disabled={!this.state.text}
            type="submit"
            value="Create"
          />{' '}
        </form>
      </div>
    )
  }

  handlePost = async e => {
    e.preventDefault()
    const { title, text } = this.state
    const wallId = this.props.wallId

    await this.props.createPostMutation({
      variables: { title, text, wallId },
    })
    this.props.history.replace('/')
  }
}

const CREATE_POST_MUTATION = gql`
  mutation CreatePostMutation($title: String!, $text: String!, $wallId: ID) {
    createPost(title: $title, text: $text, wallId: $wallId) {
      id
      title
      text
      wallId
    }
  }
`

const CreatePageWithMutation = graphql(CREATE_POST_MUTATION, {
  name: 'createPostMutation',
})(CreatePage)

export default withRouter(CreatePageWithMutation)
