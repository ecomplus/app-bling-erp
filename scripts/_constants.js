const {
  FIREBASE_PROJECT_ID,
  SERVER_BASE_URI
} = process.env

let project = FIREBASE_PROJECT_ID
if (!project) {
  try {
    const firebaserc = require('../.firebaserc')
    project = firebaserc.projects.default
  } catch (e) {
    project = 'ecom-app'
  }
}

exports.project = project

exports.baseUri = SERVER_BASE_URI || 'https://appv2-jtydkm3a2a-uc.a.run.app'
