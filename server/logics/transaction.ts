import * as interfaces from '@shared/interfaces'

const getItemHoldingValue = (
  shares: number,
  defaultValue: number,
  tickerDaily: interfaces.tickerDailyModel.Record | undefined,
) => {
  return tickerDaily
    ? shares * tickerDaily.closePrice * tickerDaily.splitMultiplier
    : defaultValue
}

export const refreshHoldingItemValue = (
  item: interfaces.traderHoldingModel.Item,
  dailyTicker: interfaces.dailyTickersModel.DailyTicker | null,
): interfaces.traderHoldingModel.Item => {
  const matchedDaily = dailyTicker?.daily
  const holdingValue = getItemHoldingValue(item.shares, item.value, matchedDaily)
  const splitMultiplier = matchedDaily?.splitMultiplier || item.splitMultiplier
  const updatedHolding = {
    tickerId: item.tickerId,
    shares: item.shares,
    value: holdingValue,
    splitMultiplier,
  }
  return updatedHolding
}

export const detailFromCashAndItems = (
  totalCash: number,
  items: interfaces.traderHoldingModel.Item[],
  dailyTickers: interfaces.dailyTickersModel.DailyTickers,
  tradeDate: string,
  delistedLastPrices: DelistedLastPrices,
): interfaces.traderHoldingModel.Detail => {
  const emptyDetail: interfaces.traderHoldingModel.Detail = {
    totalValue: totalCash, totalCash, items: [], date: '',
  }
  return items.reduce((details, item) => {
    const isDelisted = delistedLastPrices[item.tickerId] && delistedLastPrices[item.tickerId].date <= tradeDate
    if (isDelisted) {
      const holdingValue = getItemHoldingValue(item.shares, item.value, delistedLastPrices[item.tickerId])
      details.totalValue += holdingValue
      details.totalCash += holdingValue
      return details
    }

    const matched = dailyTickers[item.tickerId] || null
    const refreshedHolding = refreshHoldingItemValue(item, matched)
    details.totalValue += refreshedHolding.value
    details.items.push(refreshedHolding)
    return details
  }, emptyDetail)
}

export const sellForLessThanTickerMinPercent = (
  holdingDetail: interfaces.traderHoldingModel.Detail,
  itemForSell: interfaces.traderHoldingModel.Item,
  holdingPercent: number,
  tickerMinPercent: number,
  maxCashValue: number,
): interfaces.traderHoldingModel.Detail | null => {
  const isLessThanMinPercent = holdingPercent < tickerMinPercent
  if (!isLessThanMinPercent) return null

  const cashAfterSell = holdingDetail.totalCash + itemForSell.value
  const couldSell = cashAfterSell <= maxCashValue
  if (!couldSell) return null
  return {
    date: '',
    totalValue: holdingDetail.totalValue,
    totalCash: cashAfterSell,
    items: holdingDetail.items.filter((item) => item.tickerId !== itemForSell.tickerId),
  }
}

export const sellForMoreThanTickerMaxPercernt = (
  holdingDetail: interfaces.traderHoldingModel.Detail,
  itemForSell: interfaces.traderHoldingModel.Item,
  holdingPercent: number,
  tickerMaxPercent: number,
  maxCashValue: number,
  tickerDaily: interfaces.tickerDailyModel.Record | null,
): interfaces.traderHoldingModel.Detail | null => {
  if (!tickerDaily) return null

  const isMoreThanMaxPercent = holdingPercent > tickerMaxPercent
  if (!isMoreThanMaxPercent) return null

  const sellTargetPercent = holdingPercent - tickerMaxPercent
  const sellTargetValue = Math.ceil(holdingDetail.totalValue * sellTargetPercent / 100)
  const sellTargetShares = Math.ceil(sellTargetValue / tickerDaily.closePrice)
  const sharesSold = sellTargetShares / tickerDaily.splitMultiplier
  const sharesLeft = itemForSell.shares - sharesSold
  const dailyFinalPrice = tickerDaily.closePrice * tickerDaily.splitMultiplier
  const cashAfterSell = holdingDetail.totalCash + sharesSold * dailyFinalPrice
  const couldSell = sharesLeft && cashAfterSell < maxCashValue

  if (!couldSell) return null

  const holdingAfterSell = {
    tickerId: itemForSell.tickerId,
    shares: sharesLeft,
    value: sharesLeft * dailyFinalPrice,
    splitMultiplier: tickerDaily.splitMultiplier,
  }
  return {
    totalValue: holdingDetail.totalValue,
    totalCash: cashAfterSell,
    date: '',
    items: holdingDetail.items.map((item) => {
      if (item.tickerId !== itemForSell.tickerId) return item
      return holdingAfterSell
    }),
  }
}

