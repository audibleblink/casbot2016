'use strict'

const { prettyJson, stripKeyword } = require('./bot_tools')

module.exports = (controller) => {

  // populates users
  controller.hears('^!db:seed:users', 'direct_message', (bot, message) => {
    bot.api.users.list({}, (err, res) => {
      if (err) return bot.reply(message, new Error(err))
      res.members.forEach((thing) => {
        controller.storage.users.update(thing)
      })
    })
  })

  // populates channels
  controller.hears('^!db:seed:channels', 'direct_message', (bot, message) => {
    bot.api.channels.list({}, (err, res) => {
      if (err) return bot.reply(message, new Error(err))
      res.channels.forEach((thing) => {
        controller.storage.channels.update(thing)
      })
    })
  })

  // populates groups
  controller.hears('^!db:seed:groups', 'direct_message', (bot, message) => {
    bot.api.groups.list({}, (err, res) => {
      if (err) return bot.reply(message, new Error(err))
      res.groups.forEach((thing) => {
        controller.storage.groups.update(thing)
      })
    })
  })

  // see a user's info
  controller.hears('^!info', 'direct_message', (bot, message) => {
    const user = stripKeyword(message)
    controller.storage.users.where({name: user})
      .then((userInfo) => bot.reply(message, prettyJson(userInfo)))
  })

  controller.hears('^!all', 'direct_message', (bot, message) => {
    const model = stripKeyword(message)
    controller.storage[model].all()
      .then((coll) => coll.map((el) => el.name))
      .then((names) => bot.reply(message, prettyJson(names)))
  })


}
