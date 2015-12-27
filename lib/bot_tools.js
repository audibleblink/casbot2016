"use strict"

module.exports = {

  stripKeyword(message) {
    return message.text.replace(/^!.*\s/, '')
  },

  parsedUptime(totalSeconds) {
    const days    = Math.floor(totalSeconds / 86400)
    totalSeconds %= 86400
    const hours   = Math.floor(totalSeconds / 3600)
    totalSeconds %= 3600
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
    return `${days} days, ${hours} hours ${minutes} minutes ${seconds} seconds`
  },

  prettyJson(text) {
    return `\`\`\`${JSON.stringify(text, null, 2)}\`\`\``
  }
}
