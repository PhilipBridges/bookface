import { Query }  from './Query'
import { auth } from './Mutation/auth'
import { post } from './Mutation/post'
import { AuthPayload } from './AuthPayload'
import { message } from './Mutation/message'
import { user } from './Mutation/user'

module.exports = {
  Query,
  Mutation: {
    ...auth,
    ...post,
    ...message,
    ...user
  },
  AuthPayload,
}
