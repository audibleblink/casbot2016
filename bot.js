"use strict"

const Botkit      = require('botkit')
const redisStore  = require('./lib/redis_storage')
const { parsedUptime, stripKeyword } = require('./lib/bot_tools')
const { imageSearch, urban, XBL }    = require('./lib/bot_plugins')


const controller = Botkit.slackbot({
  debug: process.env.NODE_ENV === "development",
  // 'redis' is a hostname set in /etc/hosts by Docker
  storage: new redisStore({host: "redis"}) 
})

controller.spawn({
  token: process.env.SLACK_TOKEN
}).startRTM()

controller.setupWebserver(5000, (err,express_webserver) => {
  controller.createWebhookEndpoints(express_webserver)
})

// image search
controller.hears('!img|!gif', 'ambient', (bot, message) => {
  const query   = stripKeyword(message)
  const keyword = message.text.match(/^.{4}/)[0]
  imageSearch( keyword === '!gif' ? `gif ${query}` : query )
    .then((link) => bot.reply(message, link))
    .catch((err) => bot.reply(message, err))
})

// urban dictionary search
controller.hears('!urban', 'ambient', (bot, message) => {
  const query = stripKeyword(message)
  urban(query)
    .then((link) => bot.reply(message, link))
    .catch((err) => bot.reply(message, err))
})

// used for checking status
controller.hears('!ping', 'ambient', (bot, message) => {
  bot.reply(message, `Pong!\n\`Uptime: ${parsedUptime(process.uptime())}\``)
})

// xbox live status checker
controller.hears('!live', 'ambient', (bot, message) => {
  const gamertag = stripKeyword(message)
  XBL.getXuid(gamertag)
      .then(XBL.getPresence)
      .then((presence) => XBL.prepareResponse(presence, gamertag))
      .then((response) => bot.reply(message, response))
      .catch((err) => bot.reply(message, new Error(err)))
})
