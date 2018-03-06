import React from 'react'
import { Link } from 'react-router-dom'

import { Divider } from 'semantic-ui-react'

import 'tachyons'

export default class Post extends React.Component {
  render() {
    let title = this.props.post.title

    return (
      <Link className="no-underline ma1" to={`/post/${this.props.post.id}`}>
        <h2 className="f3 black-80 fw4 lh-solid">{title}</h2>
        <p className="black-80 fw3 ws-normal ws-normal">{this.props.post.text}</p>
        <Divider />
      </Link>
    )
  }
}
