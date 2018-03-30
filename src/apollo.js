import { ApolloClient } from "apollo-client";
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

require('dotenv').config()

const httpLink = new HttpLink({ uri: process.env.REACT_APP_URI })

const middlewareLink = setContext(() => ({
  headers: {
    "Authorization": localStorage.getItem("token"),
  }
}));

const afterwareLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token && `Bearer ${token}`
    }
  }
});

const httpLinkWithMiddleware = afterwareLink.concat(
  middlewareLink.concat(httpLink)
);

const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000/subscriptions",
  options: {
    reconnect: true,
    connectionParams: {
      token: localStorage.getItem("token"),
    }
  }
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLinkWithMiddleware
);

const cache = new InMemoryCache()

export default new ApolloClient({
  link,
  cache
});