export function formatRs(value) {
  const numberValue = Number(value)
  const safeNumber = Number.isFinite(numberValue) ? numberValue : 0
  const rounded = Math.round(safeNumber)
  return `Rs ${rounded.toLocaleString('en-PK')}`
}

