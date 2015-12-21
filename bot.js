const Botkit = require('botkit');

const controller = Botkit.slackbot({
  debug: true
});

controller.spawn({
  token: process.env.SLACK_TOKEN
}).startRTM()



controller.hears('hello', 'direct_message,direct_mention,mention', function(bot, message) {
  bot.reply(message, 'Hello yourself.');
});


controller.hears('!img', 'ambient', function(bot, message) {
  bot.reply(message, 'WIP: Fetches images from a Google image search');
});
