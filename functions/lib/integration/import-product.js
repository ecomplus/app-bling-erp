const { firestore } = require('firebase-admin')
const ecomClient = require('@ecomplus/client')
const Bling = require('../bling/constructor')
const parseProduct = require('./parsers/product-to-ecomplus')
const handleJob = require('./handle-job')

module.exports = ({ appSdk, storeId, auth }, blingToken, blingStore, blingDeposit, queueEntry, appData, _, isHiddenQueue) => {
  const [sku, productId] = String(queueEntry.nextId).split(';:')
  let blingProductCode = sku

  return new Promise((resolve, reject) => {
    if (queueEntry.blingStockUpdate) {
      resolve(queueEntry.blingStockUpdate)
      return
    }

    firestore().collection('bling_stock_updates')
      .where('ref', '==', `${storeId}_${blingToken}_${sku}`)
      .get()
      .then(querySnapshot => {
        let blingStockUpdate, lastUpdateTime
        const timestamp = Date.now()
        querySnapshot.forEach(documentSnapshot => {
          const updateTime = documentSnapshot.updateTime.toDate().getTime()
          if (
            timestamp - updateTime <= 1000 * 60 * 15 &&
            (!lastUpdateTime || updateTime > lastUpdateTime)
          ) {
            lastUpdateTime = updateTime
            blingStockUpdate = documentSnapshot.get('estoque')
          }
          documentSnapshot.ref.delete().catch(console.error)
        })
        resolve(blingStockUpdate)
      })
      .catch(reject)
  })

    .then(blingStockUpdate => {
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
            size: 1,
            query: {
              bool: {
                must: {
                  term: { skus: sku }
                },
                should: [
                  { term: { visible: true } },
                  { term: { available: true } }
                ]
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
          if (!payload && !appData.import_product) {
            console.log(`#${storeId} not found ${sku}`)
            dispatchNullJob()
            return payload
          }
          const { product, variationId, hasVariations } = payload
          const bling = new Bling(blingToken)

          if (!product && (isHiddenQueue || productId) && !appData.import_product) {
            dispatchNullJob()
            console.log(`#${storeId} skipping ${sku} / ${productId}`)
            return
          }

          if (product && product.metafields) {
            const metafield = product.metafields.find(({ field }) => field === 'bling:codigo')
            if (metafield) {
              blingProductCode = metafield.value
            }
          }

          const handleBlingStock = (blingProduct, isStockOnly) => {
            if (blingDeposit) {
              let blingItems = [blingProduct]
              if (Array.isArray(blingProduct.variacoes)) {
                blingItems = blingItems.concat(blingProduct.variacoes)
              }
              blingItems.forEach(blingItem => {
                if (Array.isArray(blingItem.depositos)) {
                  const deposit = blingItem.depositos.find(({ deposito }) => String(deposito.id) === String(blingDeposit))
                  if (deposit && deposit.deposito) {
                    let quantity
                    if (Number(storeId) === 51292 || appData.has_stock_reserve) {
                      quantity = Number(deposit.deposito.saldoVirtual)
                    } else {
                      quantity = Number(deposit.deposito.saldo)
                    }
                    if (!isNaN(quantity)) {
                      blingItem.estoqueAtual = quantity
                      delete blingItem.depositos
                    }
                  }
                }
              })
            }
            let quantity = Number(blingProduct.estoqueAtual)
            if (product && (isStockOnly === true || !appData.update_product || variationId)) {
              if (!isNaN(quantity)) {
                if (quantity < 0) {
                  quantity = 0
                }
                let endpoint = `/products/${product._id}`
                if (variationId) {
                  endpoint += `/variations/${variationId}`
                }
                endpoint += '/quantity.json'
                console.log(`#${storeId} ${endpoint}`, { quantity, sku })
                return appSdk.apiRequest(storeId, endpoint, 'PUT', { quantity }, auth)
              }
              return null
            }

            let method, endpoint
            const productId = product && product._id
            if (productId) {
              method = 'PATCH'
              endpoint = `/products/${productId}.json`
            } else {
              method = 'POST'
              endpoint = '/products.json'
            }
            if (method === 'POST' && blingProduct.codigoPai) {
              console.log(`#${storeId} skipping ${sku} - is a variation`)
              return
            }
            return parseProduct(blingProduct, product && product.variations, storeId, auth, method === 'POST', appData)
              .then(product => {
                if (!isNaN(quantity)) {
                  product.quantity = quantity >= 0 ? quantity : 0
                }
                console.log(`#${storeId} ${method} ${endpoint}`)
                
                return appSdk.apiRequest(storeId, endpoint, method, product, auth)
              })
          }

          console.log(`#${storeId} ${JSON.stringify({ sku, productId, hasVariations, variationId })}`)
          let job
          if (blingStockUpdate && isHiddenQueue && !appData.update_product_auto && !appData.import_product) {
            job = handleBlingStock(blingStockUpdate, true)
          } else {
            job = bling.get(`/produto/${blingProductCode}`, {
              params: {
                estoque: 'S',
                imagem: 'S',
                loja: blingStore
              }
            }).then(({ data }) => {
              if (Array.isArray(data.produtos)) {
                const blingProduct = data.produtos.find(({ produto }) => blingProductCode === String(produto.codigo))
                if (blingProduct) {
                  return handleBlingStock(blingProduct.produto)
                }
              }
              const msg = `SKU ${sku} não encontrado no Bling`
              const err = new Error(msg)
              err.isConfigError = true
              throw new Error(err)
            })
          }

          handleJob({ appSdk, storeId }, queueEntry, job)
        })
    })
}
