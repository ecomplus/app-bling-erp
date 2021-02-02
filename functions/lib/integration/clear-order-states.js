const { firestore } = require('firebase-admin')

module.exports = context => {
  const date = new Date()
  date.setDate(date.getDate() - 1)

  return firestore()
    .collection('bling_orders')
    .where('updatedAt', '<', firestore.Timestamp.fromDate(date))
    .limit(500)
    .get().then(async querySnapshot => {
      for (const doc of querySnapshot.docs) {
        await doc.ref.delete()
      }
    })
}
