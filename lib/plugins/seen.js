'use strict'
const moment  = require('moment')
const Promise = require('bluebird')

module.exports = Promise.coroutine(function * (controller, query) {
  const user        = yield controller.storage.users.where({name: query})
  const messages    = yield controller.storage.messages.where({user: user[0].id})
  const lastMessage = messages.slice(-1)[0]
  const channel     = yield controller.storage.channels.where({id: lastMessage.channel})
  const response = {
    user: query,
    message: lastMessage.text,
    time: lastMessage.ts,
    channel: channel[0].name
  }
  return render(response)
})

const render = (obj) => {
  return `> ${obj.user} was last seen ${parseTime(obj.time)} in #${obj.channel} saying "${obj.message}" `
}

const parseTime = (unixTime) => {
  return moment.unix(unixTime).fromNow()
}
