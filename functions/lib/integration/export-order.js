const errorHandling = require('../store-api/error-handling')
const Bling = require('../bling/constructor')
const parseOrder = require('./parsers/order-to-bling/')
const parseStatus = require('./parsers/order-to-bling/status')
const handleJob = require('./handle-job')

module.exports = ({ appSdk, storeId, auth }, blingToken, blingStore, queueEntry, appData, canCreateNew) => {
  const orderId = queueEntry.nextId

  return appSdk.apiRequest(storeId, `/orders/${orderId}.json`, 'GET', null, auth)
    .then(({ response }) => {
      const order = response.data
      if (!order.financial_status) {
        return null
      }

      let blingOrderNumber
      if (order.metafields) {
        const metafield = order.metafields.find(({ field }) => field === 'bling:numero')
        if (metafield) {
          blingOrderNumber = metafield.value
        }
      }
      if (!blingOrderNumber) {
        blingOrderNumber = String(order.number)
      }
      const bling = new Bling(blingToken)

      const job = bling.get(`/pedido/${blingOrderNumber}`)
        .catch(err => {
          if (err.response && err.response.status === 404) {
            return {}
          }
          throw err
        })

        .then(({ pedidos }) => {
          let originalBlingOrder
          if (Array.isArray(pedidos)) {
            originalBlingOrder = pedidos.find(({ pedido }) => {
              if (String(order.number) === pedido.numero_ecommerce) {
                return !blingStore || (String(blingStore) === String(pedido.loja))
              }
              return false
            })
            if (originalBlingOrder) {
              originalBlingOrder = originalBlingOrder.pedido
            } else if (!canCreateNew) {
              return null
            }
          }
          const blingOrder = parseOrder(order, appData, storeId)
          if (!originalBlingOrder) {
            console.log(`#${storeId} ${JSON.stringify(blingOrder)}`)
            return bling.post('/pedido', {
              pedido: blingOrder
            })
          }

          const blingStatus = parseStatus(order)
          if (blingStatus) {
            return bling.put(`/pedido/${blingOrderNumber}`, {
              pedido: {
                idSituacao: blingStatus
              }
            })
          }
          return null
        })
      handleJob({ appSdk, storeId }, queueEntry, job)
    })

    .catch(err => {
      if (err.response) {
        const { status } = err.response
        if (status >= 400 && status < 500) {
          const msg = `O pedido ${orderId} não existe (:${status})`
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
