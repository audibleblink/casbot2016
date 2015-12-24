const redis = require('redis')

/*
 * All optionnals
 *
 * config = {
 *  namespace: namespace,
 *  host: host,
 *  port: port
 * }
 */
module.exports = function(config={}) {

  const defaults = {
    namespace: "botkit:store",
    host: "localhost",
    port: 6379,
    methods: ['teams', 'users', 'channels', 'messages']
  }

  const settings = Object.assign({}, defaults, config)
  const client = redis.createClient(settings)

  // Implements required API methods
  return settings.methods.reduce((storage, method) => {

    storage[method] = ((hash) => {

      const storeName = `${config.namespace}:${hash}`
      return {

        get(id) {

          return new Promise((resolve, reject) => {
            client.hget(storeName, id, (err, res) => {
              err ? reject(err) : resolve(JSON.parse(res))
            })
          })

        },

        save(object) {
          if (!object.id) return reject(new Error('The given object must have an id property'))

          return new Promise((resolve, reject) => {
            client.hset(storeName, object.id, JSON.stringify(object), (err, res) => {
              err ? reject(err) : resolve(JSON.parse(res))
            })
          })

        },

        all() {

          return new Promise((resolve, reject) => {
            client.hgetall(storeName, (err, res) => {
              if (err) {
                reject(err)
              } else if (null === res) {
                resolve(res)
              } else {
                const results = res.map((item) => JSON.parse(item))
                resolve(results)
              }
            })
          })

        }

      }
    })()
    return storage
  }, {})

}
