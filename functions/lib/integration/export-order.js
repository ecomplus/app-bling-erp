/* eslint-disable promise/no-nesting */

const ecomUtils = require('@ecomplus/utils')
const errorHandling = require('../store-api/error-handling')
const Bling = require('../bling/constructor')
const parseOrder = require('./parsers/order-to-bling/')
const parseStatus = require('./parsers/order-to-bling/status')
const handleJob = require('./handle-job')

module.exports = ({ appSdk, storeId, auth }, blingToken, blingStore, blingDeposit, queueEntry, appData, canCreateNew) => {
  const orderId = queueEntry.nextId
  return appSdk.apiRequest(storeId, `/orders/${orderId}.json`, 'GET', null, auth)
    .then(({ response }) => {
      const order = response.data
      const logHead = `#${storeId} ${orderId} `
      if (!order.financial_status) {
        console.log(`${logHead}skipped with no financial status`)
        return null
      }

      let blingOrderNumber
      let { metafields } = order
      let hasCreatedBlingOrder
      if (metafields) {
        const metafield = metafields.find(({ field }) => field === 'bling:numero')
        if (metafield) {
          blingOrderNumber = metafield.value
          if (blingOrderNumber === 'skip') {
            console.log(`${logHead}skipped by metafield`)
            return null
          }
          hasCreatedBlingOrder = Boolean(blingOrderNumber)
        }
      }
      const bling = new Bling(blingToken)
      const job = bling.get(`/pedido/${(blingOrderNumber || order.number)}`)
        .catch(err => {
          if (err.response && err.response.status === 404) {
            return { data: {} }
          }
          throw err
        })

        .then(({ data }) => {
          const blingStatus = parseStatus(order)
          const hasFoundByNumber = Boolean(Array.isArray(data.pedidos) && data.pedidos.length)
          let originalBlingOrder
          if (hasFoundByNumber) {
            originalBlingOrder = data.pedidos.find(({ pedido }) => {
              if (String(order.number) === pedido.numeroPedidoLoja) {
                return !blingStore || (String(blingStore) === String(pedido.loja))
              }
              return false
            })
            if (!originalBlingOrder && blingOrderNumber) {
              originalBlingOrder = data.pedidos.find(({ pedido }) => {
                return blingOrderNumber === String(pedido.numero)
              })
            }
          }
          if (originalBlingOrder) {
            blingOrderNumber = originalBlingOrder.pedido.numero
            return { blingStatus }
          } else if (!canCreateNew) {
            if (canCreateNew === false || hasCreatedBlingOrder) {
              return {}
            }
          }

          if (!originalBlingOrder) {
            if (appData.approved_orders_only) {
              switch (blingStatus) {
                case 'pendente':
                case 'em aberto':
                case 'cancelado':
                  console.log(`${logHead}skipped with status "${blingStatus}"`)
                  return {}
              }
            }
            if (!blingOrderNumber) {
              blingOrderNumber = (hasFoundByNumber || appData.random_order_number === true)
                ? String(Math.floor(Math.random() * (99999999 - 10000000)) + 10000000)
                : String(order.number)
            }

            const blingOrder = parseOrder(order, blingOrderNumber, blingStore, appData, storeId)
            return bling.post('/pedido', { pedido: blingOrder })

              .then(({ data }) => {
                if (data && data.pedidos && data.pedidos[0]) {
                  blingOrderNumber = data.pedidos[0].pedido.numero
                  console.log(`${logHead}> Bling n${blingOrderNumber}`)
                  if (blingOrderNumber) {
                    if (!metafields) {
                      metafields = []
                    }
                    metafields.push({
                      _id: ecomUtils.randomObjectId(),
                      namespace: 'bling',
                      field: 'bling:numero',
                      value: String(blingOrderNumber)
                    })
                    appSdk.apiRequest(storeId, `/orders/${order._id}.json`, 'PATCH', {
                      metafields
                    }, auth)
                      .catch(console.error)
                  }
                } else {
                  console.log(`${logHead}> Bling error (?) ${JSON.stringify(data)}`)
                }
                return { blingStatus }
              })
          }
          return {}
        })

        .then(({ blingStatus }) => {
          if (blingStatus && blingOrderNumber) {
            return bling.get('/situacao/Vendas').then(({ data }) => {
              if (Array.isArray(data.situacoes)) {
                let blingStatusObj
                const findBlingStatus = statusLabel => {
                  blingStatusObj = data.situacoes.find(({ situacao }) => {
                    return situacao.nome && situacao.nome.toLowerCase() === statusLabel
                  })
                }
                if (Array.isArray(blingStatus)) {
                  for (let i = 0; i < blingStatus.length; i++) {
                    findBlingStatus(blingStatus[i])
                    if (blingStatusObj) {
                      break
                    }
                  }
                } else {
                  findBlingStatus(blingStatus)
                }

                if (blingStatusObj) {
                  return bling.put(`/pedido/${blingOrderNumber}`, {
                    pedido: {
                      idSituacao: Number(blingStatusObj.situacao.id)
                    }
                  })
                }
                return null
              }
              const err = new Error('Sua conta Bling não tem "situacoes" cadastradas ou a API do Bling falhou')
              err.isConfigError = true
              throw err
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
