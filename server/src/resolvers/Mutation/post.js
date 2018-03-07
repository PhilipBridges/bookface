const { getUserId } = require('../../utils')

const post = {
  async createPost(parent, { title, text, target }, ctx, info) {
    const userId = await getUserId(ctx)
    console.log(userId)
    return ctx.db.mutation.createPost(
      {
        data: {
          title,
          text,
          author: {
            connect: { id: userId },
          },
          target: {
            connect: { id: target }
          }
        },
      },
      info
    )
  },

  async deletePost(parent, { id }, ctx, info) {
    const userId = getUserId(ctx)
    const postExists = await ctx.db.exists.Post({
      id,
      author: { id: userId },
    })
    if (!postExists) {
      throw new Error(`Post not found or you're not the author`)
    }

    return ctx.db.mutation.deletePost({ where: { id } })
  },
}

module.exports = { post }
