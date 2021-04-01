// read configured E-Com Plus app data
const getAppData = require('./../../lib/store-api/get-app-data')

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

exports.post = ({ appSdk, admin }, req, res) => {
  // receiving notification from Store API
  const { storeId } = req

  /**
   * Treat E-Com Plus trigger body here
   * Ref.: https://developers.e-com.plus/docs/api/#/store/triggers/
   */
  const trigger = req.body
  const resourceId = trigger.resource_id || trigger.inserted_id

  const documentRef = admin.firestore().doc(`running/${storeId}`)
  documentRef.get()

    .then(documentSnapshot => new Promise((resolve, reject) => {
      let runningCount, runningKey
      const key = `${trigger.resource}_${resourceId}`
      const initKey = `${key}_init`
      const timestamp = Date.now()

      const countAndProceed = canResetDoc => {
        if (!runningCount) {
          runningCount = 0
        }
        documentRef.set({
          _count: runningCount + 1,
          [initKey]: timestamp
        }, {
          merge: !canResetDoc
        }).catch(console.error)

        const uncountRequest = (isHandling, payload) => {
          unsubscribe()
          const upset = data => {
            documentRef.set({
              ...data,
              ...payload
            }, {
              merge: true
            }).catch(console.error)
          }
          if (isHandling === true) {
            upset({ [key]: trigger.datetime })
          } else {
            upset({ _count: documentSnapshot.get('_count') || 0 })
          }
        }

        const handleReject = err => {
          uncountRequest()
          reject(err)
        }

        const validateDocSnapshot = () => {
          return documentSnapshot.exists &&
            !(documentSnapshot.get(initKey) > timestamp) &&
            !(documentSnapshot.get(key) >= trigger.datetime) &&
            documentSnapshot
        }

        const proceed = () => {
          if (!validateDocSnapshot()) {
            const err = new Error('Concurrent request with same key')
            err.statusCode = 203
            handleReject(err)
          } else {
            resolve({
              documentRef,
              key,
              uncountRequest,
              validateDocSnapshot
            })
          }
        }

        let delay = runningCount * 1500
        if (runningKey) {
          delay += Math.floor(Math.random() * (1500 - 500)) + 500
        } else {
          delay += 150
        }
        const proceedTimer = setTimeout(proceed, delay)

        const unsubscribe = documentRef.onSnapshot(newDocumentSnapshot => {
          documentSnapshot = newDocumentSnapshot
          proceed()
          clearTimeout(proceedTimer)
        }, err => {
          console.log(`Snapshot watcher error: ${err}`)
        })
      }

      if (documentSnapshot.exists) {
        const docAge = timestamp - documentSnapshot.updateTime.toDate().getTime()
        if (docAge < 10000) {
          runningKey = documentSnapshot.get(key)
          if (documentSnapshot.get('stop') === trigger.resource || runningKey >= trigger.datetime) {
            const err = new Error()
            err.statusCode = 204
            return reject(err)
          }
          runningCount = documentSnapshot.get('_count')
          if (runningCount > 3 || timestamp - documentSnapshot.get(initKey) < 1000) {
            const err = new Error('Too much requests')
            return reject(err)
          }
        } else if (docAge > 30000) {
          return countAndProceed(true)
        }
      }
      countAndProceed()
    }))

    .then(({ documentRef, key, uncountRequest, validateDocSnapshot }) => {
      // get app configured options
      appSdk.getAuth(storeId).then(auth => {
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
            if (typeof blingToken === 'string' && blingToken) {
              let integrationConfig
              let canCreateNew = false

              if (trigger.resource === 'applications') {
                integrationConfig = appData
                canCreateNew = true
              } else if (trigger.authentication_id !== auth.myId) {
                switch (trigger.resource) {
                  case 'orders':
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
                          key += `_${handlerName}_${nextId.replace(/[~./:;]+/g, '_')}`
                          const timestamp = Date.now()
                          const documentSnapshot = validateDocSnapshot()
                          if (!documentSnapshot || timestamp - documentSnapshot.get(key) < 20000) {
                            break
                          }
                          const debugFlag = `#${storeId} ${action}/${queue}/${nextId}`
                          console.log(`> Starting ${debugFlag}`)
                          const queueEntry = { action, queue, nextId, key, documentRef, mustUpdateAppQueue }
                          uncountRequest(true, { [key]: timestamp })

                          return handler(
                            { appSdk, storeId, auth },
                            blingToken,
                            blingStore,
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

            // console.log('> Skip webhook:', JSON.stringify(appData))
            uncountRequest()
            // nothing to do
            return {}
          })

          .then(({ appData, action, queue }) => {
            if (appData) {
              if (appData[action] && Array.isArray(appData[action][queue])) {
                res.status(202)
              } else {
                res.status(201)
              }
              res.send(`> Processed \`${action}.${queue}\``)
            } else {
              res.send(ECHO_SUCCESS)
            }
          })
      })

        .catch(err => {
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
    })

    .catch(err => {
      if (err.statusCode) {
        // trigger ignored due to current running process
        res.status(err.statusCode).send(err.message)
      } else {
        setTimeout(() => {
          res.status(503)
          const { message } = err
          res.send({
            error: 'FIRESTORE_ERROR',
            message
          })
        }, 250)
      }
    })
}
