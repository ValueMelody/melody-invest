import * as interfaces from '@shared/interfaces'

export const refreshHoldingToDailyValue = (
  item: interfaces.traderHoldingModel.Item,
  dailyTicker: interfaces.dailyTickersModel.DailyTicker | null,
): interfaces.traderHoldingModel.Item => {
  const matchedDaily = dailyTicker?.daily
  const holdingValue = matchedDaily
    ? item.shares * matchedDaily.closePrice * matchedDaily.splitMultiplier
    : item.value
  const splitMultiplier = matchedDaily?.splitMultiplier || item.splitMultiplier
  const updatedHolding = {
    tickerId: item.tickerId,
    shares: item.shares,
    value: holdingValue,
    splitMultiplier,
  }
  return updatedHolding
}

export interface HoldingDetails {
  totalCash: number,
  totalValue: number,
  items: interfaces.traderHoldingModel.Item[]
}

export const detailsFromCashAndHoldings = (
  totalCash: number,
  items: interfaces.traderHoldingModel.Item[],
  dailyTickers: interfaces.dailyTickersModel.DailyTickers,
): HoldingDetails => {
  const detailsBeforeUpdate: HoldingDetails = {
    totalValue: totalCash, totalCash, items: [],
  }
  return items.reduce((details, item) => {
    const matched = dailyTickers[item.tickerId] || null
    const refreshedHolding = refreshHoldingToDailyValue(item, matched)
    return {
      totalValue: details.totalValue + refreshedHolding.value,
      totalCash: details.totalCash,
      items: [...details.items, refreshedHolding],
    }
  }, detailsBeforeUpdate)
}

export const refreshHoldingsForLessThanMinPercent = (
  holdingDetails: HoldingDetails,
  itemForSell: interfaces.traderHoldingModel.Item,
  holdingPercent: number,
  tickerMinPercent: number,
  maxCashValue: number,
): HoldingDetails | null => {
  const isLessThanMinPercent = holdingPercent < tickerMinPercent
  if (!isLessThanMinPercent) return null

  const cashAfterSell = holdingDetails.totalCash + itemForSell.value
  const couldSell = cashAfterSell <= maxCashValue
  if (!couldSell) return null
  return {
    totalValue: holdingDetails.totalValue,
    totalCash: cashAfterSell,
    items: holdingDetails.items.filter((item) => item.tickerId !== itemForSell.tickerId),
  }
}

export const refreshHoldingsForMoreThanMaxPercernt = (
  holdingDetails: HoldingDetails,
  itemForSell: interfaces.traderHoldingModel.Item,
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

  const sharesLeft = itemForSell.shares - sharesSold
  const dailyFinalPrice = tickerDaily.closePrice * tickerDaily.splitMultiplier
  const cashAfterSell = holdingDetails.totalCash + sharesSold * dailyFinalPrice
  const couldSell = sharesLeft && cashAfterSell < maxCashValue

  if (!couldSell) return null

  const holdingAfterSell = {
    tickerId: itemForSell.tickerId,
    shares: sharesLeft,
    value: sharesLeft * dailyFinalPrice,
    splitMultiplier: tickerDaily.splitMultiplier,
  }
  return {
    totalValue: holdingDetails.totalValue,
    totalCash: cashAfterSell,
    items: holdingDetails.items.map((item) => {
      if (item.tickerId !== itemForSell.tickerId) return item
      return holdingAfterSell
    }),
  }
}

interface DetailsAndTransaction {
  holdingDetails: HoldingDetails;
  hasTransaction: boolean;
}

