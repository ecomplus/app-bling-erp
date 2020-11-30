const axios = require('axios')
const qs = require('querystring')
const js2xmlparser = require('js2xmlparser')

module.exports = function (apikey) {
  // https://ajuda.bling.com.br/hc/pt-br/categories/360002186394-API-para-Desenvolvedores
  const instance = axios.create({
    baseURL: 'https://bling.com.br/Api/v2/',
    timeout: 15000,
    params: { apikey }
  })

  const request = (method, options) => instance({
    method,
    ...options
  }).then(response => {
    const { data } = response
    if (data) {
      const { retorno } = data
      if (retorno.erros) {
        const err = new Error('Bling error response')
        response.status = 400
        err.response = response
        err.config = response.config
        err.request = response.request
        throw err
      }
      response.data = retorno
    }
    return response
  })

  const parseUrl = url => {
    if (url.indexOf('/json/') === -1) {
      if (url.slice(-1) !== '/') {
        url += '/'
      }
      return url + 'json/'
    }
    return url
  }

  this.get = (url, options) => {
    url = parseUrl(url)
    return request('get', { url, ...options })
  }

  ;['post', 'put'].forEach(method => {
    this[method] = (url, body, options) => {
      url = parseUrl(url)
      let xml
      if (body) {
        const root = Object.keys(body)[0]
        if (root) {
          xml = js2xmlparser.parse(root, body[root], {
            format: {
              pretty: false
            }
          })
        }
      }
      console.log(JSON.stringify(xml))
      return request(method, {
        url,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({ xml, apikey }),
        timeout: 30000,
        ...options
      })
    }
  })

  this.delete = (url, options) => {
    return request('delete', { url, ...options })
  }

  return this
}
