import * as interfaces from '@shared/interfaces'

interface HoldingsByTraders {
  [traderId: number]: interfaces.traderHoldingModel.Record[]
}

export const groupHoldingRecordsByTraders = (
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

type HoldingByDate = interfaces.traderHoldingModel.Record | null

interface HoldingsByDates {
  [date: string]: HoldingByDate[]
}

export const gatherTraderHoldingRecordsByDate = (
  traderIds: number[],
  holdings: interfaces.traderHoldingModel.Record[],
  holdingsByTraders: HoldingsByTraders,
) => {
  const initialHoldingsByDates: HoldingsByDates = {}
  const holdingsByDates = holdings.reduce((holdingsByDates, holding) => {
    if (holdingsByDates[holding.date]) return holdingsByDates
    const traderHoldings = traderIds.map((traderId) => {
      const holdings = holdingsByTraders[traderId]
      if (!holdings) return null
      const holdingIndexAfterDate = holdings.findIndex((traderHolding) => traderHolding.date > holding.date)
      if (holdingIndexAfterDate === 0) return null
      if (holdingIndexAfterDate === -1) return holdings[holdings.length - 1]
      return holdings[holdingIndexAfterDate - 1]
    })
    return { ...holdingsByDates, [holding.date]: traderHoldings }
  }, initialHoldingsByDates)
  return holdingsByDates
}

interface HoldingsByTickers {
  [tickerId: number]: interfaces.traderHoldingModel.Holding
}

export const groupHoldingsByTickers = (
  holdings: interfaces.traderHoldingModel.Holding[],
): HoldingsByTickers => {
  const initHoldingsByTickers: HoldingsByTickers = {}
  return holdings.reduce((holdingsByTickers, holding) => ({
    ...holdingsByTickers,
    [holding.tickerId]: holding,
  }), initHoldingsByTickers)
}

export const mergeHoldingsForSameTicker = (
  firstHolding: interfaces.traderHoldingModel.Holding,
  secondHolding: interfaces.traderHoldingModel.Holding,
  splitMultiplier: number,
) => {
  return {
    tickerId: firstHolding.tickerId,
    shares: firstHolding.shares + secondHolding.shares,
    splitMultiplier,
    value: firstHolding.value + secondHolding.value,
  }
}

export const mergeHoldingDetails = (
  holdingDetail: interfaces.traderHoldingModel.Detail,
  newHoldingDetail: interfaces.traderHoldingModel.Detail,
): interfaces.traderHoldingModel.Holding[] => {
  const holdingsByTickers = groupHoldingsByTickers(holdingDetail.holdings)

  const allHoldingsByTickers = newHoldingDetail.holdings.reduce((allHoldingsByTickers, holding) => {
    if (!allHoldingsByTickers[holding.tickerId]) {
      return {
        ...allHoldingsByTickers,
        [holding.tickerId]: holding,
      }
    }
    const matchedHolding = allHoldingsByTickers[holding.tickerId]
    const shouldUseNewMultiplier = newHoldingDetail.date > holdingDetail.date
    const splitMultiplier = shouldUseNewMultiplier ? holding.splitMultiplier : matchedHolding.splitMultiplier
    return {
      ...allHoldingsByTickers,
      [holding.tickerId]: mergeHoldingsForSameTicker(holding, matchedHolding, splitMultiplier),
    }
  }, holdingsByTickers)
  return Object.values(allHoldingsByTickers)
}

export const mergeHoldingsByDate = (
  date: string,
  holdings: HoldingByDate[],
  startupCash: number,
) => {
  const initialDetail: interfaces.traderHoldingModel.Detail = {
    date,
    totalValue: 0,
    totalCash: 0,
    holdings: [],
  }
  return holdings.reduce((detail, holding) => {
    if (holding === null) {
      return {
        ...detail,
        totalCash: detail.totalCash + startupCash,
        totalValue: detail.totalValue + startupCash,
      }
    }
    return {
      ...detail,
      totalCash: detail.totalCash + holding.totalCash,
      totalValue: detail.totalValue + holding.totalValue,
      holdings: mergeHoldingDetails(detail, holding),
    }
  }, initialDetail)
}
