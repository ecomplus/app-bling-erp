module.exports = situacao => {
  let financialStatus, fulfillmentStatus
  switch (situacao) {
    case 'venda agenciada':
    case 'aprovado':
      financialStatus = 'paid'
      break
    case 'em andamento':
      fulfillmentStatus = 'in_separation'
      break
    case 'faturado':
      fulfillmentStatus = 'invoice_issued'
      break
    case 'pronto para envio':
      fulfillmentStatus = 'ready_for_shipping'
      break
    case 'atendido':
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
