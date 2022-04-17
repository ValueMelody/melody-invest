import * as interfaces from '@shared/interfaces'

interface HoldingDetails {
  totalCash: number,
  totalValue: number,
  holdings: interfaces.traderHoldingModel.Holding[]
}

export const getHoldingTotalValue = (
  holdingDetails: HoldingDetails,
  dailyPrices: interfaces.tickerDailyModel.Record[],
): number => {
  const initialMap: { [tickerId: number]: number } = {}
  const priceMap = dailyPrices.reduce((prices, daily) => ({
    ...prices,
    [daily.tickerId]: daily.closePrice * daily.splitMultiplier,
  }), initialMap)
  const totalValue = holdingDetails.holdings.reduce((total, holding) => {
    const matchedPrice = priceMap[holding.tickerId]
    if (!matchedPrice) return total
    return total + matchedPrice * holding.shares
  }, holdingDetails.totalCash)
  return Math.floor(totalValue)
}
