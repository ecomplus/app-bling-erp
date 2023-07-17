const ecomUtils = require('@ecomplus/utils')

module.exports = (product, originalBlingProduct, blingProductCode, blingStore, appData) => {
  const hasVariations = product.variations && product.variations.length

  const blingProduct = {
    codigo: blingProductCode,
    origem: '0',
    vlr_unit: ecomUtils.price(product),
    descricao: ecomUtils.name(product, 'pt_br').substring(0, 120),
    descricaoCurta: product.short_description,
    tipo: 'P',
    situacao: product.available && product.visible ? 'Ativo' : 'Inativo',
    un: originalBlingProduct && originalBlingProduct.un
      ? originalBlingProduct.un
      : product.measurement && product.measurement.unit !== 'oz' && product.measurement.unit !== 'ct'
        ? product.measurement.unit.substring(0, 6).toUpperCase()
        : 'un'
  }

  if (product.cost_price) {
    blingProduct.preco_custo = product.cost_price
  }
  if (!hasVariations) {
    if (typeof product.quantity === 'number') {
      blingProduct.estoque = product.quantity
    } else if (originalBlingProduct) {
      blingProduct.estoque = originalBlingProduct.estoqueAtual
    }
  }
  if (product.min_quantity) {
    blingProduct.itensPorCaixa = product.min_quantity
  }

  const description = product.body_text || product.body_html
  if (description) {
    if (!blingProduct.descricaoCurta) {
      blingProduct.descricaoCurta = description
    } else {
      blingProduct.descricaoComplementar = description
    }
  } else if (!blingProduct.descricaoCurta) {
    blingProduct.descricaoCurta = product.name
  }

  if (product.warranty) {
    const warrantyNum = parseInt(product.warranty)
    if (warrantyNum > 0) {
      blingProduct.garantia = warrantyNum
    }
  }

  if (product.mpn && product.mpn.length) {
    blingProduct.class_fiscal = product.mpn[0]
  }
  if (product.gtin && product.gtin.length) {
    blingProduct.gtin = product.gtin[0]
    if (product.gtin[1]) {
      blingProduct.gtinEmbalagem = product.gtin[1]
    }
  }

  if (product.weight && product.weight.value) {
    blingProduct.peso_bruto = product.weight.value
    switch (product.weight.unit) {
      case 'mg':
        blingProduct.peso_bruto /= 1000000
        break
      case 'g':
        blingProduct.peso_bruto /= 1000
    }
  }
  if (product.dimensions) {
    for (const side in product.dimensions) {
      if (product.dimensions[side]) {
        const { value, unit } = product.dimensions[side]
        if (value) {
          const field = side === 'width'
            ? 'largura'
            : side === 'height' ? 'altura' : 'profundidade'
          blingProduct[field] = value
          if (unit) {
            blingProduct[field] += unit
          }
        }
      }
    }
  }

  if (product.brands && product.brands.length) {
    blingProduct.marca = product.brands[0].name
  }
  if (product.videos && product.videos.length) {
    blingProduct.urlVideo = product.videos[0].url
  }
  if (product.pictures && product.pictures.length) {
    blingProduct.imagens = {
      url: []
    }
    product.pictures.forEach(({ zoom, big, normal }) => {
      const img = (zoom || big || normal)
      if (img) {
        blingProduct.imagens.url.push(img.url)
      }
    })
  }

  if (hasVariations) {
    blingProduct.variacoes = {
      variacao: []
    }
    product.variations.forEach((variation, i) => {
      const blingVariation = {
        nome: '',
        codigo: variation.sku || `${product.sku}-${(i + 1)}`,
        vlr_unit: ecomUtils.price({ ...product, ...variation }),
        estoque: variation.quantity || 0
      }
      if (appData.bling_deposit) {
        blingVariation.deposito = {
          id: appData.bling_deposit,
          estoque: variation.quantity || 0
        }
        delete blingVariation.estoque
      }

      for (const gridId in variation.specifications) {
        const gridOptions = variation.specifications[gridId]
        if (gridOptions && gridOptions.length) {
          gridOptions.forEach(({ text }, i) => {
            let gridTitle
            switch (gridId) {
              case 'colors':
                gridTitle = 'Cor'
                break
              case 'size':
                gridTitle = 'Tamanho'
                break
              case 'age_group':
                gridTitle = 'Idade'
                break
              case 'gender':
                gridTitle = 'Gênero'
                break
              default:
                gridTitle = gridId.charAt(0).toUpperCase() + gridId.slice(1).replace('_', ' ')
            }
            if (blingVariation.nome) {
              blingVariation.nome += ';'
              if (i > 0) {
                gridTitle += i === 1 ? ' secundária' : ` ${(i + 1)}`
              }
            }
            blingVariation.nome += `${gridTitle}:${text.replace(/[:;]/g, '')}`
          })
        }
      }
      blingProduct.variacoes.variacao.push(blingVariation)
    })
  }

  return blingProduct
}
