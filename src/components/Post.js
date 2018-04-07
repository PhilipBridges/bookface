import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { Divider, Image } from 'semantic-ui-react'

import '../Style/general.css'
import 'tachyons'

export default class Post extends React.Component {
  render() {
    let { title, id, text, author, createdAt } = this.props.post

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}} className="no-underline ma1">
        <Link to={`/profile/${author.id}`}>
          <Image style={{ display: 'inline' }} size='mini' src='/avatar.png' /> {author.name}
          {title !== "" ? <span> posted a status</span> : <span> said...</span>}
        </Link>
        {title !== "" && <h2 className="f3 black-80 fw4 lh-solid">{title}</h2>}
        <Link to={`/post/${id}`}>
          <p className="black-80 pa1 pl7 pr7 fw3 ws-normal ws-normal">
            {text}
          </p>
          <p className="date-font">
            {moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}
          </p>
        </Link>
        <Divider />
      </div>
    )
  }
}
