// const { getUserId } = require('../utils')

// const Subscription = {
//   messageSubscription: async (parent, { sender }, ctx, info) => {
//     const userId = getUserId(ctx)
//     const response = await ctx.db.subscription.messages({
//       // where: {
//       //   AND: [{ sender: { OR: [{ id_in: [sender, userId] }] } }, { target: { OR: [{ id_in: [sender, userId] }] } }]
//       // }
//     }, info)
//     console.log("BLAH", response)
//     return response
//   },
// }

// module.exports = { Subscription }

const messageSub = {
  subscribe: (parent, args, ctx, info) => {
    const response = ctx.db.subscription.message(
      { },
      info,
    )
    console.log("BLAH", response)
    return response
  },
}

module.exports = {
  messageSub,
}