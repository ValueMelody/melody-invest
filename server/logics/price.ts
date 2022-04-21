import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'

export const getSplitMultiplier = (
  splitCoefficient: string,
  previousDaily: interfaces.tickerDailyModel.Record | null,
) => {
  const baseMultiplier = previousDaily?.splitMultiplier || 1
  const newMultiplier = parseFloat(splitCoefficient)
  return baseMultiplier * newMultiplier
}

export const convertToPaddingPrice = (price: string): number => {
  const value = parseFloat(price)
  return Math.floor(value * constants.Trader.Initial.PricePadding)
}
