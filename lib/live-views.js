"use strict"

const formatForOffline = (reply, presence) => {
  if (presence.lastSeen) {
    let date = formatDate(new Date(Date.parse(presence.lastSeen.timestamp)))
    reply += `Last seen: ${date}\nPlaying: ${presence.lastSeen.titleName}`
  }
  return reply
}

const formatForOnline = (reply, presence) => {
  let consoles = presence.devices
  consoles.forEach((console) => {
    reply += "Playing: "
    if (console.type === "Xbox360") {
      reply += console.titles[0].name
    } else if (console.type === "XboxOne") {
      let game = console.titles.filter((app) => app.placement === "Full")[0]
      reply += game.name
    }
    reply += ` on ${console.type}`
  })
  return reply
}

const formatDate = (date) => {
  const hours   = date.getHours()
  let minutes = date.getMinutes()
  minutes = minutes < 10 ? '0' + minutes : minutes
  const strTime = `${hours}:${minutes}`
  return `${strTime} on ${date.getMonth() + 1}.${date.getDate()}.${date.getFullYear()}`
}

module.exports = { formatForOnline, formatForOffline }