export const detailsAfterRebalance = (
  shouldRebalance: boolean,
  currentDetails: HoldingDetails,
  dailyTickers: interfaces.dailyTickersModel.DailyTickers,
  tickerMinPercent: number,
  tickerMaxPercent: number,
  maxCashValue: number,
): DetailsAndTransaction => {
  if (!shouldRebalance) {
    return {
      holdingDetails: currentDetails,
      hasTransaction: false,
    }
  }

  let hasTransaction = false
  const details = currentDetails.items.reduce((details, item) => {
    const matched = dailyTickers[item.tickerId]
    if (!matched) return details

    const matchedDaily = matched.daily
    const holdingPercent = (item.value / details.totalValue) * 100

    const refreshedForMinPercernt = refreshHoldingsForLessThanMinPercent(
      details, item, holdingPercent, tickerMinPercent, maxCashValue,
    )
    if (refreshedForMinPercernt) {
      hasTransaction = true
      return refreshedForMinPercernt
    }

    const refreshedForMaxPercent = refreshHoldingsForMoreThanMaxPercernt(
      details, item, holdingPercent, tickerMaxPercent, maxCashValue, matchedDaily,
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
  itemForSell: interfaces.traderHoldingModel.Item,
  tickerDaily: interfaces.tickerDailyModel.Record,
  holdingSellPercent: number,
  tickerMinPercent: number,
  maxCashValue: number,
): HoldingDetails | null => {
  const sharesSold = Math.floor(itemForSell.shares * tickerDaily.splitMultiplier * holdingSellPercent / 100)
  const baseSharesShold = sharesSold / tickerDaily.splitMultiplier
  if (itemForSell.shares < baseSharesShold) return null

  const valueSold = baseSharesShold * tickerDaily.splitMultiplier * tickerDaily.closePrice
  const percentAfterSell = (itemForSell.value - valueSold) / holdingDetails.totalValue
  if (percentAfterSell * 100 < tickerMinPercent) return null

  const cashAfterSell = holdingDetails.totalCash + valueSold
  if (cashAfterSell > maxCashValue) return null

  const sharesAfterSell = itemForSell.shares - baseSharesShold
  const valueAfterSell = sharesAfterSell * tickerDaily.closePrice * tickerDaily.splitMultiplier
  const holdingDetail = {
    tickerId: itemForSell.tickerId,
    shares: sharesAfterSell,
    value: valueAfterSell,
    splitMultiplier: tickerDaily.splitMultiplier,
  }

  const items = sharesAfterSell
    ? holdingDetails.items.map((item) => item.tickerId === itemForSell.tickerId ? holdingDetail : item)
    : holdingDetails.items.filter((item) => item.tickerId !== itemForSell.tickerId)

  return {
    totalValue: holdingDetails.totalValue,
    totalCash: cashAfterSell,
    items,
  }
}

export const detailsAfterSell = (
  currentDetails: HoldingDetails,
  sellTickerIds: number[],
  dailyTickers: interfaces.dailyTickersModel.DailyTickers,
  holdingSellPercent: number,
  tickerMinPercent: number,
  maxCashValue: number,
): DetailsAndTransaction => {
  let hasTransaction = false
  const holdingDetails = sellTickerIds.reduce((details, tickerId) => {
    const matchedDaily = dailyTickers[tickerId].daily
    const item = currentDetails.items.find((item) => item.tickerId === tickerId)
    if (!matchedDaily || !item) return details

    const refreshed = refreshHoldingsForSell(
      currentDetails,
      item,
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

export const refreshHoldingsForBuy = (
  holdingDetails: HoldingDetails,
  itemForBuy: interfaces.traderHoldingModel.Item,
  tickerDaily: interfaces.tickerDailyModel.Record,
  maxBuyAmount: number,
  tickerMaxPercent: number,
): HoldingDetails | null => {
  const isNewHolding = !itemForBuy.shares
  const maxCashToUse = holdingDetails.totalCash < maxBuyAmount
    ? holdingDetails.totalCash
    : maxBuyAmount
  const sharesBought = Math.floor(maxCashToUse / tickerDaily.closePrice)
  if (!sharesBought) return null

  const baseSharesBought = sharesBought / tickerDaily.splitMultiplier
  const adjustedPrice = tickerDaily.closePrice * tickerDaily.splitMultiplier
  const valueBought = baseSharesBought * adjustedPrice

  const sharesAfterBuy = baseSharesBought + itemForBuy.shares
  const valueAfterBuy = sharesAfterBuy * adjustedPrice
  const percentAfterBuy = (valueAfterBuy / holdingDetails.totalValue) * 100
  const isLessThanMaxPercent = percentAfterBuy < tickerMaxPercent
  if (!isLessThanMaxPercent) return null

  const holdingDetail = {
    tickerId: itemForBuy.tickerId,
    shares: sharesAfterBuy,
    value: valueAfterBuy,
    splitMultiplier: tickerDaily.splitMultiplier,
  }

  const items = isNewHolding
    ? [...holdingDetails.items, holdingDetail]
    : holdingDetails.items.map((item) => item.tickerId === itemForBuy.tickerId ? holdingDetail : item)
  return {
    totalValue: holdingDetails.totalValue,
    totalCash: holdingDetails.totalCash - valueBought,
    items,
  }
}

export const detailsAfterBuy = (
  currentDetails: HoldingDetails,
  buyTickerIds: number[],
  dailyTickers: interfaces.dailyTickersModel.DailyTickers,
  maxBuyAmount: number,
  tickerMaxPercent: number,
): DetailsAndTransaction => {
  let hasTransaction = false
  const holdingDetails = buyTickerIds.reduce((details, tickerId) => {
    const matchedDaily = dailyTickers[tickerId].daily
    if (!matchedDaily) return details

    const item = currentDetails.items.find((item) => item.tickerId === tickerId) ||
      { tickerId, shares: 0, splitMultiplier: 0, value: 0 }

    const refreshed = refreshHoldingsForBuy(
      details,
      item,
      matchedDaily,
      maxBuyAmount,
      tickerMaxPercent,
    )
    if (!refreshed) return details

    hasTransaction = true
    return refreshed
  }, currentDetails)

  return {
    holdingDetails,
    hasTransaction,
  }
}
