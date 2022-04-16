import * as interfaces from '@shared/interfaces'

export const refreshHoldingToDailyValue = (
  holding: interfaces.traderHoldingModel.Holding,
  dailyTicker: interfaces.dailyTickersModel.DailyTicker | null,
): interfaces.traderHoldingModel.Holding => {
  const matchedDaily = dailyTicker?.daily
  const holdingValue = matchedDaily
    ? holding.shares * matchedDaily.closePrice * matchedDaily.splitMultiplier
    : holding.value
  const splitMultiplier = matchedDaily?.splitMultiplier || holding.splitMultiplier
  const updatedHolding = {
    tickerId: holding.tickerId,
    shares: holding.shares,
    value: holdingValue,
    splitMultiplier,
  }
  return updatedHolding
}

export interface HoldingDetails {
  totalCash: number,
  totalValue: number,
  holdings: interfaces.traderHoldingModel.Holding[]
}

export const detailsFromCashAndHoldings = (
  totalCash: number,
  holdings: interfaces.traderHoldingModel.Holding[],
  dailyTickers: interfaces.dailyTickersModel.DailyTickers,
): HoldingDetails => {
  const detailsBeforeUpdate: HoldingDetails = {
    totalValue: totalCash, totalCash, holdings: [],
  }
  return holdings.reduce((details, holding) => {
    const matched = dailyTickers[holding.tickerId] || null
    const refreshedHolding = refreshHoldingToDailyValue(holding, matched)
    return {
      totalValue: details.totalValue + refreshedHolding.value,
      totalCash: details.totalCash,
      holdings: [...details.holdings, refreshedHolding],
    }
  }, detailsBeforeUpdate)
}

export const refreshHoldingsForLessThanMinPercent = (
  holdingDetails: HoldingDetails,
  holdingForSell: interfaces.traderHoldingModel.Holding,
  holdingPercent: number,
  tickerMinPercent: number,
  maxCashValue: number,
): HoldingDetails | null => {
  const isLessThanMinPercent = holdingPercent < tickerMinPercent
  if (!isLessThanMinPercent) return null

  const cashAfterSell = holdingDetails.totalCash + holdingForSell.value
  const couldSell = cashAfterSell <= maxCashValue
  if (!couldSell) return null
  return {
    totalValue: holdingDetails.totalValue,
    totalCash: cashAfterSell,
    holdings: holdingDetails.holdings.filter((holding) => holding.tickerId !== holdingForSell.tickerId),
  }
}

export const refreshHoldingsForMoreThanMaxPercernt = (
  holdingDetails: HoldingDetails,
  holdingForSell: interfaces.traderHoldingModel.Holding,
  holdingPercent: number,
  tickerMaxPercent: number,
  maxCashValue: number,
  tickerDaily: interfaces.tickerDailyModel.Record,
): HoldingDetails | null => {
  if (!tickerDaily) return null

  const isMoreThanMaxPercent = holdingPercent > tickerMaxPercent
  if (!isMoreThanMaxPercent) return null

  const sellTargetPercent = holdingPercent - tickerMaxPercent
  const sellTargetValue = Math.ceil(holdingDetails.totalValue * sellTargetPercent / 100)
  const sellTargetShares = Math.ceil(sellTargetValue / tickerDaily.closePrice)
  const sharesSold = sellTargetShares / tickerDaily.splitMultiplier

  const sharesLeft = holdingForSell.shares - sharesSold
  const dailyFinalPrice = tickerDaily.closePrice * tickerDaily.splitMultiplier
  const cashAfterSell = holdingDetails.totalCash + sharesSold * dailyFinalPrice
  const couldSell = sharesLeft && cashAfterSell < maxCashValue

  if (!couldSell) return null

  const holdingAfterSell = {
    tickerId: holdingForSell.tickerId,
    shares: sharesLeft,
    value: sharesLeft * dailyFinalPrice,
    splitMultiplier: tickerDaily.splitMultiplier,
  }
  return {
    totalValue: holdingDetails.totalValue,
    totalCash: cashAfterSell,
    holdings: holdingDetails.holdings.map((holding) => {
      if (holding.tickerId !== holdingForSell.tickerId) return holding
      return holdingAfterSell
    }),
  }
}

