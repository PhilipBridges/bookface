import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { Divider } from 'semantic-ui-react'

import '../Style/general.css'
import 'tachyons'

export default class Post extends React.Component {
  render() {
    let { title, id, text, author, createdAt } = this.props.post

    return (
      <div className="no-underline ma1" >
        <p>
          <Link to={`/profile/${author.id}`}>{author.name}</Link>
          {title !== "" ? <span> posted a status</span> : <span> said...</span>}
        </p>
        {title !== "" && <h2 className="f3 black-80 fw4 lh-solid">{title}</h2>}
        <Link to={`/post/${id}`}><p className="black-80 fw3 ws-normal ws-normal">{text}</p>
          <p className="date-font">{moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
        </Link>
        <Divider />
      </div>
    )
  }
}
