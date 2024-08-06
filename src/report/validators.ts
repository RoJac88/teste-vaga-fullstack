export const cpfIsValid = (cpf: string) => {
  // tamanho incorreto
  if (cpf.length !== 11) return false

  // digitos repetidos
  if (cpf.split(cpf[0]).length - 1 === 11) return false

  // digitos (sem o verificador)
  const digits = Array.from(cpf.slice(0, 9))

  // verificar primeiro digito
  let checksum = 0
  for (const [index, digit] of digits.entries()) {
    const n = Number(digit)
    if (Number.isNaN(n)) return false
    checksum += n * (10 - index)
  }
  const firstDigit = (checksum * 10) % 11
  if (cpf[9] !== firstDigit.toString()) return false

  // verificar segundo digito
  checksum = 0
  for (const [index, digit] of [...digits, firstDigit].entries()) {
    const n = Number(digit)
    checksum += n * (11 - index)
  }
  const secondDigit = (checksum * 10) % 11
  if (cpf[10] !== secondDigit.toString()) return false

  return true
}

export const cnpjIsValid = (cnpj: string) => {
  // tamanho incorreto
  if (cnpj.length !== 14) return false

  // digitos (sem o verificador)
  const digits = Array.from(cnpj.slice(0, 12))

  // verificar  primeiro digito
  let checksum = 0
  for (const [index, digit] of digits.slice(0, 4).entries()) {
    const n = Number(digit)
    if (Number.isNaN(n)) return false
    checksum += n * (5 - index)
  }
  for (const [index, digit] of digits.slice(4, 12).entries()) {
    const n = Number(digit)
    if (Number.isNaN(n)) return false
    checksum += n * (9 - index)
  }
  const firstDigit = checksum % 11 < 2 ? '0' : String(11 - (checksum % 11))
  if (cnpj[12] !== firstDigit) return false

  // verificar segundo digito
  checksum = 0
  for (const [index, digit] of digits.slice(0, 5).entries()) {
    const n = Number(digit)
    checksum += n * (6 - index)
  }
  for (const [index, digit] of [...digits.slice(5, 12), firstDigit].entries()) {
    const n = Number(digit)
    checksum += n * (9 - index)
  }
  const secondDigit = checksum % 11 < 2 ? '0' : String(11 - (checksum % 11))
  if (cnpj[13] !== secondDigit) return false

  return true
}

export const validPrestacao = ({ vlTotal, qtPrestacoes }: Record<string, string>) => {
  if (!vlTotal || !qtPrestacoes) return
  const total = Number(vlTotal)
  const n = Number(qtPrestacoes)
  if (Number.isNaN(total) || Number.isNaN(n)) return
  return (total / n).toFixed(2)
}
