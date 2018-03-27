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

    const targetUser = await ctx.db.query.user({ where: { id: target } },
      `{
        id
        friendList
      }`
    )

    const targetList = targetUser.friendList

    await ctx.db.mutation.updateUser({
      where: { id: target },
      data: {
        friendList: {
          set: [...targetList, userId]
        }
      }
    })

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

    const getTarget = await ctx.db.query.user({ where: { id: target } },
      `{
        id
        friendList
      }`
    )

    const friendList = getUser.friendList
    const targetList = getTarget.friendList

    const newList = friendList.filter(i => i !== target)
    const newTargetList = targetList.filter(i => i !== userId)

    ctx.db.mutation.updateUser({
      where: { id: target },
      data: {
        friendList: {
          set: newTargetList
        }
      }
    })

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