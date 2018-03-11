const { getUserId } = require('../../utils')

const user = {
  async addFriend(parent, { target }, ctx, info) {
    const userId = getUserId(ctx)
    const receiver = await ctx.db.query.user({ where: { id: target } })
    console.log("RECEEV", receiver)

    if (receiver == null) {
      return { data: null }
    }
    return ctx.db.mutation.updateUser({
      where: { id: userId },
      data: {
        friends: {
          name: target
        }
      }
    })
  }
}


module.exports = {
  user
}