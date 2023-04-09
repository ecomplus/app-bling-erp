
const PubSub = require('@google-cloud/pubsub').PubSub
const getPubSubTopic = require('../../lib/pubsub/create-topic').getPubSubTopic

const sendMessageTopic = async (eventName, json) => {
  const topicName = getPubSubTopic(eventName)
  const messageId = await new PubSub()
    .topic(topicName)
    .publishMessage({ json })

  console.log('>> MessageId: ', messageId, ' Topic: ', topicName)

  return Promise.resolve(200)
}

exports.post = ({ appSdk, admin }, req, res) => {
  // const startTime = Date.now()
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
      if (retorno.pedidos) {
        if (Array.isArray(retorno.pedidos) && retorno.pedidos.length && retorno.pedidos[0].pedido && retorno.pedidos[0].pedido.tipoIntegracao && retorno.pedidos[0].pedido.tipoIntegracao.toLowerCase() !== 'api') {
          return res.sendStatus(200)
        }
      }
      /*
      TODO: check Bling server IPs
      const clientIp = req.get('x-forwarded-for') || req.connection.remoteAddress
      */

      return sendMessageTopic('bling', { blingToken, storeId, retorno })
        .then(() => {
          return res.sendStatus(200)
        })
        .catch(err => {
          err.storeId = storeId
          err.blingToken = blingToken
          console.error(err)
          return res.sendStatus(502)
        })
    } else {
      console.log(`#${storeId} unexpected Bling callback: ${JSON.stringify(req.body)}`)
      return res.status(200).send('Ignoring invalid request body')
    }
  }
  console.log('> ', storeId, ' => ', blingToken, ' ', typeof blingToken === 'string')

  return res.sendStatus(403)
}
