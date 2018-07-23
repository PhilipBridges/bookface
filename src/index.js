import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'

import 'semantic-ui-css/semantic.min.css';
import 'tachyons'
import './index.css'

import client from './apollo'
import Routes from './Routes'

ReactDOM.render(
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>,
  document.getElementById('root'),
)
