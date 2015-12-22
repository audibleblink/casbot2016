"use strict"

const Botkit      = require('botkit')
const imageSearch = require('./lib/image_search')
const urban       = require('./lib/urban')
const XBL         = require("./lib/live")

const controller = Botkit.slackbot({
  debug: true
})

controller.spawn({
  token: process.env.SLACK_TOKEN
}).startRTM()


// image search
controller.hears('!img', 'ambient', (bot, message) => {
  const query = message.text.replace(/^!img\W/, '')
  imageSearch(query)
    .then((link) => bot.reply(message, link))
    .catch((err) => bot.reply(message, err))
})

// urban dictionary search
controller.hears('!urban', 'ambient', (bot, message) => {
  const query = message.text.replace(/^!urban\W/, '')
  urban(query)
    .then((link) => bot.reply(message, link))
    .catch((err) => bot.reply(message, err))
})

// used for checking status
controller.hears('!ping', 'ambient', (bot, message) => {
  bot.reply(message, "Pong!")
})

// xbox live status checker
controller.hears('!live', 'ambient', (bot, message) => {
  const gamertag = message.text.replace(/^!live\W/, '')
  XBL.getXuid(gamertag)
      .then(XBL.getPresence)
      .then((presence) => XBL.prepareResponse(presence, gamertag))
      .then((response) => bot.reply(message, response))
      .catch((err) => bot.reply(message, new Error(err)))
})
