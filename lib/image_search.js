//TODO: Convert back to ES5

import * as request from 'request'

const auth    = encodeURIComponent(process.env.GOOGLE_TOKEN)
const cx      = encodeURIComponent(process.env.GOOGLE_CX)
const baseUri = "https://www.googleapis.com/customsearch/v1"

export default function(queryString, options = {}) {
  const url = buildUrl(queryString, options)
  return new Promise((resolve, reject) => {
    request.get(url, (err, resp, body) => {
      if (err) {
        reject(err)
      } else {
        try {
          const imageUrl = JSON.parse(body).items[0].pagemap.cse_image[0].src
          resolve(imageUrl)
        } catch(e) {
          console.log(e);
          resolve("No images found")
        }
      }
    })
  })
}

const buildUrl = (query, options) => {
  const defaults = { fileType: "jpg, png" }
  const settings = Object.assign({}, defaults, options)
  return `${baseUri}?key=${auth}&cx=${cx}&q=${query}&fileType=${settings.fileType}`
}
