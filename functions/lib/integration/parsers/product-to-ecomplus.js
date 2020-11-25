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

module.exports = (tinyProduct, storeId, auth, isNew = true) => new Promise((resolve, reject) => {
  const sku = tinyProduct.codigo || String(tinyProduct.id)
  const name = (tinyProduct.nome || sku).trim()

  const product = {
    available: tinyProduct.situacao === 'A',
    sku,
    name,
    cost_price: tinyProduct.preco_custo,
    price: tinyProduct.preco_promocional || tinyProduct.preco,
    base_price: tinyProduct.preco,
    warranty: tinyProduct.garantia,
    body_html: tinyProduct.descricao_complementar
  }

  if (isNew) {
    product.slug = removeAccents(name.toLowerCase())
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_./]/g, '')
    if (!/[a-z0-9]/.test(product.slug.charAt(0))) {
      product.slug = `p-${product.slug}`
    }
  }

  if (tinyProduct.unidade_por_caixa) {
    product.min_quantity = Number(tinyProduct.unidade_por_caixa)
  }
  if (tinyProduct.ncm) {
    product.mpn = [tinyProduct.ncm]
  }
  const validateGtin = gtin => typeof gtin === 'string' && /^([0-9]{8}|[0-9]{12,14})$/.test(gtin)
  if (validateGtin(tinyProduct.gtin)) {
    product.gtin = [tinyProduct.gtin]
    if (validateGtin(tinyProduct.gtin_embalagem)) {
      product.gtin.push(tinyProduct.gtin_embalagem)
    }
  }

  const weight = tinyProduct.peso_bruto || tinyProduct.peso_liquido
  if (weight > 0) {
    product.weight = {
      unit: 'kg',
      value: parseFloat(weight)
    }
  }

  ;[
    ['largura', 'width'],
    ['altura', 'height'],
    ['comprimento', 'length']
  ].forEach(([lado, side]) => {
    const dimension = tinyProduct[`${lado}_embalagem`] || tinyProduct[`${lado}Embalagem`]
    if (dimension > 0) {
      if (!product.dimensions) {
        product.dimensions = {}
      }
      product.dimensions[side] = {
        unit: 'cm',
        value: parseFloat(dimension)
      }
    }
  })

  if (isNew) {
    if (Array.isArray(tinyProduct.variacoes) && tinyProduct.variacoes.length) {
      product.variations = []
      tinyProduct.variacoes.forEach(({ variacao }) => {
        const { codigo, preco, grade } = variacao
        if (grade) {
          const specifications = {}
          const specTexts = []
          for (const tipo in grade) {
            if (grade[tipo]) {
              const gridId = removeAccents(tipo.toLowerCase())
                .replace(/\s+/g, '_')
                .replace(/[^a-z0-9_]/g, '')
                .substring(0, 30)
                .padStart(2, 'i')
              const spec = {
                text: grade[tipo]
              }
              specTexts.push(spec.text)
              if (gridId !== 'colors') {
                spec.value = removeAccents(spec.text.toLowerCase()).substring(0, 100)
              }
              specifications[gridId] = [spec]
            }
          }

          if (specTexts.length) {
            product.variations.push({
              _id: ecomUtils.randomObjectId(),
              name: `${name} / ${specTexts.join(' / ')}`.substring(0, 100),
              sku: codigo,
              specifications,
              price: parseFloat(preco || 0)
            })
          }
        }
      })
    }

    if (Array.isArray(tinyProduct.imagens_externas)) {
      product.pictures = []
      tinyProduct.imagens_externas.forEach(imagemExterna => {
        if (imagemExterna.imagem_externa) {
          const { url } = imagemExterna.imagem_externa
          if (url) {
            product.pictures.push({ normal: { url } })
          }
        }
      })
    }

    if (tinyProduct.anexos) {
      if (!product.pictures) {
        product.pictures = []
      }
      const promises = []
      tinyProduct.anexos.forEach(({ anexo }) => {
        if (typeof anexo === 'string' && anexo.startsWith('http')) {
          promises.push(tryImageUpload(storeId, auth, anexo, product))
        }
      })
      return Promise.all(promises).then(() => resolve(product))
    }
  }

  resolve(product)
})
