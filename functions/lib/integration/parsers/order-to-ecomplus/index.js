module.exports = (blingOrder, shippingLines, bling) => new Promise((resolve, reject) => {
  const partialOrder = {}
  if (blingOrder.observacaointerna) {
    partialOrder.staff_notes = blingOrder.observacaointerna
  }

  if (shippingLines && shippingLines.length) {
    const checkTrackingCodes = ({ codigosRastreamento, transporte }) => {
      const addTrackingCode = (shippingLine, volume) => {
        if (
          volume &&
          volume.codigoRastreamento &&
          (!shippingLine.tracking_codes || !shippingLine.tracking_codes.length)
        ) {
          const tracking = {
            code: String(volume.codigoRastreamento),
            link: volume.urlRastreamento ||
              `https://www.melhorrastreio.com.br/rastreio/${volume.codigoRastreamento}`
          }
          shippingLine.tracking_codes = [tracking]
          partialOrder.shipping_lines = shippingLines
        }
      }

      if (codigosRastreamento) {
        addTrackingCode(shippingLines[0], codigosRastreamento[0] || codigosRastreamento)
      }
      if (transporte && transporte.volumes) {
        const { volumes } = transporte
        for (let i = 0; i < volumes.length && i < shippingLines.length; i++) {
          const { volume } = volumes[i]
          const shippingLine = shippingLines[i]
          addTrackingCode(shippingLine, volume)
        }
      }
    }
    checkTrackingCodes(blingOrder)

    const { nota } = blingOrder
    if (nota && nota.numero) {
      const shippingLine = shippingLines[0]
      if (!shippingLine.invoices) {
        shippingLine.invoices = []
      }
      if (!shippingLine.invoices.find(({ number }) => number === String(nota.numero))) {
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

      if (nota.serie && (!shippingLine.tracking_codes || !shippingLine.tracking_codes.length)) {
        return bling.get(`/notafiscal/${nota.numero}/${nota.serie}`)
          .then(({ data }) => {
            const blingInvoice = data.notasfiscais &&
              data.notasfiscais[0] && data.notasfiscais[0].notafiscal
            if (blingInvoice) {
              checkTrackingCodes(blingInvoice)
            }
            resolve(partialOrder)
          })
          .catch(e => {
            resolve(partialOrder)
          })
      }
    }
  }

  resolve(partialOrder)
})
