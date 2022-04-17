import * as interfaces from '@shared/interfaces'

interface HoldingDetails {
  totalCash: number,
  totalValue: number,
  holdings: interfaces.traderHoldingModel.Holding[]
}

export const getHoldingTotalValue = (
  holdingDetails: HoldingDetails,
  tickerPrices: interfaces.dailyTickersModel.TickerPrices,
): number => {
  return holdingDetails.holdings.reduce((total, holding) => {
    const matchedPrice = tickerPrices[holding.tickerId]
    if (!matchedPrice) return total
    return total + matchedPrice * holding.shares
  }, holdingDetails.totalCash)
}
