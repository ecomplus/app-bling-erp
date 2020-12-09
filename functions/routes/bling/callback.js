const getAppData = require('../../lib/store-api/get-app-data')
const updateAppData = require('../../lib/store-api/update-app-data')

exports.post = ({ appSdk, admin }, req, res) => {
  const blingToken = req.query.token
  const storeId = parseInt(req.query.store_id, 10)

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
      return appSdk.getAuth(storeId).then(auth => {
        return getAppData({ appSdk, storeId, auth })

          .then(appData => {
            if (appData.bling_api_token !== blingToken) {
              return res.sendStatus(401)
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
                  return res.sendStatus(204)
                }
                let skus = appData.___importation && appData.___importation.skus
                if (!Array.isArray(skus)) {
                  skus = []
                }
                const promises = []
                estoques.forEach(({ estoque }) => {
                  if (estoque && estoque.codigo) {
                    const sku = String(estoque.codigo)
                    promises.push(new Promise(resolve => {
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
                    }))
                  }
                })

                if (promises.length) {
                  return Promise.all(promises).then(() => {
                    console.log(`> #${storeId} SKUs: ${JSON.stringify(skus)}`)
                    return updateAppData({ appSdk, storeId }, {
                      ___importation: {
                        ...appData.___importation,
                        skus
                      }
                    })
                  })
                }
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

          .then(payload => res.sendStatus(200))
          .catch(err => {
            console.error(err)
            res.sendStatus(502)
          })
      })
    } else {
      console.log(`#${storeId} unexpected Bling callback: ${JSON.stringify(req.body)}`)
      return res.status(200).send('Ignoring invalid request body')
    }
  }

  res.sendStatus(403)
}
