const { firestore } = require('firebase-admin')

module.exports = context => {
  const date = new Date()
  date.setDate(date.getDate() - 1)

  return firestore()
    .collection('bling_orders')
    .where('updatedAt', '<', firestore.Timestamp.fromDate(date))
    .get().then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        documentSnapshot.ref.delete()
      })
    })
}
