'use strict'

const request = require('request')

const auth = encodeURIComponent(process.env.GOOGLE_TOKEN)
const cx = encodeURIComponent(process.env.GOOGLE_CX)
const baseUri = 'https://www.googleapis.com/customsearch/v1'

module.exports = (queryString) => {
  const url = buildUrl(queryString)
  return new Promise((resolve, reject) => {
    request.get(url, (err, resp, body) => {
      if (err) {
        reject(err)
      } else {
        try {
          const imageUrl = JSON.parse(body).items[0].pagemap.cse_image[0].src
          resolve(imageUrl)
        } catch (e) {
          reject('No images found')
        }
      }
    })
  })
}

const buildUrl = (query) => {
  return `${baseUri}?key=${auth}&cx=${cx}&q=${query}`
}