interface DetailAndTransaction {
  holdingDetail: interfaces.traderHoldingModel.Detail;
  hasTransaction: boolean;
}

export interface DelistedLastPrices {
  [tickerId: number]: interfaces.tickerDailyModel.Record;
}

export const detailAfterRebalance = (
  shouldRebalance: boolean,
  currentDetail: interfaces.traderHoldingModel.Detail,
  dailyTickers: interfaces.dailyTickersModel.DailyTickers,
  tickerMinPercent: number,
  tickerMaxPercent: number,
  maxCashValue: number,
): DetailAndTransaction => {
  if (!shouldRebalance) {
    return {
      holdingDetail: currentDetail,
      hasTransaction: false,
    }
  }

  let hasTransaction = false
  const details = currentDetail.items.reduce((details, item) => {
    const matched = dailyTickers[item.tickerId]
    if (!matched) return details

    const matchedDaily = matched.daily
    const holdingPercent = (item.value / details.totalValue) * 100
    const refreshedForMinPercernt = sellForLessThanTickerMinPercent(
      details, item, holdingPercent, tickerMinPercent, maxCashValue,
    )
    if (refreshedForMinPercernt) {
      hasTransaction = true
      return refreshedForMinPercernt
    }

    const refreshedForMaxPercent = sellForMoreThanTickerMaxPercernt(
      details, item, holdingPercent, tickerMaxPercent, maxCashValue, matchedDaily,
    )
    if (refreshedForMaxPercent) {
      hasTransaction = true
      return refreshedForMaxPercent
    }

    return details
  }, currentDetail)
  return {
    hasTransaction,
    holdingDetail: details,
  }
}

export const sellForHoldingPercent = (
  holdingDetail: interfaces.traderHoldingModel.Detail,
  itemForSell: interfaces.traderHoldingModel.Item,
  tickerDaily: interfaces.tickerDailyModel.Record,
  holdingSellPercent: number,
  tickerMinPercent: number,
  maxCashValue: number,
): interfaces.traderHoldingModel.Detail | null => {
  const sharesSold = Math.floor(itemForSell.shares * tickerDaily.splitMultiplier * holdingSellPercent / 100)
  const baseSharesShold = holdingSellPercent === 100 ? itemForSell.shares : sharesSold / tickerDaily.splitMultiplier
  if (itemForSell.shares < baseSharesShold) return null

  const valueSold = getItemHoldingValue(baseSharesShold, 0, tickerDaily)
  const percentAfterSell = (itemForSell.value - valueSold) / holdingDetail.totalValue
  if (percentAfterSell * 100 < tickerMinPercent) return null

  const cashAfterSell = holdingDetail.totalCash + valueSold
  if (cashAfterSell > maxCashValue) return null

  const sharesAfterSell = itemForSell.shares - baseSharesShold
  const valueAfterSell = sharesAfterSell * tickerDaily.closePrice * tickerDaily.splitMultiplier
  const itemDetail = {
    tickerId: itemForSell.tickerId,
    shares: sharesAfterSell,
    value: valueAfterSell,
    splitMultiplier: tickerDaily.splitMultiplier,
  }

  const items = sharesAfterSell
    ? holdingDetail.items.map((item) => item.tickerId === itemForSell.tickerId ? itemDetail : item)
    : holdingDetail.items.filter((item) => item.tickerId !== itemForSell.tickerId)

  return {
    date: '',
    totalValue: holdingDetail.totalValue,
    totalCash: cashAfterSell,
    items,
  }
}

