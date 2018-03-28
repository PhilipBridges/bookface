const { getUserId } = require('../utils')

const Query = {
  feed(parent, args, ctx, info) {
    return ctx.db.query.posts({ where: { wallId: args.wallId } }, info);
  },
  async allFeed(parent, args, ctx, info) {
    const userId = getUserId(ctx)
    const getUser = await ctx.db.query.user({ where: { id: userId } },
      `{
        id
        friendList
      }`
    )
    return ctx.db.query.posts({ where: { author: { id_in: getUser.friendList } } }, info);
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
  boxQuery(parent, { sender }, ctx, info) {
    const userId = getUserId(ctx)
    return ctx.db.query.messages({
      where: {
        AND: [{ sender: { OR: [{ id_in: [sender, userId] }] } }, { target: { OR: [{ id_in: [sender, userId] }] } }]
      }
    }, info)
  },
  messageQuery(parent, args, ctx, info) {
    const userId = getUserId(ctx)
    return ctx.db.query.messages({ where: { OR: [{ sender: { id: userId } }, { target: { id: userId } }], } }, info)
  },
  async friendQuery(parent, { target }, ctx, info) {
    const getUser = await ctx.db.query.user({ where: { id: target } },
      `{
        id
        name
        friendList
      }`
    )
    const friendList = getUser.friendList
    const newList = friendList.map(async (friend) => {
      const currUser = await ctx.db.query.user({ where: { id: friend } })
      return { id: currUser.id, name: currUser.name }
    })
    return { friendList: newList, proId: getUser.id, proName: getUser.name }
  },

  async sidebarFriendQuery(parent, args, ctx, info) {
    const userId = getUserId(ctx)
    const getUser = await ctx.db.query.user({ where: { id: userId } },
      `{
        id
        name
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