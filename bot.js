'use strict'

const Botkit     = require('botkit')
const mongoStore = require('./lib/mongo_storage')
const { parsedUptime, stripKeyword, prettyJson } = require('./lib/bot_tools')
const { imageSearch, urban, XBL }    = require('./lib/bot_plugins')

const controller = Botkit.slackbot({
  debug: process.env.NODE_ENV === 'development',
  storage: new mongoStore({host: 'mongodb'})
})

controller.spawn({
  token: process.env.SLACK_TOKEN
}).startRTM()

controller.setupWebserver(5000, (err, express_webserver) => {
  controller.createWebhookEndpoints(express_webserver)
})


// image search
controller.hears('^!(img |gif )', 'ambient', (bot, message) => {
  const query   = stripKeyword(message)
  const keyword = message.text.match(/^.{4}/)[0]
  imageSearch( keyword === '!gif' ? `gif ${query}` : query )
    .then((link) => bot.reply(message, link))
    .catch((err) => bot.reply(message, err))
})

// urban dictionary search
controller.hears('^!urban', 'ambient', (bot, message) => {
  const query = stripKeyword(message)
  urban(query)
    .then((link) => bot.reply(message, link))
    .catch((err) => bot.reply(message, err))
})

// used for checking status
controller.hears('^!ping', 'ambient', (bot, message) => {
  bot.reply(message, `Pong!\n\`Uptime: ${parsedUptime(process.uptime())}\``)
})

// xbox live status checker
controller.hears('^!live', 'ambient', (bot, message) => {
  const gamertag = stripKeyword(message)
  XBL.getXuid(gamertag)
      .then(XBL.getPresence)
      .then((presence) => XBL.prepareResponse(presence, gamertag))
      .then((response) => bot.reply(message, response))
      .catch((err) => bot.reply(message, new Error(err)))
})

// returns last activity for a user
controller.hears('^!seen', 'ambient', (bot, message) => {
  const query = stripKeyword(message)
  let response = {}
  controller.storage.users.where({name: query})
    .then((user) => controller.storage.messages.where({user: user[0].id}))
    .then((messages) => {
      let lastMessage  = messages.slice(-1)[0]
      response.user    = query
      response.message = lastMessage.text
      response.time    = lastMessage.ts
      return lastMessage.channel
    })
    .then((id) => controller.storage.channels.where({id}))
    .then((channel) => {
      response.channel = channel[0].name
      bot.reply(message, prettyJson(response))
    })
})


////////////////////////////////////////////////////////////
// sets up admin tools/listeners
require('./lib/admin_listeners')(controller)

// message logging; no output; must be last
controller.hears('.*', 'ambient', (bot, message) => {
  if (message.channel[0] === "G") return // don't log messages from private rooms
  controller.storage.messages.save(message)
})
