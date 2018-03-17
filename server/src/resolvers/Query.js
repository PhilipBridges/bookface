const { getUserId } = require('../utils')

const Query = {
  feed(parent, args, ctx, info) {
    return ctx.db.query.posts({ where: { wallId: args.wallId } }, info);
  },

  post(parent, { id }, ctx, info) {
    return ctx.db.query.post({ where: { id } }, info)
  },

  me(parent, args, ctx, info) {
    const id = getUserId(ctx)
    if (id) {
      return ctx.db.query.user({ where: { id } }, info)
    }
  },
  userQuery(parent, args, ctx, info) {
    return ctx.db.query.users(info)
  },
  profileQuery(parent, { id }, ctx, info) {
    return ctx.db.query.user({ where: { id } }, info)
  },
  boxQuery(parent, args, ctx, info) {
    const userId = getUserId(ctx)
    return ctx.db.query.users({ where: { sentMessages_some: { sender: userId } } }, info)
  },
  messageQuery(parent, args, ctx, info) {
    const userId = getUserId(ctx)
    const { first, after, last, before } = args

    return ctx.db.query.messages({ where: { target: { id: userId } }, first, last, before, after }, info)
  },
  async friendQuery(parent, { target }, ctx, info) {
    console.log("asd", target)
    const userId = getUserId(ctx)
    const getUser = await ctx.db.query.user({ where: { id: target } },
      `{
        id
        friendList
      }`
    )
    const friendList = getUser.friendList
    const newList = friendList.map(async (friend) => {
      const currUser = await ctx.db.query.user({ where: { id: friend } })
      return { id: currUser.id, name: currUser.name }
    })
    return newList
  }

}

module.exports = { Query }