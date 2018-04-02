import React, { Component } from 'react'
import { Dropdown, Menu, Icon, } from 'semantic-ui-react'
import Search from './Search'

import 'tachyons'

class LeftBar extends Component {
  state = {}

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  componentDidMount() { }

  render() {
    const { activeItem } = this.state

    return (
      <Menu className='flex inverted vertical left fixed'>
        <Menu.Item>
          Home
              <Icon name='dashboard' />
          <Menu.Menu>
            <Menu.Item>
              <Search />
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>
        <Menu.Item name='browse' active={activeItem === 'browse'} onClick={this.handleItemClick}>
          <Icon name='grid layout' />
          Browse
                </Menu.Item>
        <Menu.Item name='messages' active={activeItem === 'messages'} onClick={this.handleItemClick}>
          Messages
                    </Menu.Item>

        <Dropdown item text='More'>
          <Dropdown.Menu>
            <Dropdown.Item icon='edit' text='Edit Profile' />
          </Dropdown.Menu>
        </Dropdown>
      </Menu>
    )
  }
}

export default LeftBar