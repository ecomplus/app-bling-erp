module.exports = (blingOrder, shippingLines) => {
  const partialOrder = {}
  if (blingOrder.observacaointerna) {
    partialOrder.staff_notes = blingOrder.observacaointerna
  }

  if (shippingLines && shippingLines.length) {
    if (blingOrder.transporte && blingOrder.transporte.volumes) {
      const { volumes } = blingOrder.transporte
      for (let i = 0; i < volumes.length && i < shippingLines.length; i++) {
        const { volume } = volumes[i]
        const shippingLine = shippingLines[i]
        if (
          volume &&
          volume.codigoRastreamento &&
          (!shippingLine.tracking_codes || !shippingLine.tracking_codes.length)
        ) {
          const tracking = {
            code: String(volume.codigoRastreamento),
            link: `https://www.melhorrastreio.com.br/rastreio/${volume.codigoRastreamento}`
          }
          shippingLine.tracking_codes = [tracking]
          partialOrder.shipping_lines = shippingLines
        }
      }
    }

    const { nota } = blingOrder
    if (nota && nota.numero) {
      const shippingLine = shippingLines[0]
      if (!shippingLine.invoices) {
        shippingLine.invoices = []
      }
      if (nota.numero && !shippingLine.invoices.find(({ number }) => number === String(nota.numero))) {
        const invoice = {
          number: String(nota.numero)
        }
        if (nota.serie) {
          invoice.serial_number = String(nota.serie)
        }
        if (nota.chaveAcesso) {
          invoice.access_key = String(nota.chaveAcesso)
        }
        if (nota.dataEmissao) {
          const date = new Date(nota.dataEmissao)
          if (date.getTime() > 0) {
            invoice.issued_at = date.toISOString()
          }
        }
        shippingLine.invoices.push(invoice)
        partialOrder.shipping_lines = shippingLines
      }
    }
  }
}
