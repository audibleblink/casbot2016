'use strict'

const request = require('request')
const token   = process.env.IMGUR_TOKEN
const baseUri = 'https://api.imgur.com/3/gallery/search/top'

module.exports = (queryString) => {
  const options = {
    url: `${baseUri}?q_all=${encodeURIComponent(queryString)}`,
    headers: {
      'Authorization': `Client-ID ${token}`
    }
  }
  return new Promise((resolve, reject) => {
    request.get(options, (err, resp, body) => {
      if (err) {
        reject(err)
      } else {
        try {
          const data = JSON.parse(body).data
          const pics = data.filter(el => !el.is_album)
          resolve(pics[0].link)
        } catch (e) {
          reject('No images found')
        }
      }
    })
  })
}
