// import React from 'react'
// import {
//   NavLink,
//   Link,
// } from 'react-router-dom'

// import { Menu } from 'semantic-ui-react'

// import decode from 'jwt-decode'

// class TempHeader extends React.Component {
//   render() {
    
//     const Authed = () => {
//       const token = localStorage.getItem("token");
//       try {
//         decode(token);
//       } catch (err) {
//         return false;
//       }
//       return true;
//     };

//     return (
//       <Menu inverted>
//         <Menu.Item name='/' active={activeItem === 'home'} onClick={this.handleItemClick} />
//         <Menu.Item name='messages' active={activeItem === 'messages'} onClick={this.handleItemClick} />
//         <Menu.Item name='friends' active={activeItem === 'friends'} onClick={this.handleItemClick} />
//         <Menu.Item link href="/profile" name='profile' active={activeItem === 'profile'} onClick={this.handleItemClick}> </Menu.Item>
//         <Menu.Item name='logout' active={activeItem === 'logout'} onClick={this.logout} />
//       </Menu>
//     )
//   }
// }

// export default TempHeader