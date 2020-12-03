module.exports = order => {
  const financialStatus = order.financial_status && order.financial_status.current
  switch (financialStatus) {
    case 'pending':
    case 'under_analysis':
    case 'unknown':
    case 'authorized':
      return '0'
    case 'voided':
    case 'refunded':
    case 'in_dispute':
    case 'unauthorized':
      return '2'
  }

  switch (order.fulfillment_status && order.fulfillment_status.current) {
    case 'in_production':
    case 'in_separation':
    case 'invoice_issued':
    case 'ready_for_shipping':
      return '4'
    case 'shipped':
    case 'partially_shipped':
    case 'delivered':
      return '1'
  }

  if (financialStatus && financialStatus.endsWith('paid')) {
    return '4'
  }
  return '0'
}
