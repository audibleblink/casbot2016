'use strict'

module.exports = {

  parsedUptime (totalSeconds) {
    const times = {'days': 86400, 'hours': 3600, 'minutes': 60, 'seconds': 1}
    const t = Object.keys(times).reduce((memo, key) => {
      const divisor = Math.floor(totalSeconds / times[key])
      memo.push(`${divisor} ${key}`)
      totalSeconds %= times[key]
      return memo
    }, [])

    return t.join(', ')
  },

  prettyJson (text) {
    return `\`\`\`${JSON.stringify(text, null, 2)}\`\`\``
  }

}
