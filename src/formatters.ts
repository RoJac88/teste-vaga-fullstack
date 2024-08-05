export const formatCurrency = (row: Record<string, string>) => {
  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
  const formattedCurrencyRow: Record<string, string> = {}
  for (const [key, value] of Object.entries(row)) {
    if (key.startsWith('vl')) {
      const n = Number(value)
      if (Number.isNaN(n)) continue
      formattedCurrencyRow[key] = formatter.format(n)
    }
  }
  return formattedCurrencyRow
}

