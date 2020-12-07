module.exports = order => {
  const financialStatus = order.financial_status && order.financial_status.current
  switch (financialStatus) {
    case 'pending':
    case 'under_analysis':
    case 'unknown':
    case 'authorized':
      return 'em aberto'
    case 'voided':
    case 'refunded':
    case 'in_dispute':
    case 'unauthorized':
      return 'cancelado'
  }

  switch (order.fulfillment_status && order.fulfillment_status.current) {
    case 'in_production':
      return ['em produção', 'em andamento']
    case 'in_separation':
      return ['em separação', 'em andamento']
    case 'invoice_issued':
      return 'faturado'
    case 'ready_for_shipping':
      return ['pronto para envio', 'pronto envio']
    case 'shipped':
    case 'partially_shipped':
      return ['enviado', 'atendido']
    case 'delivered':
      return 'entregue'
  }

  if (financialStatus && financialStatus.endsWith('paid')) {
    return ['aprovado', 'em aberto']
  }
  return 'em aberto'
}
