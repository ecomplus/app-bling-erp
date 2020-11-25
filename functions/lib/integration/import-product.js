const { firestore } = require('firebase-admin')
const ecomClient = require('@ecomplus/client')
const getAppData = require('../store-api/get-app-data')
const updateAppData = require('../store-api/update-app-data')
const Tiny = require('../bling/constructor')
const parseProduct = require('./parsers/product-to-ecomplus')
const handleJob = require('./handle-job')

module.exports = ({ appSdk, storeId, auth }, tinyToken, queueEntry, appData, canCreateNew, isHiddenQueue) => {
  const [sku, productId] = String(queueEntry.nextId).split(';:')

  return firestore().collection('tiny_stock_updates')
    .where('ref', '==', `${storeId}_${tinyToken}_${sku}`)
    .limit(10)
    .get().then(querySnapshot => {
      let tinyStockUpdate
      querySnapshot.forEach(documentSnapshot => {
        tinyStockUpdate = documentSnapshot.data()
        documentSnapshot.ref.delete().catch(console.error)
      })
      return tinyStockUpdate
    })

    .then(tinyStockUpdate => {
      const findingProduct = productId
        ? ecomClient.store({
          storeId,
          url: `/products/${productId}.json`
        })
          .then(({ data }) => data)
          .catch(err => {
            if (err.response && err.response.status >= 400 && err.response.status < 500) {
              console.log(`#${storeId} ${productId} => ${err.response.status}`)
              return null
            }
            console.error(err)
            throw err
          })

        : ecomClient.search({
          storeId,
          url: '/items.json',
          data: {
            query: {
              bool: {
                should: [{
                  term: { sku }
                }, {
                  nested: {
                    path: 'variations',
                    query: {
                      bool: {
                        filter: [{
                          term: { 'variations.sku': sku }
                        }]
                      }
                    }
                  }
                }]
              }
            }
          }
        }).then(({ data }) => {
          const hit = Array.isArray(data.hits.hits) && data.hits.hits[0] && data.hits.hits[0]
          if (hit) {
            const { _id, _source } = hit
            if (_source.variations && _source.variations.length) {
              return ecomClient.store({
                storeId,
                url: `/products/${_id}.json`
              }).then(({ data }) => data)
            }
            return {
              _id,
              ..._source
            }
          }
          return null
        })

      return findingProduct
        .then(product => {
          const hasVariations = product && product.variations && product.variations.length
          if (hasVariations) {
            const variation = product.variations.find(variation => sku === variation.sku)
            if (variation) {
              return {
                product,
                variationId: variation._id,
                hasVariations
              }
            } else if (isHiddenQueue) {
              return null
            } else if (!appData.update_product) {
              const msg = sku +
                ' corresponde a um produto com variações, especifique o SKU da variação para importar.'
              const err = new Error(msg)
              err.isConfigError = true
              handleJob({ appSdk, storeId }, queueEntry, Promise.reject(err))
              return null
            }
          }
          return { product, hasVariations }
        })

        .then(payload => {
          const dispatchNullJob = () => handleJob({ appSdk, storeId }, queueEntry, Promise.resolve(null))
          if (!payload) {
            console.log(`#${storeId} not found ${sku}`)
            dispatchNullJob()
            return payload
          }
          const { product, variationId, hasVariations } = payload
          const tiny = new Tiny(tinyToken)

          if (!product && isHiddenQueue) {
            dispatchNullJob()
            console.log(`#${storeId} skipping ${sku} / ${productId}`)
            return
          }

          const handleTinyStock = ({ produto }, tinyProduct) => {
            let quantity = Number(produto.saldo)
            if (product && (!appData.update_product || variationId)) {
              if (!isNaN(quantity)) {
                if (quantity < 0) {
                  quantity = 0
                }
                let endpoint = `/products/${product._id}`
                if (variationId) {
                  endpoint += `/variations/${variationId}`
                }
                endpoint += '/quantity.json'
                console.log(`#${storeId} ${endpoint}`, { quantity })
                return appSdk.apiRequest(storeId, endpoint, 'PUT', { quantity }, auth)
              }
              return null
            }

            return tiny.post('/produto.obter.php', { id: tinyProduct.id })
              .then(({ produto }) => {
                let method, endpoint
                let productId = product && product._id
                if (productId) {
                  method = 'PATCH'
                  endpoint = `/products/${productId}.json`
                } else {
                  method = 'POST'
                  endpoint = '/products.json'
                }
                return parseProduct(produto, storeId, auth, method === 'POST').then(product => {
                  if (!isNaN(quantity)) {
                    product.quantity = quantity >= 0 ? quantity : 0
                  }
                  console.log(`#${storeId} ${method} ${endpoint}`)
                  const promise = appSdk.apiRequest(storeId, endpoint, method, product, auth)

                  if (Array.isArray(produto.variacoes) && produto.variacoes.length) {
                    promise.then(({ response }) => {
                      return getAppData({ appSdk, storeId, auth })
                        .then(appData => {
                          let skus = appData.__importation && appData.__importation.skus
                          if (!Array.isArray(skus)) {
                            skus = []
                          }
                          let isQueuedVariations = false
                          produto.variacoes.forEach(({ variacao }) => {
                            const { codigo } = variacao
                            let skuAndId = codigo
                            if (!productId) {
                              productId = response.data && response.data._id
                            }
                            if (productId) {
                              skuAndId += `;:${productId}`
                            }
                            if (!skus.includes(codigo) && !skus.includes(skuAndId)) {
                              isQueuedVariations = true
                              skus.push(skuAndId)
                            }
                          })
                          return isQueuedVariations
                            ? updateAppData({ appSdk, storeId, auth }, {
                              __importation: {
                                ...appData.__importation,
                                skus
                              }
                            })
                            : true
                        })
                    }).catch(console.error)
                  }

                  return promise
                })
              })
          }

          console.log(`#${storeId} ${JSON.stringify({ sku, productId, hasVariations, variationId })}`)
          let job
          if (tinyStockUpdate && isHiddenQueue) {
            job = handleTinyStock(tinyStockUpdate)
          } else {
            job = tiny.post('/produtos.pesquisa.php', { pesquisa: sku })
              .then(({ produtos }) => {
                if (Array.isArray(produtos)) {
                  let tinyProduct = produtos.find(({ produto }) => sku === String(produto.codigo))
                  if (tinyProduct) {
                    tinyProduct = tinyProduct.produto
                    if (!hasVariations || variationId) {
                      if (tinyStockUpdate) {
                        return handleTinyStock(tinyStockUpdate, tinyProduct)
                      }
                      return tiny.post('/produto.obter.estoque.php', { id: tinyProduct.id })
                        .then(tinyStock => handleTinyStock(tinyStock, tinyProduct))
                    } else {
                      return handleTinyStock({ produto: {} }, tinyProduct)
                    }
                  }
                }

                const msg = `SKU ${sku} não encontrado no Tiny`
                const err = new Error(msg)
                err.isConfigError = true
                throw new Error(err)
              })
          }

          handleJob({ appSdk, storeId }, queueEntry, job)
        })
    })
}
