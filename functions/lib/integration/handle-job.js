const getAppData = require('./../../lib/store-api/get-app-data')
const updateAppData = require('../store-api/update-app-data')

const queueRetry = (appSession, { action, queue, nextId }, appData, response) => {
  const retryKey = `${appSession.storeId}_${action}_${queue}_${nextId}`
  const documentRef = require('firebase-admin')
    .firestore()
    .doc(`integration_retries/${retryKey}`)

  return documentRef.get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        if (Date.now() - documentSnapshot.updateTime.toDate().getTime() > 5 * 60 * 1000) {
          documentRef.delete().catch(console.error)
        } else {
          console.log(`> Skip retry: ${retryKey}`)
          return null
        }
      }

      let queueList = appData[action] && appData[action][queue]
      if (!Array.isArray(queueList)) {
        queueList = [nextId]
      } else if (!queueList.includes(nextId)) {
        queueList.unshift(nextId)
      }

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          updateAppData(appSession, {
            [action]: {
              ...appData[action],
              [queue]: queueList
            }
          })
            .then(() => documentRef.set({
              d: new Date().toISOString()
            }))
            .then(resolve)
            .catch(reject)
        }, 7000)
      })
    })
}

const log = ({ appSdk, storeId }, queueEntry, payload) => {
  const isError = payload instanceof Error
  const isImportation = queueEntry.action.endsWith('importation')

  appSdk.getAuth(storeId)
    .then(auth => {
      return getAppData({ appSdk, storeId, auth })
        .then(appData => {
          let { logs } = appData
          if (!Array.isArray(logs)) {
            logs = []
          }
          const logEntry = {
            resource: /order/i.test(queueEntry.queue) ? 'orders' : 'products',
            [(isImportation ? 'tiny_id' : 'resource_id')]: queueEntry.nextId,
            success: !isError,
            timestamp: new Date().toISOString()
          }

          let notes, retrying
          if (payload) {
            if (!isError) {
              const { data, status, config } = payload
              if (data && data._id) {
                logEntry.resource_id = data._id
              }
              notes = `Status ${status}`
              if (config) {
                notes += ` [${config.url}]`
              }
            } else {
              const { config, response } = payload
              if (response) {
                const { data, status } = response
                notes = `Error: Status ${status} \n${JSON.stringify(data)}`
                if (!status || status >= 500) {
                  retrying = queueRetry({ appSdk, storeId, auth }, queueEntry, appData, response)
                }
                if (config) {
                  const { url, method, data } = config
                  notes += `\n\n-- Request -- \n${method} ${url} \n${JSON.stringify(data)}`
                }
              } else if (payload.isConfigError === true) {
                notes = payload.message
              } else {
                notes = payload.stack
              }
            }
          }
          if (notes) {
            logEntry.notes = notes.substring(0, 5000)
          }

          const checkUpdateQueue = () => {
            if (queueEntry.mustUpdateAppQueue) {
              const updateQueue = () => {
                const { action, queue, nextId } = queueEntry
                let queueList = appData[action][queue]
                if (Array.isArray(queueList)) {
                  const idIndex = queueList.indexOf(nextId)
                  if (idIndex > -1) {
                    queueList.splice(idIndex, 1)
                  }
                } else {
                  queueList = []
                }
                const data = {
                  [action]: {
                    ...appData[action],
                    [queue]: queueList
                  }
                }
                console.log(`#${storeId} ${JSON.stringify(data)}`)
                updateAppData({ appSdk, storeId, auth }, data).catch(err => {
                  if (err.response && (!err.response.status || err.response.status >= 500)) {
                    queueRetry({ appSdk, storeId, auth }, queueEntry, appData, err.response)
                  } else {
                    throw err
                  }
                })
              }

              if (retrying) {
                retrying
                  .then(result => {
                    if (result === null) {
                      updateQueue()
                    }
                  })
                  .catch(updateQueue)
              } else {
                updateQueue()
              }
            }
          }

          if (queueEntry.documentRef && queueEntry.documentRef.get) {
            queueEntry.documentRef.get()
              .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                  const data = documentSnapshot.data()
                  if (data[queueEntry.key] === false) {
                    queueEntry.mustUpdateAppQueue = false
                  }
                  setTimeout(() => {
                    queueEntry.documentRef.set({
                      _count: data._count > 0 ? data._count - 1 : 0,
                      [queueEntry.key]: false
                    }, {
                      merge: true
                    }).catch(console.error)
                  }, queueEntry.mustUpdateAppQueue ? 900 : 400)
                }
              })
              .then(checkUpdateQueue)
              .catch(err => {
                console.error(err)
                checkUpdateQueue()
              })
          } else {
            checkUpdateQueue()
          }

          if (isError || !isImportation) {
            logs.unshift(logEntry)
            return updateAppData({ appSdk, storeId, auth }, {
              logs: logs.slice(0, 200)
            }, true)
          }
        })
    })
    .catch(console.error)
}

const handleJob = (appSession, queueEntry, job) => {
  job
    .then(payload => {
      if (payload && typeof payload.then === 'function') {
        handleJob(appSession, queueEntry, payload)
      } else {
        log(appSession, queueEntry, payload)
      }
      return true
    })
    .catch(err => log(appSession, queueEntry, err))
}

module.exports = handleJob
