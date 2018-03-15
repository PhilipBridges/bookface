const { getUserId } = require('../../utils')

const user = {
  async addFriend(parent, { target }, ctx, info) {
    const userId = getUserId(ctx)

    if (target == null) {
      return { data: null }
    }

    const getUser = await ctx.db.query.user({ where: { id: userId } },
      `{
        id
        friendList
      }`
    )

    const friendList = getUser.friendList

    return ctx.db.mutation.updateUser({
      where: { id: userId },
      data: {
        friendList: {
          set: [...friendList, target]
        }
      }
    })
  },
  async deleteFriend(parent, { target }, ctx, info) {
    const userId = getUserId(ctx)

    if (target == null) {
      return { data: null }
    }

    const getUser = await ctx.db.query.user({ where: { id: userId } },
      `{
        id
        friendList
      }`
    )

    const friendList = getUser.friendList

    const newList = friendList.filter(i => i !== target)

    return ctx.db.mutation.updateUser({
      where: { id: userId },
      data: {
        friendList: {
          set: newList
        }
      }
    })
  }
}


module.exports = {
  user
}