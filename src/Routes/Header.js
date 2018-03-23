import React from 'react'
import { withRouter } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { setContext } from 'apollo-link-context'

import 'semantic-ui-css/semantic.min.css';
import 'tachyons'
import '../index.css'

import { Menu } from 'semantic-ui-react'

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'home',
      user: {}
    }
  }

  handleItemClick = (e, { name, id }) => this.setState({ activeItem: name },
    id ?
      this.props.history.push(`/profile/${id}`)
      :
      this.props.history.push(`/${name}`))

  logout = async (e) => {
    setContext(() => ({
      headers: {
        "Authorization": localStorage.removeItem("token"),
      }
    }))
    await localStorage.removeItem("token")
    window.location.reload();
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.location.key !== nextProps.location.key
      && this.props.meQuery && !this.props.meQuery.loading) {
      this.props.meQuery.refetch()
    }
  }

  render() {
    const authed = localStorage.getItem("token")
    const { activeItem } = this.state

    if (this.props.meQuery && !this.props.meQuery.loading && this.state.user && !this.state.user.name) {
      this.setState({ user: this.props.meQuery.me })
    }

    return (
      <Menu fixed style={{paddingLeft: "15rem"}} inverted pointing>
        <Menu.Item name='' active={activeItem === 'home'} onClick={this.handleItemClick}>Feed</Menu.Item>
        {authed
          ?
          <React.Fragment>
            <Menu.Item name='inbox' active={activeItem === 'inbox'} onClick={this.handleItemClick} />
            <Menu.Item id={this.state.user.id} name='profile' active={activeItem === 'profile'} onClick={this.handleItemClick}>
              Profile ({this.state.user.name})
            </Menu.Item>
            <Menu.Item name='logout' active={activeItem === 'logout'} onClick={this.logout} />
          </React.Fragment>
          :
          <React.Fragment>
            <Menu.Item name='register' active={activeItem === 'register'} onClick={this.handleItemClick} />
            <Menu.Item name='login' active={activeItem === 'login'} onClick={this.handleItemClick} />
          </React.Fragment>
        }
      </Menu>
    )
  }
}


const ME_QUERY = gql`
  query meQuery {
    me {
      id
      name
    }
  }
`

export default compose(
  graphql(ME_QUERY, {
    name: "meQuery",
    options: {
      fetchPolicy: "cache-and-network",
    },
  }),
  withRouter)(Header)