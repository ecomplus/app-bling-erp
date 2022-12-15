const admin = require('firebase-admin')
const { setup } = require('@ecomplus/application-sdk')

const getAppData = require('./../../lib/store-api/get-app-data')
const updateAppData = require('./../../lib/store-api/update-app-data')
const importProduct = require('./../../lib/integration/import-product')

const getAppSdk = () => {
  return new Promise(resolve => {
    setup(null, true, admin.firestore())
      .then(appSdk => resolve(appSdk))
  })
}

module.exports = async (
  {
    blingToken,
    storeId,
    retorno
  },
  context
) => {
  console.log('>> Exec Event ', context.eventId)
  const appSdk = await getAppSdk(admin)

  return appSdk.getAuth(storeId)
    .then(auth => {
      const appClient = { appSdk, storeId, auth }
      return getAppData(appClient)
        .then(appData => {
          if (appData.bling_api_token !== blingToken) {
            console.log(`> Ignoring Bling event with invalid token for #${storeId}`)
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
              const blingDeposit = appData.bling_deposit

              return new Promise((resolve, reject) => {
                let skuIndex = 0
                const tryNextSku = () => {
                  const blingStockUpdate = estoques[skuIndex] && estoques[skuIndex].estoque
                  const nextId = blingStockUpdate && blingStockUpdate.codigo
                  if (nextId) {
                    console.log(`> Bling callback: #${storeId} ${nextId} => ${JSON.stringify(blingStockUpdate)}`)
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
                        throw err
                      }
                    }
                    importProduct(appClient, blingToken, blingStore, blingDeposit, queueEntry, appData, false, true)
                  } else {
                    resolve(true)
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
              const documentRef = admin.firestore().doc(`bling_orders_tmp/${storeId}`)
              return documentRef.get().then(documentSnapshot => {
                if (documentSnapshot.exists) {
                  documentSnapshot.get('orderNumbers').forEach(orderNumber => {
                    if (!orderNumbers.includes(orderNumber)) {
                      orderNumbers.push(orderNumber)
                    }
                  })
                }

                return documentRef.set({ orderNumbers }).then(() => {
                  return new Promise((resolve, reject) => {
                    const unsubscribe = documentRef.onSnapshot(newDocumentSnapshot => {
                      if (
                        newDocumentSnapshot &&
                        newDocumentSnapshot.exists &&
                        newDocumentSnapshot.get('orderNumbers').length > orderNumbers.length
                      ) {
                        clearTimeout(proceedTimer)
                        resolve(null)
                      }
                    }, err => {
                      console.log(`Snapshot watcher error: ${err}`)
                    })

                    const proceedTimer = setTimeout(() => {
                      unsubscribe()
                      documentRef.delete().catch(console.error)
                      console.log(`> #${storeId} order numbers: ${JSON.stringify(orderNumbers)}`)
                      updateAppData({ appSdk, storeId }, {
                        ___importation: {
                          ...appData.___importation,
                          order_numbers: orderNumbers
                        }
                      }).then(resolve).catch(reject)
                    }, 1500)
                  })
                })
              })
            }
          }
          return null
        })
        .then(() => {
          console.log('>> End Event ', context.eventId)
        })
    })
    .catch((err) => {
      if (err.appWithoutAuth) {
        console.error(err)
      } else {
        throw err
      }
    })
}
