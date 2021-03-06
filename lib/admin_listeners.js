'use strict'

const { prettyJson } = require('./bot_tools')

module.exports = (controller) => {
  // temporarily necessary until botkit removes the need for a team's
  // persistance to a db in order for slash-commands to work
  controller.storage.teams.update({id: 'T03E23VAN', name: 'Reddit Casual'})

  // populates users
  controller.hears('^!db:seed:users', 'direct_message', (bot, message) => {
    bot.api.users.list({}, (err, res) => {
      if (err) return bot.reply(message, new Error(err))
      res.members.forEach((thing) => {
        controller.storage.users.update(thing)
      })
      bot.reply(message, `Seeded ${res.members.length} users`)
    })
  })

  // populates channels
  controller.hears('^!db:seed:channels', 'direct_message', (bot, message) => {
    bot.api.channels.list({}, (err, res) => {
      if (err) return bot.reply(message, new Error(err))
      res.channels.forEach((thing) => {
        controller.storage.channels.update(thing)
      })
      bot.reply(message, `Seeded ${res.channels.length} channels`)
    })
  })

  // populates groups
  controller.hears('^!db:seed:groups', 'direct_message', (bot, message) => {
    bot.api.groups.list({}, (err, res) => {
      if (err) return bot.reply(message, new Error(err))
      res.groups.forEach((thing) => {
        controller.storage.groups.update(thing)
      })
      bot.reply(message, `Seeded ${res.groups.length} groups`)
    })
  })

  // see a user's info
  controller.hears('^!info (.*)', 'direct_message', (bot, message) => {
    const user = message.match[1]
    controller.storage.users.where({name: user})
      .then((userInfo) => bot.reply(message, prettyJson(userInfo)))
  })

  // all groups, channels, users bot has access to
  controller.hears('^!all (.*)', 'direct_message', (bot, message) => {
    const model = message.match[1]
    controller.storage[model].all()
      .then((coll) => coll.map((el) => el.name))
      .then((names) => bot.reply(message, prettyJson(names)))
  })
}