export const detailsAfterRebalance = (
  shouldRebalance: boolean,
  currentDetails: HoldingDetails,
  dailyTickers: interfaces.dailyTickersModel.DailyTickers,
  tickerMinPercent: number,
  tickerMaxPercent: number,
  maxCashValue: number,
): {
  holdingDetails: HoldingDetails;
  hasTransaction: boolean;
} => {
  if (!shouldRebalance) {
    return {
      holdingDetails: currentDetails,
      hasTransaction: false,
    }
  }

  let hasTransaction = false
  const details = currentDetails.holdings.reduce((details, holding) => {
    const matched = dailyTickers[holding.tickerId]
    if (!matched) return details

    const matchedDaily = matched.daily
    const holdingPercent = (holding.value / details.totalValue) * 100

    const refreshedForMinPercernt = refreshHoldingsForLessThanMinPercent(
      details, holding, holdingPercent, tickerMinPercent, maxCashValue,
    )
    if (refreshedForMinPercernt) {
      hasTransaction = true
      return refreshedForMinPercernt
    }

    const refreshedForMaxPercent = refreshHoldingsForMoreThanMaxPercernt(
      details, holding, holdingPercent, tickerMaxPercent, maxCashValue, matchedDaily,
    )
    if (refreshedForMaxPercent) {
      hasTransaction = true
      return refreshedForMaxPercent
    }

    return details
  }, currentDetails)
  return {
    hasTransaction,
    holdingDetails: details,
  }
}

export const refreshHoldingsForSell = (
  holdingDetails: HoldingDetails,
  holdingForSell: interfaces.traderHoldingModel.Holding,
  tickerDaily: interfaces.tickerDailyModel.Record,
  holdingSellPercent: number,
  tickerMinPercent: number,
  maxCashValue: number,
): HoldingDetails | null => {
  const sharesSold = Math.floor(holdingForSell.shares * tickerDaily.splitMultiplier * holdingSellPercent / 100)
  const baseSharesShold = sharesSold / tickerDaily.splitMultiplier
  if (holdingForSell.shares < baseSharesShold) return null

  const valueSold = baseSharesShold * tickerDaily.splitMultiplier * tickerDaily.closePrice
  const percentAfterSell = (holdingForSell.value - valueSold) / holdingDetails.totalValue
  if (percentAfterSell * 100 < tickerMinPercent) return null

  const cashAfterSell = holdingDetails.totalCash + valueSold
  if (cashAfterSell > maxCashValue) return null

  const sharesAfterSell = holdingForSell.shares - baseSharesShold
  const valueAfterSell = sharesAfterSell * tickerDaily.closePrice * tickerDaily.splitMultiplier
  const holdingDetail = {
    tickerId: holdingForSell.tickerId,
    shares: sharesAfterSell,
    value: valueAfterSell,
    splitMultiplier: tickerDaily.splitMultiplier,
  }

  const holdings = sharesAfterSell
    ? holdingDetails.holdings.map((hold) => hold.tickerId === holdingForSell.tickerId ? holdingDetail : hold)
    : holdingDetails.holdings.filter((hold) => hold.tickerId !== holdingForSell.tickerId)

  return {
    totalValue: holdingDetails.totalValue,
    totalCash: cashAfterSell,
    holdings,
  }
}

export const detailsAfterSell = (
  currentDetails: HoldingDetails,
  sellTickerIds: number[],
  dailyTickers: interfaces.dailyTickersModel.DailyTickers,
  holdingSellPercent: number,
  tickerMinPercent: number,
  maxCashValue: number,
) => {
  let hasTransaction = false
  const holdingDetails = sellTickerIds.reduce((details, tickerId) => {
    const matchedDaily = dailyTickers[tickerId].daily
    const holding = currentDetails.holdings.find((holding) => holding.tickerId === tickerId)
    if (!matchedDaily || !holding) return details

    const refreshed = refreshHoldingsForSell(
      currentDetails,
      holding,
      matchedDaily,
      holdingSellPercent,
      tickerMinPercent,
      maxCashValue,
    )
    if (!refreshed) return details

    hasTransaction = true
    return refreshed
  }, currentDetails)

  return {
    hasTransaction,
    holdingDetails,
  }
}
