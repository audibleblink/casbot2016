"use strict"

const monogoDB = require('monk')

module.exports = function(config={}) {

  const defaults = {
    host: "localhost",
    port: 27017,
    methods: ['teams', 'users', 'channels', 'messages']
  }

  const settings = Object.assign({}, defaults, config)
  const client   = monogoDB(`${settings.host}/db`)

  // Implements required API methodss
  return settings.methods.reduce((storage, method) => {
    const storeName = client.get(method)

    storage[method] = {
      get(id) {
        return storeName.findById(id)
      },

      save(object={}) {
        return storeName.findAndModify({id: object.id}, object, {upsert: true, new: true})
      },

      all() {
        return storeName.find({})
      },

      where(object={}) {
        return storeName.find(object)
      }
    }

    return storage
  }, {})
}
