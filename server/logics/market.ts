import * as interfaces from '@shared/interfaces'

const PRICE_PADDING = 100

export const convertToIntPrice = (price: string): number => {
  const value = parseFloat(price)
  return Math.floor(value * PRICE_PADDING)
}

export const getSplitMultiplier = (
  splitCoefficient: string,
  previousDaily: interfaces.tickerDailyModel.Record | null,
) => {
  const baseMultiplier = previousDaily?.splitMultiplier || 1
  const newMultiplier = parseFloat(splitCoefficient)
  return baseMultiplier * newMultiplier
}

export const getInitialCash = (): number => {
  return 100000 * PRICE_PADDING
}

export const isMatchedQuarter = (
  quarter: string, fiscalDateEnding: string,
): boolean => {
  const fiscalQuarter = fiscalDateEnding.substring(0, 7)
  const [fiscalYear, fiscalMonth] = fiscalQuarter.split('-')
  const [year, month] = quarter.split('-')
  if (year !== fiscalYear) return false
  if (month === fiscalMonth) return true
  if (parseInt(month) + 1 === parseInt(fiscalMonth)) return true
  if (parseInt(month) - 1 === parseInt(fiscalMonth)) return true
  return false
}
