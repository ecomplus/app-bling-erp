require('dotenv').config()
const path = require('path')
const fs = require('fs')

const { FIREBASE_TOKEN, SERVER_OPERATOR_TOKEN } = process.env

require('./scripts-minification')

const { name, version } = require('../package.json')
const { project, baseUri } = require('./_constants')
const client = require('firebase-tools')

const config = [
  `pkg.version=${version}`,
  `pkg.name=${name}`,
  `server.operator_token=${SERVER_OPERATOR_TOKEN}`
]
if (baseUri) {
  config.push(`server.base_uri=${baseUri}`)
}

fs.writeFileSync(path.resolve(__dirname, '../functions/.env'), `
NAME=${name}
VERSION=${version}
SERVER_OPERATOR_TOKEN=${SERVER_OPERATOR_TOKEN}
SERVER_BASE_URI=${baseUri}`)

client.functions.config.set(config, { project })
  .then(() => client.deploy({
    project,
    only: 'functions',
    token: FIREBASE_TOKEN,
    force: true
  }))

  .then(() => {
    console.log(
      '\x1b[32m%s\x1b[0m',
      `\nDeployed with success to Firebase project '${project}'`
    )
    console.log(
      '\x1b[35m%s\x1b[0m',
      `\nBase URI: ${baseUri}`
    )
    console.log()
  })

  .catch(err => {
    console.error(err)
    process.exit(1)
  })
