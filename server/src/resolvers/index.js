import { Query }  from './Query'
import { auth } from './Mutation/auth'
import { post } from './Mutation/post'
import { AuthPayload } from './AuthPayload'
import { message } from './Mutation/message'

module.exports = {
  Query,
  Mutation: {
    ...auth,
    ...post,
    ...message,
  },
  AuthPayload,
}
