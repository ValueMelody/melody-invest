import * as interfaces from '@shared/interfaces'

export const calcBookValue = (totalAssets: number | null, totalLiabilities: number | null) => {
  return totalAssets !== null && totalLiabilities !== null
    ? totalAssets - totalLiabilities
    : null
}

export const calcPbRatio = (
  closePrice: number | null,
  bookValue: number | null,
  outstandingShares: number | null,
) => {
  return closePrice && bookValue && outstandingShares
    ? (closePrice / (bookValue / outstandingShares)).toFixed(2)
    : null
}

export const calcPeRatio = (
  closePrice: number | null,
  eps: number | null,
) => {
  return closePrice && eps
    ? (closePrice / eps).toFixed(2)
    : null
}

export const calcPsRatio = (
  closePrice: number | null,
  totalRevenue: number | null,
  outstandingShares: number | null,
) => {
  return closePrice && totalRevenue && outstandingShares
    ? ((closePrice * outstandingShares) / totalRevenue).toFixed(2)
    : null
}

export const calcQoQChangePercent = (
  currentValue: number | null,
  pastValue: number | null | undefined,
) => {
  return currentValue !== null && pastValue !== null && pastValue !== undefined
    ? ((currentValue - pastValue) * 100 / pastValue).toFixed(2)
    : null
}

type TickerYearlyIncreaseDecreaseValueKey =
  'totalRevenue' | 'grossProfit' | 'netIncome' | 'eps' | 'ebitda' |
  'bookValue' | 'equity' | 'freeCashFlow' | 'pbRatio' | 'peRatio' | 'psRatio'

export const calcTickerYearlyIncreaseDecreaseValues = (
  currentRecord: interfaces.tickerYearlyModel.Record,
  lastRecord: interfaces.tickerYearlyModel.Record | null,
  increaseKey: interfaces.tickerYearlyModel.MovementIncreaseKey,
  decreaseKey: interfaces.tickerYearlyModel.MovementDecreaseKey,
  valueKey: TickerYearlyIncreaseDecreaseValueKey,
) => {
  let increaseValue = currentRecord[increaseKey]
  let decreaseValue = currentRecord[decreaseKey]
  if (currentRecord[valueKey] !== null && lastRecord && lastRecord[valueKey] !== null) {
    const isIncrease = currentRecord[valueKey]! > lastRecord[valueKey]!
    const isDecrease = currentRecord[valueKey]! < lastRecord[valueKey]!
    const lastIncrease = lastRecord[increaseKey] || 0
    const lastDecrease = lastRecord[decreaseKey] || 0
    increaseValue = isIncrease ? lastIncrease + 1 : 0
    decreaseValue = isDecrease ? lastDecrease + 1 : 0
  }
  return { increaseValue, decreaseValue }
}

type TickerQuarterltIncreaseDecreaseValueKey =
  TickerYearlyIncreaseDecreaseValueKey | 'roa' | 'roe' | 'grossMargin' | 'debtEquity'

export const calcTickerQuarterlyIncreaseDecreaseValues = (
  currentRecord: interfaces.tickerQuarterlyModel.Record,
  lastRecord: interfaces.tickerQuarterlyModel.Record | null,
  increaseKey: interfaces.tickerQuarterlyModel.MovementIncreaseKey,
  decreaseKey: interfaces.tickerQuarterlyModel.MovementDecreaseKey,
  valueKey: TickerQuarterltIncreaseDecreaseValueKey,
) => {
  let increaseValue = currentRecord[increaseKey]
  let decreaseValue = currentRecord[decreaseKey]
  if (currentRecord[valueKey] !== null && lastRecord && lastRecord[valueKey] !== null) {
    const isIncrease = currentRecord[valueKey]! > lastRecord[valueKey]!
    const isDecrease = currentRecord[valueKey]! < lastRecord[valueKey]!
    const lastIncrease = lastRecord[increaseKey] || 0
    const lastDecrease = lastRecord[decreaseKey] || 0
    increaseValue = isIncrease ? lastIncrease + 1 : 0
    decreaseValue = isDecrease ? lastDecrease + 1 : 0
  }
  return { increaseValue, decreaseValue }
}
