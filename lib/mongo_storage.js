'use strict'

const monogoDB = require('monk')

module.exports = function (config = {}) {
  const defaults = {
    host: 'localhost',
    port: 27017,
    methods: ['teams', 'users', 'channels', 'messages', 'groups']
  }

  const settings = Object.assign({}, defaults, config)
  const client = monogoDB(`${settings.host}/db`)

  // Implements required API methodss
  return settings.methods.reduce((storage, method) => {
    const storeName = client.get(method)

    storage[method] = {
      get (id) {
        return storeName.find(id)
      },

      update (object = {}) {
        return storeName.findAndModify({id: object.id}, object, {upsert: true})
      },

      save (object = {}) {
        return storeName.insert(object)
      },

      all () {
        return storeName.find({})
      },

      where (object = {}) {
        return storeName.find(object)
      }
    }

    return storage
  }, {})
}
