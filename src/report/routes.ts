import type { Request, Response } from 'express'
import { Router } from 'express'

import path from 'path'
import parseCsv from './parseCsv'

import { promises as fs } from 'fs'
import { dataDir } from '../config'

const router = Router()

// Rota raíz lista os arquivos no diretório de dados
router.get('/', async (_, res: Response) => {
  const files = await fs.readdir(dataDir)
  res.send(files.filter((f) => f.endsWith('.csv')))
})

// Rota report tem o arquivo como parâmetro dinâmico para facilitar o teste com diversos arquivos
router.get('/report/:file', (req: Request, res: Response) => {
  const { file } = req.params

  // Personalize o comportamento da rota com as variáveis abaixo:
  const { rawCurrency, noCorrection, allowInvalidId } = req.query
  // rawCurrency=1: Desativa a formatação da moeda
  // noCorrection=1: Desativa a correção do valor da prestação
  // allowInvalidId=1: Mostra linhas com cpf ou cnpj inválido
  const options = {
    rawCurrency: Boolean(rawCurrency),
    noCorrection: Boolean(noCorrection),
    allowInvalidId: Boolean(allowInvalidId),
  }
  const filePath = path.join(dataDir, file)
  res.setHeader('Content-Type', 'application/json')
  parseCsv(filePath, res, options)
})

export default router
