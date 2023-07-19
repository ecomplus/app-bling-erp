// setup server and app options from Functions config (and mocks)
let pkg, server
try {
  const config = require('firebase-functions').config()
  pkg = config.pkg
  server = config.server
} catch (e) {
  //
}

if (!pkg || !pkg.name) {
  pkg = {
    name: process.env.NAME,
    version: process.env.VERSION
  }
}
if (!server || !server.operator_token) {
  server = {
    operator_token: process.env.SERVER_OPERATOR_TOKEN,
    base_uri: process.env.SERVER_BASE_URI,
    functionName: process.env.FUNCTION_NAME
  }
}
const functionName = server.functionName || 'app'

module.exports = {
  functionName,
  operatorToken: server && server.operator_token,
  baseUri: (server && server.base_uri) ||
    `https://us-central1-${process.env.GCLOUD_PROJECT}.cloudfunctions.net/${functionName}`,
  pkg: {
    ...pkg
  }
}
