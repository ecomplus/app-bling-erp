const Bling = require('../../lib/bling/constructor')

exports.post = ({ appSdk, admin }, req, res) => {
  const blingToken = req.query.token
  const storeId = parseInt(req.query.store_id, 10)

  if (storeId > 100 && typeof blingToken === 'string' && blingToken && req.body) {
    console.log(req.body)
    console.log(req.params)
    const bling = new Bling(blingToken)
    return res.sendStatus(200)
  }

  res.sendStatus(403)
}
