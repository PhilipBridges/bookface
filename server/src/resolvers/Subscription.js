const Subscription = {
  message: {
    subscribe: (parent, args, ctx, info) => ctx.db.subscription.message({}, info)
  }
}

module.exports = {
  Subscription,
}