const Bling = require('../../lib/bling/constructor')

exports.post = ({ appSdk, admin }, req, res) => {
  const blingToken = req.query.token
  const storeId = parseInt(req.query.store_id, 10)

  if (storeId > 100 && typeof blingToken === 'string' && blingToken && req.body) {
    const { retorno } = req.body
    const bling = new Bling(blingToken)
    console.log(retorno)
    return res.sendStatus(200)
  }

  res.sendStatus(403)
}