export const detailAfterSell = (
  currentDetail: interfaces.traderHoldingModel.Detail,
  sellTickerIds: number[],
  dailyTickers: interfaces.dailyTickersModel.DailyTickers,
  holdingSellPercent: number,
  tickerMinPercent: number,
  maxCashValue: number,
): DetailAndTransaction => {
  let hasTransaction = false
  const holdingDetail = sellTickerIds.reduce((details, tickerId) => {
    const matchedDaily = dailyTickers[tickerId]?.daily
    const item = details.items.find((item) => item.tickerId === tickerId)
    if (!matchedDaily || !item) return details

    const refreshed = sellForHoldingPercent(
      details,
      item,
      matchedDaily,
      holdingSellPercent,
      tickerMinPercent,
      maxCashValue,
    )
    if (!refreshed) return details

    hasTransaction = true
    return refreshed
  }, currentDetail)

  return {
    hasTransaction,
    holdingDetail,
  }
}

export const buyForHoldingPercent = (
  holdingDetail: interfaces.traderHoldingModel.Detail,
  itemForBuy: interfaces.traderHoldingModel.Item,
  tickerDaily: interfaces.tickerDailyModel.Record,
  maxBuyAmount: number,
  tickerMaxPercent: number,
): interfaces.traderHoldingModel.Detail | null => {
  const isNewHolding = !itemForBuy.shares
  const maxCashToUse = holdingDetail.totalCash < maxBuyAmount
    ? holdingDetail.totalCash
    : maxBuyAmount
  const sharesBought = Math.floor(maxCashToUse / tickerDaily.closePrice)
  if (!sharesBought) return null

  const baseSharesBought = sharesBought / tickerDaily.splitMultiplier
  const adjustedPrice = tickerDaily.closePrice * tickerDaily.splitMultiplier
  const valueBought = baseSharesBought * adjustedPrice

  const sharesAfterBuy = baseSharesBought + itemForBuy.shares
  const valueAfterBuy = sharesAfterBuy * adjustedPrice
  const percentAfterBuy = (valueAfterBuy / holdingDetail.totalValue) * 100
  const isLessThanMaxPercent = percentAfterBuy <= tickerMaxPercent
  if (!isLessThanMaxPercent) return null

  const itemDetail = {
    tickerId: itemForBuy.tickerId,
    shares: sharesAfterBuy,
    value: valueAfterBuy,
    splitMultiplier: tickerDaily.splitMultiplier,
  }

  const items = isNewHolding
    ? [...holdingDetail.items, itemDetail]
    : holdingDetail.items.map((item) => item.tickerId === itemForBuy.tickerId ? itemDetail : item)
  return {
    totalValue: holdingDetail.totalValue,
    totalCash: holdingDetail.totalCash - valueBought,
    items,
    date: '',
  }
}

export const detailAfterBuy = (
  currentDetail: interfaces.traderHoldingModel.Detail,
  buyTickerIds: number[],
  dailyTickers: interfaces.dailyTickersModel.DailyTickers,
  maxBuyAmount: number,
  tickerMaxPercent: number,
): DetailAndTransaction => {
  let hasTransaction = false
  const holdingDetail = buyTickerIds.reduce((detail, tickerId) => {
    const matchedDaily = dailyTickers[tickerId]?.daily
    if (!matchedDaily) return detail

    const item = currentDetail.items.find((item) => item.tickerId === tickerId) ||
      { tickerId, shares: 0, splitMultiplier: 0, value: 0 }

    const refreshed = buyForHoldingPercent(
      detail,
      item,
      matchedDaily,
      maxBuyAmount,
      tickerMaxPercent,
    )
    if (!refreshed) return detail

    hasTransaction = true
    return refreshed
  }, currentDetail)

  return {
    holdingDetail,
    hasTransaction,
  }
}
