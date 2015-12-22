const urban = require('urban')

module.exports = (input) => {
  return new Promise((resolve, reject) => {
    const term = urban(input)
    term.first((word) => {
      word ? resolve(word.definition) : resolve("Word not found")
    })
  })
}
