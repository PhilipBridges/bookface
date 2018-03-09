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
}

module.exports = { Query }