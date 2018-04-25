const { getUserId } = require('../../utils')
const fs = require('fs');
const { upload } = require('now-storage');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const { createWriteStream } = require("fs");
const mkdirp = require('mkdirp')

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
    const { stream, filename } = await file;

    const storeUpload = ({ stream, filename }) => {
      new Promise((resolve, reject) =>
        stream
          .pipe(createWriteStream(`pics/${userId}/profile.jpg`))
          .on("finish", () => resolve())
          .on("error", reject)
      )
    }

    await storeUpload({ stream, filename });

    const image = await readFile(`pics/${userId}/profile.jpg`);

    const { url } = await upload(process.env.NOW_TOKEN, {
      name: 'profile.jpg',
      content: image
    });

    await ctx.db.mutation.updateUser({
      where: { id: userId },
      data: {
        profilePic: "https://" + url
      }
    })
    return true
  },

  updateUsers(parent, { target }, ctx, info) {
    ctx.db.mutation.updateManyUsers({
      data: {
        profilePic: "/avatar.png"
      }
    })
    return {count: 0}
  }
}


module.exports = {
  user
}