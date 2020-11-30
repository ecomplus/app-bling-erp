const ecomUtils = require('@ecomplus/utils')
const ecomClient = require('@ecomplus/client')
const errorHandling = require('../store-api/error-handling')
const Bling = require('../bling/constructor')
const parseProduct = require('./parsers/product-to-bling')
const handleJob = require('./handle-job')

module.exports = ({ appSdk, storeId }, blingToken, blingStore, queueEntry, appData, canCreateNew) => {
  const productId = queueEntry.nextId
  return ecomClient.store({
    storeId,
    url: `/products/${productId}.json`
  })

    .then(({ data }) => {
      const product = data
      let blingProductCode, originalBlingProduct
      if (product.metafields) {
        const metafield = product.metafields.find(({ field }) => field === 'bling:codigo')
        if (metafield) {
          blingProductCode = metafield.value
        }
      }
      if (!blingProductCode) {
        blingProductCode = product.sku
      }
      const bling = new Bling(blingToken)

      const job = bling.get(`/produto/${blingProductCode}`, {
        params: {
          estoque: 'S',
          loja: blingStore
        }
      })
        .catch(err => {
          if (err.response && err.response.status === 404) {
            return {}
          }
          throw err
        })

        .then(({ data }) => {
          if (Array.isArray(data.produtos)) {
            originalBlingProduct = data.produtos.find(({ produto }) => product.sku === String(produto.codigo))
            if (originalBlingProduct) {
              originalBlingProduct = originalBlingProduct.produto
            } else if (!canCreateNew) {
              return null
            }
          }
          if (canCreateNew || appData.export_quantity || !blingStore) {
            const blingProduct = parseProduct(product, originalBlingProduct, blingProductCode, blingStore, appData)
            if (blingProduct) {
              const data = { produto: blingProduct }
              const endpoint = originalBlingProduct ? `/produto/${blingProductCode}` : '/produto'
              return bling.post(endpoint, data)
            }
          }
          return null
        })

        .then(response => {
          console.log(JSON.stringify(response.data))
          if (blingStore && (canCreateNew || appData.export_price)) {
            const method = originalBlingProduct && originalBlingProduct.produtoLoja ? 'put' : 'post'
            const data = {
              produtosLoja: {
                produtoLoja: {
                  idLojaVirtual: product._id,
                  preco: {
                    preco: ecomUtils.price(product)
                  }
                }
              }
            }
            if (ecomUtils.onPromotion(product)) {
              data.produtosLoja.produtoLoja.preco.precoPromocional = product.base_price
            }
            return bling[method](`/produtoLoja/${blingStore}/${blingProductCode}`, data)
          }
          return response
        })
      handleJob({ appSdk, storeId }, queueEntry, job)
    })

    .catch(err => {
      if (err.response) {
        const { status } = err.response
        if (status >= 400 && status < 500) {
          const msg = `O produto ${productId} não existe (:${status})`
          const err = new Error(msg)
          err.isConfigError = true
          handleJob({ appSdk, storeId }, queueEntry, Promise.reject(err))
          return null
        }
      }
      errorHandling(err)
      throw err
    })
}
