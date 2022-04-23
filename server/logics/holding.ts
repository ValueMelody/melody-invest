import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'

interface HoldingDetails {
  totalCash: number,
  totalValue: number,
  holdings: interfaces.traderHoldingModel.Holding[]
}

export const getHoldingTotalValue = (
  holdingDetails: HoldingDetails,
  tickerPrices: interfaces.tickerDailyModel.TickerPrices,
): number => {
  const totalValue = holdingDetails.holdings.reduce((total, holding) => {
    const matchedPrice = tickerPrices[holding.tickerId]
    if (!matchedPrice) return total
    return total + matchedPrice * holding.shares
  }, holdingDetails.totalCash)
  return Math.floor(totalValue)
}
