const { getUserId } = require('../../utils')

const message = {
  async createMessage(parent, { text, target }, ctx, info) {
    const userId = getUserId(ctx)
    const receiver = await ctx.db.query.user({ where: { name: target } })
    if (receiver == null) {
      return { data: null }
    }
    if (receiver.id === userId) {
      return { error: 'same' }
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
  },
  async deleteMessages(parents, { id }, ctx, info) {
    ctx.db.mutation.deleteManyMessages({
      where: { sender: { id: id } }
    })
    return { count: 0 }
  }
}

module.exports = {
  message
}