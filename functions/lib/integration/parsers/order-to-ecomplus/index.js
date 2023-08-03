module.exports = (blingOrder, shippingLines, bling, storeId) => new Promise((resolve, reject) => {
  const partialOrder = {}
  if (blingOrder.observacaointerna) {
    partialOrder.staff_notes = blingOrder.observacaointerna
  }
  if (shippingLines && shippingLines.length) {
    const checkTrackingCodes = ({ codigosRastreamento, transporte }) => {
      const addTrackingCode = (shippingLine, volume) => {
        let tracking
        if (
          volume &&
          volume.codigoRastreamento &&
          (!shippingLine.tracking_codes || !shippingLine.tracking_codes.length)
        ) {
          tracking = {
            code: String(volume.codigoRastreamento),
            link: volume.urlRastreamento ||
              `https://www.melhorrastreio.com.br/rastreio/${volume.codigoRastreamento}`
          }
          shippingLine.tracking_codes = [tracking]
          partialOrder.shipping_lines = shippingLines
        } else if (
          volume &&
          volume.urlRastreamento &&
          (!shippingLine.tracking_codes || !shippingLine.tracking_codes.length)
        ) {
          tracking = {
            code: 'Sem codigo | Consultar no link',
            link: volume.urlRastreamento
          }
          shippingLine.tracking_codes = [tracking]
          partialOrder.shipping_lines = shippingLines
        }
      }

      if (transporte && transporte.volumes) {
        const { volumes } = transporte
        for (let i = 0; i < volumes.length && i < shippingLines.length; i++) {
          const { volume } = volumes[i]
          const shippingLine = shippingLines[i]
          addTrackingCode(shippingLine, volume)
        }
      }

      if (codigosRastreamento) {
        addTrackingCode(shippingLines[0], codigosRastreamento[0] || codigosRastreamento)
      }
    }
    checkTrackingCodes(blingOrder)

    const { nota } = blingOrder
    if (nota && nota.numero) {
      const shippingLine = shippingLines[0]
      if (!shippingLine.invoices) {
        shippingLine.invoices = []
      }

      let invoiceIndex = shippingLine.invoices.findIndex(({ number }) => {
        return number === String(nota.numero)
      })
      if (invoiceIndex === -1) {
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
        invoiceIndex = shippingLine.invoices.length - 1
        partialOrder.shipping_lines = shippingLines
      } else if (invoiceIndex) {
        if (nota.chaveAcesso) {
          shippingLine.invoices[invoiceIndex].access_key = String(nota.chaveAcesso)
        }
      }

      if (nota.serie) {
        return bling.get(`/notafiscal/${nota.numero}/${nota.serie}`)
          .then(({ data }) => {
            let blingInvoice
            if (Array.isArray(data.notasfiscais)) {
              blingInvoice = data.notasfiscais.find(fiscal => {
                return !nota.chaveAcesso || String(fiscal.notafiscal.chaveAcesso) === String(nota.chaveAcesso)
              })
              if (blingInvoice) {
                blingInvoice = blingInvoice.notafiscal
              }
            }
            if (blingInvoice) {
              checkTrackingCodes(blingInvoice)
              ;[
                ['linkDanfe', 'link'],
                ['chaveAcesso', 'access_key']
              ].forEach(([blingField, field]) => {
                if (blingInvoice[blingField] && !shippingLine.invoices[invoiceIndex][field]) {
                  shippingLine.invoices[invoiceIndex][field] = String(blingInvoice[blingField])
                  partialOrder.shipping_lines = shippingLines
                }
              })
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
