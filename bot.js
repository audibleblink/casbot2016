const Botkit = require('botkit')
const imageSearch = require('./lib/image_search')
const urban = require('./lib/urban')

const controller = Botkit.slackbot({
  debug: true
})

controller.spawn({
  token: process.env.SLACK_TOKEN
}).startRTM()



controller.hears('hello', 'direct_message,direct_mention,mention', (bot, message) => {
  bot.reply(message, 'Hello yourself.')
})

// image search
controller.hears('!img', 'ambient', (bot, message) => {
  const query = message.text.replace(/^!img\W/, '')
  imageSearch(query)
    .then((link) => bot.reply(message, link))
    .catch((err) => bot.reply(message, err))
})

// urban dictionary search
controller.hears('!urban', 'ambient', (bot, message) => {
  const query = message.text.replace(/^!img\W/, '')
  urban(query)
    .then((link) => bot.reply(message, link))
    .catch((err) => bot.reply(message, err))
})

// used for checking status
controller.hears('!ping', 'ambient', (bot, message) => {
  bot.reply(message, "Pong!")
})
