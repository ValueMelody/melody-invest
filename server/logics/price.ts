
import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'

export const getSplitMultiplier = (
  splitCoefficient: number,
  previousDaily: interfaces.tickerDailyModel.Record | null,
): string => {
  const baseMultiplier = previousDaily?.splitMultiplier || 1
  return (baseMultiplier * splitCoefficient).toFixed(2)
}

export const convertToPaddingPrice = (price: number): number => {
  return Math.floor(price * constants.Trader.Initial.PricePadding)
}
