import type { Request, Response } from 'express'

import csv from 'csv-parser'
import dotenv from 'dotenv'
import express from 'express'
import path from 'path'

import { promises as fs, createReadStream } from 'fs'
import { cpfIsValid, cnpjIsValid, validPrestacao } from './validators'
import { formatCurrency } from './formatters'

dotenv.config()

// Personalize o diretório de dados ou a porta da api por meio de variáveis de ambiente
const port = process.env.PORT || 3000
const dataDir = process.env.DATA || 'data'

const app = express()

// Rota raíz lista os arquivos no diretório de dados
app.get('/', async (_, res: Response) => {
  const files = await fs.readdir(dataDir)
  res.send(files.filter((f) => f.endsWith('.csv')))
})

// Rota report tem o arquivo como parâmetro dinâmico para facilitar o teste com diversos arquivos
app.get('/report/:file', (req: Request, res: Response) => {
  const { file } = req.params

  // Personalize o comportamento da rota com as variáveis abaixo:
  const { rawCurrency, noCorrection, allowInvalidId } = req.query
  // rawCurrency=1: Desativa a formatação da moeda
  // noCorrection=1: Desativa a correção do valor da prestação
  // allowInvalidId=1: Mostra linhas com cpf ou cnpj inválido

  const filePath = path.join(dataDir, file)
  res.setHeader('Content-Type', 'application/json')
  res.write('[')
  let first = true
  // O streamming de dados permite que o servidor lide com arquivos grandes sem carregá-los inteiramente na memória
  createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      if (!allowInvalidId && (!cpfIsValid(data.nrCpfCnpj) && !cnpjIsValid(data.nrCpfCnpj))) {
        // console.log(`cnpf ou cpf inválido: ${data.nrCpfCnpj}, ignorando a linha correspondente`)
        return
      }
      if (!noCorrection) {
        const calcPrest = validPrestacao(data)
        if (calcPrest !== data.vlPresta) {
          // console.log(`corrigindo o valor da prestação (${data.vlTotal} / ${data.qtPrestacoes}): ${data.vlPresta} => ${calcPrest}`)
          data.vlPresta = calcPrest
        }
      }
      if (!rawCurrency) {
        const withCurrencyFormat = formatCurrency(data)
        data = { ...data, ...withCurrencyFormat }
      }
      if (!first) {
        res.write(',')
      }
      res.write(JSON.stringify(data))
      first = false
    })
    .on('end', () => {
      res.write(']')
      res.end()
    })
})

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`)
})
