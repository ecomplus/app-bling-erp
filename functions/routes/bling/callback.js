const axios = require('axios')
const { baseUri } = require('./../__env')
const getAppData = require('./../../lib/store-api/get-app-data')
const updateAppData = require('./../../lib/store-api/update-app-data')
const importProduct = require('./../../lib/integration/import-product')

exports.post = ({ appSdk, admin }, req, res) => {
  const startTime = Date.now()
  const blingToken = req.query.token
  const storeId = parseInt(req.query.store_id, 10)
  let retries = parseInt(req.query.retries, 10)
  if (isNaN(retries) || retries < 0) {
    retries = 0
  }

  if (storeId > 100 && typeof blingToken === 'string' && blingToken && req.body) {
    let { retorno } = req.body
    if (!retorno && typeof req.body.data === 'string') {
      try {
        const data = JSON.parse(req.body.data)
        retorno = data.retorno
      } catch (e) {
      }
    }

    if (retorno) {
      /*
      TODO: check Bling server IPs
      const clientIp = req.get('x-forwarded-for') || req.connection.remoteAddress
      */
      res.sendStatus(200)

      return appSdk.getAuth(storeId)
        .then(auth => {
          const appClient = { appSdk, storeId, auth }
          return getAppData(appClient)
            .then(appData => {
              if (appData.bling_api_token !== blingToken) {
                return null
              }
              let { estoques, pedidos } = retorno
              if (Array.isArray(estoques)) {
                if (Array.isArray(estoques[0])) {
                  estoques = estoques[0]
                  for (let i = 1; i < estoques.length; i++) {
                    estoques = estoques.concat(estoques[i])
                  }
                }

                if (estoques.length) {
                  if (appData.import_quantity === false || appData.export_quantity) {
                    return null
                  }
                  const blingStore = appData.bling_store

                  return new Promise((resolve, reject) => {
                    const saveToQueue = () => {
                      let skus = appData.___importation && appData.___importation.skus
                      if (!Array.isArray(skus)) {
                        skus = []
                      }
                      const promises = []
                      estoques.forEach(({ estoque }, i) => {
                        if (estoque && estoque.codigo) {
                          const sku = String(estoque.codigo)
                          console.log(`> Bling callback: #${storeId} ${sku}`)
                          promises.push(new Promise(resolve => {
                            setTimeout(() => {
                              admin.firestore().collection('bling_stock_updates').add({
                                ref: `${storeId}_${blingToken}_${sku}`,
                                estoque
                              })
                                .then(() => {
                                  if (!skus.includes(sku)) {
                                    skus.push(sku)
                                  }
                                  resolve()
                                })
                                .catch(console.error)
                            }, i * 330)
                          }))
                        }
                      })

                      if (promises.length) {
                        return Promise.all(promises)
                          .then(() => {
                            console.log(`> #${storeId} SKUs: ${JSON.stringify(skus)}`)
                            return updateAppData({ appSdk, storeId }, {
                              ___importation: {
                                ...appData.___importation,
                                skus
                              }
                            })
                          })
                          .then(resolve)
                          .catch(reject)
                      }
                      resolve(true)
                    }

                    let skuIndex = 0
                    const tryNextSku = () => {
                      const blingStockUpdate = estoques[skuIndex] && estoques[skuIndex].estoque
                      const nextId = blingStockUpdate && blingStockUpdate.codigo
                      if (nextId) {
                        console.log(`> Bling callback: #${storeId} ${nextId} => ${blingStockUpdate.estoqueAtual}`)
                        const queueEntry = {
                          nextId,
                          blingStockUpdate,
                          isNotQueued: true,
                          cb: (err, isDone) => {
                            if (!err && isDone) {
                              estoques.splice(skuIndex, 1)
                              skuIndex++
                              return tryNextSku()
                            }
                            saveToQueue()
                          }
                        }
                        importProduct(appClient, blingToken, blingStore, queueEntry, appData, false, true)
                          .catch(saveToQueue)
                      } else {
                        saveToQueue()
                      }
                    }
                    tryNextSku()
                  })
                }
              }

              if (Array.isArray(pedidos)) {
                let orderNumbers = appData.___importation && appData.___importation.order_numbers
                if (!Array.isArray(orderNumbers)) {
                  orderNumbers = []
                }
                let hasNewOrder = false
                pedidos.forEach(({ pedido }) => {
                  if (pedido && pedido.numero) {
                    const orderNumber = String(pedido.numero)
                    if (!orderNumbers.includes(orderNumber)) {
                      orderNumbers.push(orderNumber)
                      hasNewOrder = true
                    }
                  }
                })

                if (hasNewOrder) {
                  console.log(`> #${storeId} order numbers: ${JSON.stringify(orderNumbers)}`)
                  return updateAppData({ appSdk, storeId }, {
                    ___importation: {
                      ...appData.___importation,
                      order_numbers: orderNumbers
                    }
                  })
                }
              }
              return null
            })
        })

        .then(payload => {
          if (!res.headersSent) {
            res.sendStatus(200)
          }
          return payload
        })

        .catch(err => {
          console.error(err)
          if (!(retries > 3)) {
            retries++
            setTimeout(() => {
              axios.post(`${baseUri}/bling/callback`, req.body, {
                params: {
                  store_id: storeId,
                  token: blingToken,
                  retries
                }
              }).catch(console.error)
            }, Math.min(50 * 1000 - (Date.now() - startTime), 40 * 1000))
          }
          if (!res.headersSent) {
            res.sendStatus(502)
          }
        })
    } else {
      console.log(`#${storeId} unexpected Bling callback: ${JSON.stringify(req.body)}`)
      return res.status(200).send('Ignoring invalid request body')
    }
  }

  res.sendStatus(403)
}
