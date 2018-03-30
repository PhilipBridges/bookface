import React from 'react'
import { List, Image, Divider } from 'semantic-ui-react'
import FriendModal from './FriendModal'

import 'tachyons'

const Friend = (props) => (
        <List.Item>
          <Image avatar src='/avatar.png' />
          <List.Content>
            <FriendModal  {...props}></FriendModal>
          </List.Content>
          <Divider />
        </List.Item>
)

export default Friend