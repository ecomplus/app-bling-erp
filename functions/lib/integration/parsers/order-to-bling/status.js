module.exports = order => {
  const financialStatus = order.financial_status && order.financial_status.current
  switch (financialStatus) {
    case 'pending':
    case 'under_analysis':
    case 'unknown':
    case 'authorized':
      return 'aberto'
    case 'voided':
    case 'refunded':
    case 'in_dispute':
    case 'unauthorized':
      return 'cancelado'
  }

  switch (order.fulfillment_status && order.fulfillment_status.current) {
    case 'in_production':
    case 'in_separation':
      return 'preparando_envio'
    case 'invoice_issued':
      return 'faturado'
    case 'ready_for_shipping':
      return 'pronto_envio'
    case 'shipped':
    case 'partially_shipped':
      return 'enviado'
    case 'delivered':
      return 'entregue'
  }

  if (financialStatus && financialStatus.endsWith('paid')) {
    return 'aprovado'
  }
  return 'aberto'
}
