const ecomUtils = require('@ecomplus/utils')
const axios = require('axios')
const FormData = require('form-data')

const removeAccents = str => str.replace(/áàãâÁÀÃÂ/g, 'a')
  .replace(/éêÉÊ/g, 'e')
  .replace(/óõôÓÕÔ/g, 'o')
  .replace(/íÍ/g, 'e')
  .replace(/úÚ/g, 'u')
  .replace(/çÇ/g, 'c')

const tryImageUpload = (storeId, auth, originImgUrl, product) => new Promise(resolve => {
  axios.get(originImgUrl, {
    responseType: 'arraybuffer'
  })
    .then(({ data }) => {
      const form = new FormData()
      form.append('file', Buffer.from(data), originImgUrl.replace(/.*\/([^/]+)$/, '$1'))

      return axios.post(`https://apx-storage.e-com.plus/${storeId}/api/v1/upload.json`, form, {
        headers: {
          ...form.getHeaders(),
          'X-Store-ID': storeId,
          'X-My-ID': auth.myId,
          'X-Access-Token': auth.accessToken
        }
      })

        .then(({ data, status }) => {
          if (data.picture) {
            for (const imgSize in data.picture) {
              if (data.picture[imgSize]) {
                if (!data.picture[imgSize].url) {
                  delete data.picture[imgSize]
                  continue
                }
                if (data.picture[imgSize].size !== undefined) {
                  delete data.picture[imgSize].size
                }
                data.picture[imgSize].alt = `${product.name} (${imgSize})`
              }
            }
            if (Object.keys(data.picture).length) {
              return resolve({
                _id: ecomUtils.randomObjectId(),
                normal: data.picture.zoom,
                ...data.picture
              })
            }
          }
          const err = new Error('Unexpected Storage API response')
          err.response = { data, status }
          throw err
        })
    })

    .catch(err => {
      console.error(err)
      resolve({
        _id: ecomUtils.randomObjectId(),
        normal: {
          url: originImgUrl,
          alt: product.name
        }
      })
    })
}).then(picture => {
  if (product && product.pictures) {
    product.pictures.push(picture)
  }
  return picture
})

module.exports = (blingProduct, variations, storeId, auth, isNew = true) => new Promise((resolve, reject) => {
  const sku = blingProduct.codigo
  const name = (blingProduct.descricao || sku).trim()

  const product = {
    available: blingProduct.situacao === 'Ativo',
    sku,
    name,
    quantity: Number(blingProduct.estoqueAtual || 0),
    cost_price: blingProduct.preco_custo
  }

  if (blingProduct.descricaoComplementar) {
    product.short_description = blingProduct.descricaoCurta
    product.body_html = blingProduct.descricaoComplementar
  } else {
    product.body_html = blingProduct.descricaoCurta
  }

  const { produtoLoja } = blingProduct
  if (produtoLoja && produtoLoja.preco && produtoLoja.preco.preco) {
    if (produtoLoja.preco.precoPromocional) {
      product.price = Number(produtoLoja.preco.precoPromocional)
      product.base_price = Number(produtoLoja.preco.preco)
    } else {
      product.price = Number(produtoLoja.preco.preco)
    }
  } else {
    product.price = Number(blingProduct.preco || blingProduct.vlr_unit)
  }

  if (blingProduct.garantia) {
    product.warranty = String(blingProduct.garantia)
  }
  if (blingProduct.itensPorCaixa) {
    product.min_quantity = Number(blingProduct.itensPorCaixa)
  }
  if (blingProduct.class_fiscal) {
    product.mpn = [blingProduct.class_fiscal]
  }
  const validateGtin = gtin => typeof gtin === 'string' && /^([0-9]{8}|[0-9]{12,14})$/.test(gtin)
  if (validateGtin(blingProduct.gtin)) {
    product.gtin = [blingProduct.gtin]
    if (validateGtin(blingProduct.gtinEmbalagem)) {
      product.gtin.push(blingProduct.gtinEmbalagem)
    }
  }

  if (isNew) {
    product.slug = removeAccents(name.toLowerCase())
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_./]/g, '')
    if (!/[a-z0-9]/.test(product.slug.charAt(0))) {
      product.slug = `p-${product.slug}`
    }
  }

  const weight = parseFloat(blingProduct.pesoBruto || blingProduct.pesoLiq)
  if (weight > 0) {
    product.weight = {
      unit: 'kg',
      value: weight
    }
  }

  ;[
    ['largura', 'width'],
    ['altura', 'height'],
    ['comprimento', 'length']
  ].forEach(([lado, side]) => {
    const dimension = parseFloat(blingProduct[`${lado}Produto`])
    if (dimension > 0) {
      if (!product.dimensions) {
        product.dimensions = {}
      }
      product.dimensions[side] = {
        unit: 'cm',
        value: dimension
      }
    }
  })

  if (Array.isArray(blingProduct.variacoes) && blingProduct.variacoes.length) {
    product.variations = variations || []
    blingProduct.variacoes.forEach(({ variacao }) => {
      if (variacao.nome) {
        const gridsAndValues = variacao.nome.split(';')
        if (gridsAndValues.length) {
          const specifications = {}
          const specTexts = []

          gridsAndValues.forEach(gridAndValue => {
            const [gridName, text] = gridAndValue.trim().split(':')
            if (gridName && text) {
              const gridId = gridName === 'Cor'
                ? 'colors'
                : removeAccents(gridName.toLowerCase())
                  .replace(/\s+/g, '_')
                  .replace(/[^a-z0-9_]/g, '')
                  .substring(0, 30)
                  .padStart(2, 'i')
              const spec = { text }
              specTexts.push(text)
              if (gridId !== 'colors') {
                spec.value = removeAccents(text.toLowerCase()).substring(0, 100)
              }
              if (!specifications[gridId]) {
                specifications[gridId] = [spec]
              } else {
                specifications[gridId].push(spec)
              }
            }
          })

          if (specTexts.length) {
            let variation
            if (variations) {
              const variationIndex = variations.findIndex(({ sku }) => sku === variacao.codigo)
              if (variationIndex > -1) {
                variation = variations[variationIndex]
              }
            }
            if (!variation) {
              variation = {
                _id: ecomUtils.randomObjectId()
              }
              variations.push(variation)
            }
            variation.name = `${name} / ${specTexts.join(' / ')}`.substring(0, 100)
            variation.sku = variacao.codigo
            variation.specifications = specifications
            variation.quantity = Number(variacao.estoqueAtual || 0)
            const price = parseFloat(variacao.preco || variacao.vlr_unit)
            if (price) {
              variation.price = price
            }
          }
        }
      }
    })
  }

  if (isNew && Array.isArray(blingProduct.imagem) && blingProduct.imagem.length) {
    if (!product.pictures) {
      product.pictures = []
    }
    const promises = []
    blingProduct.imagem.forEach(({ link }) => {
      if (typeof link === 'string' && link.startsWith('http')) {
        promises.push(tryImageUpload(storeId, auth, link, product))
      }
    })
    return Promise.all(promises).then(() => resolve(product))
  }

  resolve(product)
})
