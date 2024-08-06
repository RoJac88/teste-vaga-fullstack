import { PathLike, createReadStream } from 'fs'
import csv from 'csv-parser'
import { cnpjIsValid, cpfIsValid, validPrestacao } from './validators'
import { formatCurrency } from './formatters'

interface Writable {
  write: (arg0: string | Buffer | ArrayBuffer) => void,
  end: () => void,
}

export default function parseCsv(filePath: PathLike, res: Writable, { allowInvalidId=false, noCorrection=false, rawCurrency=false }) {
  res.write('[')
  let first = true
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
}
