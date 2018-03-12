const { getUserId } = require('../../utils')

const user = {
  async addFriend(parent, { target }, ctx, info) {
    const userId = getUserId(ctx)

    if (target == null) {
      return { data: null }
    }

    return ctx.db.mutation.updateUser({
      where: { id: userId },
      data: {
        name: "memer"
      }
    })
  }
}


module.exports = {
  user
}