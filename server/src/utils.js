const jwt = require('jsonwebtoken')

 function getUserId(ctx) {
  const Authorization = ctx.request.get(`Authorization`)
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, 'secret123')
    return userId
  }

  throw new AuthError()
}

class AuthError extends Error {
  constructor() {
    super('Not authorized')
  }
}

module.exports = {
  getUserId,
  AuthError
}