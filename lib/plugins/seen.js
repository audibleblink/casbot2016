'use strict'

module.exports = (controller, query) => {
  let response = {}
  return controller.storage.users.where({name: query})
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
      return render(response)
    })
}


const render = (obj) => {
  return `> ${obj.user} was last seen in #${obj.channel} saying "${obj.message}" on ${parseTime(obj.time)}"`
}

const parseTime = (epoch) => {
  let d = new Date(0)
  d.setUTCSeconds(epoch)
  return d
}
