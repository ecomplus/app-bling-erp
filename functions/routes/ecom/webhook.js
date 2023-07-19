// read configured E-Com Plus app data
const getAppData = require('./../../lib/store-api/get-app-data')
const { baseUri, operatorToken } = require('./../../__env')

// async integration handlers
const integrationHandlers = {
  exportation: {
    product_ids: require('./../../lib/integration/export-product'),
    order_ids: require('./../../lib/integration/export-order')
  },
  importation: {
    skus: require('./../../lib/integration/import-product'),
    order_numbers: require('./../../lib/integration/import-order')
  }
}

const SKIP_TRIGGER_NAME = 'SkipTrigger'
const ECHO_SUCCESS = 'SUCCESS'
const ECHO_SKIP = 'SKIP'
const ECHO_API_ERROR = 'STORE_API_ERR'
const handlingIds = []

const removeFromQueue = (resourceId) => {
  console.log(handlingIds)
  const handlingIndex = handlingIds.indexOf(resourceId)
  handlingIds.splice(handlingIndex, 1)
}

exports.post = async ({ appSdk, admin }, req, res) => {
  // receiving notification from Store API
  const { storeId } = req

  if (req.get('host') && !baseUri.includes(req.get('host'))) {
    console.log('>>> Proxy to function v2')
    const axios = require('axios')
    try {
      const { status, data } = await axios.post(req.url, req.body, {
        baseURL: baseUri,
        headers: {
          'x-store-id': storeId,
          'x-operator-token': operatorToken
        }
      })
      console.log(`>>> Webhook proxy response: ${status} ${data}`)
      return res.status(status).send(data)
    } catch (error) {
      const err = new Error('Error proxying to function v2')
      err.config = error.config
      err.response = {
        status: error.response.status,
        data: error.response.data
      }
      console.error(err)
    }
  }

  /**
   * Treat E-Com Plus trigger body here
   * Ref.: https://developers.e-com.plus/docs/api/#/store/triggers/
   */
  const trigger = req.body
  const resourceId = trigger.resource_id || trigger.inserted_id
  // get app configured options
  if (!handlingIds.includes(resourceId)) {
    handlingIds.push(resourceId)

    appSdk.getAuth(storeId)
      .then((auth) => {
        // eslint-disable-next-line promise/no-nesting
        return getAppData({ appSdk, storeId, auth })
          .then(appData => {
            if (
              Array.isArray(appData.ignore_triggers) &&
              appData.ignore_triggers.indexOf(trigger.resource) > -1
            ) {
              // ignore current trigger
              const err = new Error()
              err.name = SKIP_TRIGGER_NAME
              throw err
            }

            /* DO YOUR CUSTOM STUFF HERE */
            console.log(`> Webhook #${storeId} ${resourceId} [${trigger.resource}]`)

            const blingToken = appData.bling_api_token
            const blingStore = appData.bling_store
            const blingDeposit = appData.bling_deposit
            if (storeId === 51292 && trigger.resource === 'orders') {
              console.log('Try to export order #51292 with token', typeof blingToken === 'string' && blingToken)
            }
            if (typeof blingToken === 'string' && blingToken) {
              let integrationConfig
              let canCreateNew = false

              if (trigger.resource === 'applications') {
                integrationConfig = appData
                canCreateNew = true
              } else if (trigger.authentication_id !== auth.myId) {
                switch (trigger.resource) {
                  case 'orders':
                    if (storeId === 51292) {
                      console.log('Try to export order #51292', resourceId)
                    }
                    if (trigger.body) {
                      canCreateNew = appData.new_orders ? undefined : false
                      integrationConfig = {
                        _exportation: {
                          order_ids: [resourceId]
                        }
                      }
                    }
                    break

                  case 'products':
                    if (trigger.body) {
                      if (trigger.action === 'create') {
                        if (!appData.new_products) {
                          break
                        }
                        canCreateNew = true
                      } else if (
                        (!trigger.body.price || !appData.export_price) &&
                        (!trigger.body.quantity || !appData.export_quantity)
                      ) {
                        break
                      }
                      integrationConfig = {
                        _exportation: {
                          product_ids: [resourceId]
                        }
                      }
                    }
                    break
                }
              }
              if (integrationConfig) {
                const actions = Object.keys(integrationHandlers)
                actions.forEach(action => {
                  for (let i = 1; i <= 3; i++) {
                    actions.push(`${('_'.repeat(i))}${action}`)
                  }
                })
                for (let i = 0; i < actions.length; i++) {
                  const action = actions[i]
                  const actionQueues = integrationConfig[action]

                  if (typeof actionQueues === 'object' && actionQueues) {
                    for (const queue in actionQueues) {
                      const ids = actionQueues[queue]
                      if (Array.isArray(ids) && ids.length) {
                        const isHiddenQueue = action.charAt(0) === '_'
                        const mustUpdateAppQueue = trigger.resource === 'applications'
                        const handlerName = action.replace(/^_+/, '')
                        const handler = integrationHandlers[handlerName][queue.toLowerCase()]
                        const nextId = ids[0]

                        if (
                          typeof nextId === 'string' &&
                          nextId.length &&
                          handler
                        ) {
                          const debugFlag = `#${storeId} ${action}/${queue}/${nextId}`
                          console.log(`> Starting ${debugFlag}`)
                          const queueEntry = { action, queue, nextId, mustUpdateAppQueue }

                          // eslint-disable-next-line promise/no-nesting
                          return handler(
                            { appSdk, storeId, auth },
                            blingToken,
                            blingStore,
                            blingDeposit,
                            queueEntry,
                            appData,
                            canCreateNew,
                            isHiddenQueue
                          )
                            .then(() => ({ appData, action, queue }))
                        }
                      }
                    }
                  }
                }
              }
            }
            // nothing to do
            return {}
          })
      })

      .then(({ appData, action, queue }) => {
        removeFromQueue(resourceId)
        if (appData) {
          if (appData[action] && Array.isArray(appData[action][queue])) {
            res.status(202)
          } else {
            res.status(201)
          }
          return res.send(`> Processed \`${action}.${queue}\``)
        } else {
          return res.send(ECHO_SUCCESS)
        }
      })

      .catch(err => {
        removeFromQueue(resourceId)
        if (err.name === SKIP_TRIGGER_NAME) {
          // trigger ignored by app configuration
          res.send(ECHO_SKIP)
        } else {
          if (err.response) {
            const error = new Error('Webhook process request error')
            error.config = JSON.stringify(err.config)
            error.response = JSON.stringify({
              status: err.response.status,
              data: err.response.data
            })
            console.error(error)
          } else {
            console.error(err)
          }
          // request to Store API with error response
          // return error status code
          res.status(500)
          const { message } = err
          res.send({
            error: ECHO_API_ERROR,
            message
          })
        }
      })
  } else {
    console.log(`# Skipped in execution #${resourceId} [${trigger.resource} - ${trigger.action}]`)
    res.status(203).send('Concurrent request with same ResourceId')
  }
}
