const { getUserId } = require('../../utils')

const user = {
  async addFriend(parent, { target }, ctx, info) {
    const userId = getUserId(ctx)

    if (target == null) {
      return { data: null }
    }

    const getUser = await ctx.db.query.user({ where: { id: "cjeojjg69wxuw0197hzxdnnt2" } }, 
      `{
        id
        friendList
      }`
    )

    const friendList = getUser.friendList

    return ctx.db.mutation.updateUser({
      where: { id: "cjeojjg69wxuw0197hzxdnnt2" },
      data: {
        friendList: {
          set: [...friendList, target]
        }
      }
    })
  }
}


module.exports = {
  user
}