const { firestore } = require('firebase-admin')

module.exports = context => {
  const date = new Date()
  date.setDate(date.getDate() - 1)

  return firestore()
    .collection('bling_orders')
    .where('updatedAt', '<', firestore.Timestamp.fromDate(date))
    .limit(2000)
    .get().then(querySnapshot => {
      let i = 0
      querySnapshot.forEach(documentSnapshot => {
        setTimeout(documentSnapshot.ref.delete, i * 20)
        i++
      })
    })
}
