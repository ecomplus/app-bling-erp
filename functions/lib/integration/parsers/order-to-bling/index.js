const ecomUtils = require('@ecomplus/utils')

const formatDate = d => {
  return d.getDate().toString().padStart(2, '0') + '/' +
    (d.getMonth() + 1).toString().padStart(2, '0') + '/' +
    d.getFullYear()
}

const parseAddress = (address, blingAddress) => {
  if (address) {
    ;[
      ['name', 'nome', 120],
      ['street', 'endereco', 50],
      ['number', 'numero', 10],
      ['complement', 'complemento', 50],
      ['borough', 'bairro', 30],
      ['zip', 'cep', 10],
      ['city', 'cidade', 30],
      ['province_code', 'uf', 30]
    ].forEach(([addressField, blingAddressField, maxLength]) => {
      if (address[addressField] && !blingAddress[blingAddressField]) {
        blingAddress[blingAddressField] = String(address[addressField]).substring(0, maxLength)
      }
    })
    if (blingAddress.cep && /[0-9]{7,8}/.test(blingAddress.cep)) {
      blingAddress.cep = blingAddress.cep.padStart(8, '0')
        .replace(/^([\d]{2})([\d]{3})([\d]{3})$/, '$1.$2-$3')
    }
  }
}

module.exports = (order, blingOrderNumber, blingStore, appData, storeId) => {
  const blingOrder = {
    numero: blingOrderNumber,
    numero_loja: String(order.number),
    data: formatDate(new Date(order.opened_at || order.created_at))
  }

  if (blingStore) {
    blingOrder.loja = Number(blingStore)
  }

  const buyer = order.buyers && order.buyers[0]
  const shippingLine = order.shipping_lines && order.shipping_lines[0]
  const transaction = order.transactions && order.transactions[0]
  const shippingAddress = shippingLine && shippingLine.to
  const billingAddress = transaction && transaction.billing_address

  if (buyer) {
    const blingCustomer = {
      id: buyer._id,
      nome: (buyer.corporate_name || ecomUtils.fullName(buyer)).substring(0, 30) ||
        `Comprador de #${blingOrderNumber}`,
      tipoPessoa: buyer.registry_type === 'j' ? 'J' : 'F'
    }
    if (buyer.doc_number && buyer.doc_number.length <= 18) {
      blingCustomer.cpf_cnpj = buyer.doc_number
    }
    if (buyer.inscription_number && buyer.inscription_number.length <= 18) {
      blingCustomer.ie = buyer.inscription_number
    }
    if (buyer.main_email && buyer.main_email.length <= 60) {
      blingCustomer.email = buyer.main_email
    }
    if (buyer.phones) {
      ;['celular', 'tel'].forEach((blingCustomerField, i) => {
        const phone = buyer.phones && buyer.phones[i]
        if (phone) {
          blingCustomer[blingCustomerField] = phone.country_code ? `+${phone.country_code} ` : ''
          blingCustomer[blingCustomerField] += phone.number
        }
      })
    }
    parseAddress(billingAddress || shippingAddress, blingCustomer)
    blingOrder.cliente = blingCustomer
  } else {
    blingOrder.cliente = {
      nome: `Comprador de #${blingOrderNumber}`
    }
  }

  if (order.items && order.items.length) {
    blingOrder.itens = []
    order.items.forEach(item => {
      if (item.quantity) {
        const itemRef = (item.sku || item._id).substring(0, 20)
        blingOrder.itens.push({
          item: {
            codigo: itemRef,
            descricao: item.name ? item.name.substring(0, 120) : itemRef,
            un: 'Un',
            qtde: item.quantity,
            vlr_unit: ecomUtils.price(item)
          }
        })
      }
    })
  }

  if (transaction) {
    let blingPaymentLabel = ''
    if (order.payment_method_label) {
      blingPaymentLabel = order.payment_method_label
    } else if (transaction.payment_method.name) {
      blingPaymentLabel = transaction.payment_method.name.substring(0, 140)
    }
    blingOrder.parcelas = []
    if (transaction.installments) {
      let { number, value, total } = transaction.installments
      if (!value) {
        value = (total || transaction.amount) / number
      }
      for (let i = 0; i < number; i++) {
        blingOrder.parcelas.push({
          parcela: {
            dias: (i * 30) || 1,
            vlr: value,
            obs: `${blingPaymentLabel} (${(i + 1)}/${number})`
          }
        })
      }
    } else {
      blingOrder.parcelas.push({
        parcela: {
          data: blingOrder.data,
          vlr: transaction.amount,
          obs: `${blingPaymentLabel} (1/1)`
        }
      })
    }
  }

  if (shippingLine) {
    blingOrder.transporte = {}
    if (order.shipping_method_label) {
      blingOrder.transporte.transportadora = order.shipping_method_label
    }
    if (shippingLine.app) {
      if (shippingLine.app.carrier && shippingLine.app.service_name) {
        if (
          /correios/i.test(shippingLine.app.carrier) ||
          /(pac|sedex)/i.test(shippingLine.app.service_name)
        ) {
          blingOrder.transporte.servico_correios = shippingLine.app.service_name
        }
      }
      if (!blingOrder.transporte.transportadora && shippingLine.app.label) {
        blingOrder.transporte.transportadora = shippingLine.app.label
      }
    }
    if (shippingLine.package && shippingLine.package.weight) {
      const { unit, value } = shippingLine.package.weight
      blingOrder.transporte.peso_bruto = unit === 'g'
        ? value / 1000
        : unit === 'mg'
          ? value / 1000000
          : value
    }
    if (shippingAddress) {
      blingOrder.transporte.dados_etiqueta = {}
      parseAddress(shippingAddress, blingOrder.transporte.dados_etiqueta)
    }
  }

  const { amount } = order
  if (amount) {
    if (typeof amount.freight === 'number') {
      blingOrder.vlr_frete = amount.freight
      if (amount.tax) {
        blingOrder.vlr_frete += amount.tax
      }
      if (amount.extra) {
        blingOrder.vlr_frete += amount.extra
      }
    }
    if (amount.discount) {
      blingOrder.vlr_desconto = amount.discount
    }
  }

  if (order.notes) {
    blingOrder.obs = order.notes.substring(0, 250)
  }
  if (order.staff_notes) {
    blingOrder.obs_internas = order.staff_notes.substring(0, 250)
  }

  if (appData.bling_order_data) {
    for (const field in appData.bling_order_data) {
      let value = appData.bling_order_data[field]
      switch (value) {
        case undefined:
        case '':
        case null:
          break
        default:
          if (typeof value === 'string') {
            value = value.trim()
            if (value) {
              blingOrder[field] = value
            }
          } else {
            blingOrder[field] = value
          }
      }
    }
  }

  return blingOrder
}
