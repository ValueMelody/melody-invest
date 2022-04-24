import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'

export const getHoldingTotalValue = (
  holdingDetail: interfaces.traderHoldingModel.Detail,
  tickerPrices: interfaces.tickerDailyModel.TickerPrices,
): number => {
  const totalValue = holdingDetail.holdings.reduce((total, holding) => {
    const matchedPrice = tickerPrices[holding.tickerId]
    if (!matchedPrice) return total
    return total + matchedPrice * holding.shares
  }, holdingDetail.totalCash)
  return Math.floor(totalValue)
}

export interface HoldingsByTraders {
  [traderId: number]: interfaces.traderHoldingModel.Record[]
}

export const groupHoldingsByTraders = (
  holdings: interfaces.traderHoldingModel.Record[],
): HoldingsByTraders => {
  const initialHoldingsByTraders: HoldingsByTraders = {}
  const holdingsByTraders = holdings.reduce((holdingsByTraders, holding) => {
    const holdings = { ...holdingsByTraders }
    if (!holdings[holding.traderId]) holdings[holding.traderId] = []
    holdings[holding.traderId].push(holding)
    return holdings
  }, initialHoldingsByTraders)
  return holdingsByTraders
}

export const getNearestHoldingByDate = (
  date: string,
  holdings: interfaces.traderHoldingModel.Record[], // order by date asc required
): interfaces.traderHoldingModel.Record | null => {
  const holdingIndexAfterDate = holdings.findIndex((holding) => holding.date > date)
  if (holdingIndexAfterDate === 0) return null
  if (holdingIndexAfterDate === -1) return holdings[holdings.length - 1]
  return holdings[holdingIndexAfterDate - 1]
}

export type TraderHolding = interfaces.traderHoldingModel.Record | null

export interface HoldingsByDates {
  [date: string]: TraderHolding[]
}

export const groupTraderHoldingsByDate = (
  dates: string[],
  traderIds: number[],
  holdingsByTraders: HoldingsByTraders,
): HoldingsByDates => {
  const initialHoldingsByDates: HoldingsByDates = {}
  const holdingsByDates = dates.reduce((holdingsByDates, date) => {
    const traderHoldings = traderIds.map((traderId) => {
      const holdings = holdingsByTraders[traderId] || []
      const nearestHolding = getNearestHoldingByDate(date, holdings)
      return nearestHolding
    })
    return { ...holdingsByDates, [date]: traderHoldings }
  }, initialHoldingsByDates)
  return holdingsByDates
}

interface HoldingItemsByTickers {
  [tickerId: number]: interfaces.traderHoldingModel.Holding
}

export const groupHoldingItemsByTickers = (
  items: interfaces.traderHoldingModel.Holding[],
): HoldingItemsByTickers => {
  const initHoldingsByTickers: HoldingItemsByTickers = {}
  return items.reduce((itemsByTickers, item) => ({
    ...itemsByTickers,
    [item.tickerId]: item,
  }), initHoldingsByTickers)
}

export const mergeHoldingItems = (
  firstItem: interfaces.traderHoldingModel.Holding,
  secondItem: interfaces.traderHoldingModel.Holding,
  splitMultiplier: number,
) => {
  return {
    tickerId: firstItem.tickerId,
    shares: firstItem.shares + secondItem.shares,
    splitMultiplier,
    value: firstItem.value + secondItem.value,
  }
}

export const getMergedHoldingItems = (
  holding: interfaces.traderHoldingModel.Detail,
  secondHolding: interfaces.traderHoldingModel.Detail,
): interfaces.traderHoldingModel.Holding[] => {
  const holdingItemsByTickers = groupHoldingItemsByTickers(holding.holdings)
  const shouldUseSecondMultiplier = secondHolding.date > holding.date

  const mergedByTickers = secondHolding.holdings.reduce((mergedTickers, secondHoldingItem) => {
    const matchedHoldingItem = mergedTickers[secondHoldingItem.tickerId]
    if (!matchedHoldingItem) {
      return {
        ...mergedTickers,
        [secondHoldingItem.tickerId]: secondHoldingItem,
      }
    }
    const splitMultiplier = shouldUseSecondMultiplier
      ? secondHoldingItem.splitMultiplier
      : matchedHoldingItem.splitMultiplier
    const mergedItem = mergeHoldingItems(matchedHoldingItem, secondHoldingItem, splitMultiplier)
    return {
      ...mergedTickers,
      [secondHoldingItem.tickerId]: mergedItem,
    }
  }, holdingItemsByTickers)
  return Object.values(mergedByTickers)
}

export const mergeTraderHoldingsByDate = (
  date: string,
  traderHoldings: TraderHolding[],
) => {
  const initialDetail: interfaces.traderHoldingModel.Detail = {
    date,
    totalValue: 0,
    totalCash: 0,
    holdings: [],
  }
  return traderHoldings.reduce((mergedHolding, holding) => {
    const newCash = holding ? holding.totalCash : constants.Trader.Initial.Cash
    const newValue = holding ? holding.totalValue : constants.Trader.Initial.Cash
    const merged = {
      ...mergedHolding,
      totalCash: mergedHolding.totalCash + newCash,
      totalValue: mergedHolding.totalValue + newValue,
      holdings: holding ? getMergedHoldingItems(mergedHolding, holding) : mergedHolding.holdings,
    }
    return merged
  }, initialDetail)
}
