module.exports = situacao => {
  let financialStatus, fulfillmentStatus
  switch (situacao) {
    case 'aprovado':
      financialStatus = 'paid'
      break
    case 'preparando_envio':
    case 'preparando envio':
      fulfillmentStatus = 'in_separation'
      break
    case 'faturado':
    case 'faturado (atendido)':
    case 'atendido':
      fulfillmentStatus = 'invoice_issued'
      break
    case 'pronto_envio':
    case 'pronto para envio':
      fulfillmentStatus = 'ready_for_shipping'
      break
    case 'enviado':
      fulfillmentStatus = 'shipped'
      break
    case 'entregue':
      fulfillmentStatus = 'delivered'
      break
    case 'cancelado':
      financialStatus = 'voided'
      break
  }
  return { financialStatus, fulfillmentStatus }
}
