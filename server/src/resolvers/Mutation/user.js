import * as mkdirp from 'mkdirp'
const { getUserId } = require('../../utils')
const { createReadStream, createWriteStream, fs } = require("fs");
var path = require('path');

const user = {
  async createRequest(parent, { target, text }, ctx, info) {
    const userId = getUserId(ctx)
    if (target == null) {
      return false
    }

    const dupeCheck = await ctx.db.query.friendRequests({
      where: { AND: [{ target: { id: target } }, { sender: { id: userId } }] }
    },
      `{
        id
        target {
          id
        }
        sender {
          id
        }
      }`
    )
    if (dupeCheck.length >= 1) {
      return false
    }

    const response = await ctx.db.mutation.createFriendRequest({
      data: {
        sender: { connect: { id: userId } },
        target: { connect: { id: target } },
        text
      }
    })
    return response
  },
  async deleteRequest(parent, { id }, ctx, info) {
    const userId = getUserId(ctx)
    const response = await ctx.db.mutation.deleteFriendRequest({
      where: { id }
    }, info)

    if (response !== null) {
      return true
    }
    return false
  },
  async deleteRequests(parent, args, ctx, info) {
    const response = await ctx.db.mutation.deleteManyFriendRequests({ where: { id_not: null } }, info)

    if (response !== null) {
      return { count: 0 }
    }
    return { count: 0 }
  },
  async addFriend(parent, { target, request }, ctx, info) {
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

    await ctx.db.mutation.deleteFriendRequest({ where: { id: request } }, info)

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
  },

  uploadFile: async (parent, { file }, ctx) => {
    const userId = getUserId(ctx)
    const dir = `pics/${userId}`

    await mkdirp.sync(dir)

    const storeUpload = ({ stream, filename }) => {
      new Promise((resolve, reject) =>
        stream
          .pipe(createWriteStream(`pics/${userId}/profile.jpg`))
          .on("finish", () => resolve())
          .on("error", reject)
      )
    }
    const { stream, filename } = await file;
    await storeUpload({ stream, filename });
    return true;
  }
}


module.exports = {
  user
}