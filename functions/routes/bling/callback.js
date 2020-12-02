// const Bling = require('../../lib/bling/constructor')

exports.post = ({ appSdk, admin }, req, res) => {
  const blingToken = req.query.token
  const storeId = parseInt(req.query.store_id, 10)

  if (storeId > 100 && typeof blingToken === 'string' && blingToken && req.body) {
    let { retorno } = req.body
    if (!retorno && typeof req.body.data === 'string') {
      try {
        retorno = JSON.parse(req.body.data)
      } catch (e) {
      }
    }
    if (retorno) {
      console.log(retorno)
      // const bling = new Bling(blingToken)
      return res.sendStatus(200)
    }
  }

  res.sendStatus(403)
}
