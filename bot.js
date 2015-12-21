const Botkit = require('botkit')
const imageSearch = require('./lib/image_search')

const controller = Botkit.slackbot({
  debug: true
})

controller.spawn({
  token: process.env.SLACK_TOKEN
}).startRTM()



controller.hears('hello', 'direct_message,direct_mention,mention', function(bot, message) {
  bot.reply(message, 'Hello yourself.')
})


controller.hears('!img', 'ambient', function(bot, message) {
  const query = message.text.replace(/^!img\W/, '')
  imageSearch(query)
    .then((link) => bot.reply(message, link))
    .catch((err) => bot.reply(message, err))
})
