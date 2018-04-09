import React from 'react'
import { withRouter } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { setContext } from 'apollo-link-context'

import 'semantic-ui-css/semantic.min.css';
import 'tachyons'
import '../index.css'

import { Menu, Button, Dropdown, Responsive } from 'semantic-ui-react'

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'feed',
      user: {},
      confirmDisable: false,
      position: 'top'
    }
  }

  handleOnUpdate = (e, { width }) => {
    if (width <= 700) {
      this.setState({ position: 'left' })
    }
    if (width >= 700) {
      this.setState({ position: 'top' })
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

  confirmFriend = async (props) => {
    const { requestId, senderId } = props
    this.setState({ confirmDisable: true })
    await this.props.confirmMutation({
      variables: {
        target: senderId,
        request: requestId
      }
    })
    await this.props.requestQuery.refetch()
    this.setState({ confirmDisable: false })
  }

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
      <Responsive onUpdate={this.handleOnUpdate} as={Menu} className="navbar" fixed={this.state.position} style={{ paddingLeft: "15rem" }} inverted pointing>
        <Menu.Item name='feed' active={activeItem === 'feed'} onClick={this.handleItemClick}>Feed</Menu.Item>
        {authed
          ?
          <React.Fragment>
            <Menu.Item name='inbox' active={activeItem === 'inbox'} onClick={this.handleItemClick} />
            <Menu.Item id={this.state.user.id} name='profile' active={activeItem === 'profile'} onClick={this.handleItemClick}>
              Profile ({this.state.user.name})
            </Menu.Item>
            <Dropdown item icon='alarm'>
              <Dropdown.Menu style={{ paddingRight: '5rem' }}>
                {this.props.requestQuery && !this.props.requestQuery.loading && this.props.requestQuery.requestQuery.length > 0 ? this.props.requestQuery.requestQuery.map(request => (
                  <Dropdown.Item key={request.id} style={{ display: 'flex' }}>
                    <img alt='avatar' src={'/avatar.png'} />
                    <span>{request.sender.name}: {request.text}</span>
                    <Button disabled={this.state.confirmDisable} onClick={() => this.confirmFriend({ requestId: request.id, senderId: request.sender.id })}>Confirm</Button>
                  </Dropdown.Item>
                ))
                  :
                  <Dropdown.Item text='No notifications' />
                }
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item name='logout' active={activeItem === 'logout'} onClick={this.logout} />
          </React.Fragment>
          :
          <React.Fragment>
            <Menu.Item name='register' active={activeItem === 'register'} onClick={this.handleItemClick} />
            <Menu.Item name='login' active={activeItem === 'login'} onClick={this.handleItemClick} />
          </React.Fragment>
        }
      </Responsive>
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

const REQUEST_QUERY = gql`
  query {
  requestQuery{
    id
    text
    sender {
      name
      id
    }
    target {
      name
      id
    }
  }
}`

const CONFIRM_MUTATION = gql`
  mutation addFriend($target: ID!, $request: ID!){
    addFriend(target: $target, request: $request) {
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
    }
  }),
  graphql(CONFIRM_MUTATION, {
    name: 'confirmMutation',
  }),
  graphql(REQUEST_QUERY, {
    name: 'requestQuery',
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  withRouter)(Header)