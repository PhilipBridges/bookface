const { getUserId } = require('../../utils')

const message = {
  async createMessage(parent, { text, target }, ctx, info) {
    const userId = getUserId(ctx)
    const receiver = await ctx.db.query.user({ where: { name: target } })
    if (receiver == null) {
      return {data: null}
    }
    return ctx.db.mutation.createMessage({
      data: {
        text,
        sender: {
          connect: { id: userId },
        },
        target: {
          connect: { name: target }
        }
      },
    }, info)
  },
  async deleteMessage(parents, { id }, ctx, info) {
    const userId = getUserId(ctx)
    return ctx.db.mutation.deleteMessage({
      where: { id }
    })
  }
}

module.exports = {
  message
}