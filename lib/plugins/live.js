'use strict'

const xboxApi = require('node-xbox')
const Views   = require('./live-views')
const client  = xboxApi(process.env.XBOX_API)

module.exports = (gamertag) => {
  return getXuid(gamertag)
    .then(getPresence)
    .then((presence) => prepareResponse(presence, gamertag))
}

const getXuid = (gamertag) => {
  return new Promise((resolve, reject) => {
    client.profile.xuid(gamertag, (err, data) => {
      err ? reject(new Error(err)) : resolve(data)
    })
  })
}

const getPresence = (xuid) => {
  return new Promise((resolve, reject) => {
    client.profile.presence(xuid, (err, data) => {
      err ? reject(new Error(err)) : resolve(data)
    })
  })
}

const prepareResponse = (presenceJson, gamertag) => {
  let presence = JSON.parse(presenceJson)
  let reply    = `${gamertag} is ${presence.state}\n`

  if (presence.state === 'Offline') {
    return Views.formatForOffline(reply, presence)
  } else if (presence.state === 'Online') {
    return Views.formatForOnline(reply, presence)
  }
}
