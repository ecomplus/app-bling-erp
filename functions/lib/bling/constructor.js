const axios = require('axios')
const js2xmlparser = require('js2xmlparser')

module.exports = function (apikey) {
  // https://ajuda.bling.com.br/hc/pt-br/categories/360002186394-API-para-Desenvolvedores
  const instance = axios.create({
    baseURL: 'https://bling.com.br/Api/v2/',
    timeout: 15000,
    params: { apikey }
  })

  this.get = (url, options) => {
    if (url.indexOf('/json/') === -1) {
      url += '/json/'
    }
    return instance.get(url, options)
  }

  this.post = (url, body, options) => {
    let xml
    if (body) {
      const root = Object.keys(body)[0]
      if (root) {
        xml = js2xmlparser.parse(root, body[root])
      }
    }
    return instance.post(url, { xml, apikey }, {
      timeout: 30000,
      ...options
    })
  }

  this.delete = (url, options) => {
    return instance.delete(url, options)
  }

  return this
}
