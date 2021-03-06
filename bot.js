'use strict'

const Botkit     = require('botkit')
const MongoStore = require('./lib/mongo_storage')

const { parsedUptime } = require('./lib/bot_tools')
const { imageSearch, urban, liveStatus, seen } = require('./lib/bot_plugins')

const controller = Botkit.slackbot({
  debug: process.env.NODE_ENV === 'development',
  storage: new MongoStore({host: 'mongodb'})
})

controller.spawn({
  token: process.env.SLACK_TOKEN
}).startRTM()

controller.setupWebserver(5000, (err, express_webserver) => {
  if (err) throw err
  controller.createWebhookEndpoints(express_webserver)
})

// image search
controller.hears('^!(img|gif)(.*)', 'ambient', (bot, message) => {
  const keyword = message.match[1]
  const query   = message.match[2]
  imageSearch(keyword === 'gif' ? `gif ${query}` : query)
    .then((link) => bot.reply(message, link))
    .catch((err) => bot.reply(message, err))
})

// urban dictionary search
controller.hears('^!urban (.*)', 'ambient', (bot, message) => {
  const query = message.match[1]
  urban(query)
    .then((link) => bot.reply(message, link))
    .catch((err) => bot.reply(message, err))
})

// used for checking status
controller.hears('^!ping', 'ambient', (bot, message) => {
  bot.reply(message, `Pong!\n\`Uptime: ${parsedUptime(process.uptime())}\``)
})

// xbox live status checker
controller.hears('^!live (.*)', 'ambient', (bot, message) => {
  const gamertag = message.match[1]
  liveStatus(gamertag)
    .then((response) => bot.reply(message, response))
    .catch((err) => bot.reply(message, err))
})

// returns last activity for a user
controller.hears('^!seen (.*)', 'ambient', (bot, message) => {
  const query = message.match[1]
  seen(controller, query)
    .then((res) => bot.reply(message, res))
})





// //////////////////////////////////////////////////
// sets up admin tools/listeners
require('./lib/admin_listeners')(controller)

// message logging; no output; must be last
controller.hears('.*', 'ambient', (bot, message) => {
  if (message.channel[0] === 'G') return // don't log messages from private rooms
  controller.storage.messages.save(message)
})
