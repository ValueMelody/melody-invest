import * as interfaces from '@shared/interfaces'

const getItemHoldingValue = (
  shares: number,
  closePrice: number,
  splitMultiplier: number,
) => {
  return shares * closePrice * splitMultiplier
}

export const refreshHoldingItemValue = (
  item: interfaces.traderHoldingModel.Item,
  tickerInfo: interfaces.dailyTickersModel.TickerInfo | undefined,
): interfaces.traderHoldingModel.Item => {
  const holdingValue = tickerInfo
    ? getItemHoldingValue(
      item.shares,
      tickerInfo.closePrice,
      tickerInfo.splitMultiplier,
    )
    : item.value
  const splitMultiplier = tickerInfo ? tickerInfo.splitMultiplier : item.splitMultiplier
  const updatedHolding = {
    tickerId: item.tickerId,
    shares: item.shares,
    value: holdingValue,
    splitMultiplier,
  }
  return updatedHolding
}

export const generateHoldingDetail = (
  totalCash: number,
  items: interfaces.traderHoldingModel.Item[],
  tickerInfos: interfaces.dailyTickersModel.TickerInfos,
  tradeDate: string,
  delistedLastPrices: DelistedLastPrices,
): interfaces.traderHoldingModel.Detail => {
  const emptyDetail: interfaces.traderHoldingModel.Detail = {
    totalValue: totalCash, totalCash, items: [], date: '',
  }
  return items.reduce((details, item) => {
    const delistedRecord = delistedLastPrices[item.tickerId]
    const isDelisted = delistedRecord && delistedRecord.date <= tradeDate

    // If one holding item is delisted, then treat as cash out based on price from last record
    if (isDelisted) {
      const holdingValue = delistedRecord
        ? getItemHoldingValue(
          item.shares,
          delistedRecord.closePrice,
          delistedRecord.splitMultiplier,
        )
        : item.value
      details.totalValue += holdingValue
      details.totalCash += holdingValue
      return details
    }

    const matchedInfo = tickerInfos[item.tickerId]
    // Recalculate one holding item by provided market data
    const refreshedHolding = refreshHoldingItemValue(item, matchedInfo)
    details.totalValue += refreshedHolding.value
    details.items.push(refreshedHolding)
    return details
  }, emptyDetail)
}

export const sellItemIfLessThanTickerMinPercent = (
  holdingDetail: interfaces.traderHoldingModel.Detail,
  itemForSell: interfaces.traderHoldingModel.Item,
  holdingPercent: number,
  tickerMinPercent: number,
  maxCashValue: number,
): interfaces.traderHoldingModel.Detail | null => {
  const isLessThanMinPercent = holdingPercent < tickerMinPercent
  if (!isLessThanMinPercent) return null

  const cashAfterSell = holdingDetail.totalCash + itemForSell.value

  // Only sell if cash after sell is less than allowed max cash
  const couldSell = cashAfterSell <= maxCashValue
  if (!couldSell) return null

  return {
    date: '',
    totalValue: holdingDetail.totalValue,
    totalCash: cashAfterSell,
    items: holdingDetail.items.filter((item) => item.tickerId !== itemForSell.tickerId),
  }
}

export const sellItemIfMoreThanTickerMaxPercernt = (
  holdingDetail: interfaces.traderHoldingModel.Detail,
  itemForSell: interfaces.traderHoldingModel.Item,
  holdingPercent: number,
  tickerMaxPercent: number,
  maxCashValue: number,
  tickerInfo: interfaces.dailyTickersModel.TickerInfo,
): interfaces.traderHoldingModel.Detail | null => {
  const isMoreThanMaxPercent = holdingPercent > tickerMaxPercent
  if (!isMoreThanMaxPercent) return null

  const sellTargetPercent = holdingPercent - tickerMaxPercent
  const sellTargetValue = Math.ceil(holdingDetail.totalValue * sellTargetPercent)
  const sellTargetShares = Math.ceil(sellTargetValue / tickerInfo.closePrice)
  const sharesSold = sellTargetShares / tickerInfo.splitMultiplier
  const sharesLeft = itemForSell.shares - sharesSold
  const sellValue = sellTargetShares * tickerInfo.closePrice
  const cashAfterSell = holdingDetail.totalCash + sellValue

  // Only sell if cash after sell is less than allowed max cash and there are still shares left
  const couldSell = sharesLeft && (cashAfterSell <= maxCashValue)
  if (!couldSell) return null

  const holdingAfterSell = {
    tickerId: itemForSell.tickerId,
    shares: sharesLeft,
    value: itemForSell.value - sellValue,
    splitMultiplier: tickerInfo.splitMultiplier,
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

export const rebalanceHoldingDetail = (
  shouldRebalance: boolean,
  currentDetail: interfaces.traderHoldingModel.Detail,
  tickerInfos: interfaces.dailyTickersModel.TickerInfos,
  tickerMinPercent: number,
  tickerMaxPercent: number,
  cashMaxPercent: number,
): DetailAndTransaction => {
  if (!shouldRebalance) {
    return {
      holdingDetail: currentDetail,
      hasTransaction: false,
    }
  }

  let hasTransaction = false
  const maxCashValue = currentDetail.totalValue * cashMaxPercent

  const details = currentDetail.items.reduce((details, item) => {
    // If holding item has no market data, skip rebalance
    const matchedInfo = tickerInfos[item.tickerId]
    if (!matchedInfo) return details

    const holdingPercent = item.value / details.totalValue

    // If hold less than required min percent, then sell all shares
    const refreshedForMinPercernt = sellItemIfLessThanTickerMinPercent(
      details, item, holdingPercent, tickerMinPercent, maxCashValue,
    )
    if (refreshedForMinPercernt) {
      hasTransaction = true
      return refreshedForMinPercernt
    }

    // If hold more than allowed max percent, then sell exceed shares
    const refreshedForMaxPercent = sellItemIfMoreThanTickerMaxPercernt(
      details, item, holdingPercent, tickerMaxPercent, maxCashValue, matchedInfo,
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

export const sellItemFromHolding = (
  holdingDetail: interfaces.traderHoldingModel.Detail,
  itemForSell: interfaces.traderHoldingModel.Item,
  tickerInfo: interfaces.dailyTickersModel.TickerInfo,
  holdingSellPercent: number,
  tickerMinPercent: number,
  cashMaxPercent: number,
): interfaces.traderHoldingModel.Detail | null => {
  // Get how many shares and base shares should be sold
  const sharesSold = Math.floor(itemForSell.shares * tickerInfo.splitMultiplier * holdingSellPercent)
  const baseSharesShold = holdingSellPercent === 1 ? itemForSell.shares : sharesSold / tickerInfo.splitMultiplier
  if (itemForSell.shares < baseSharesShold) return null

  const valueSold = sharesSold * tickerInfo.closePrice

  // If hold percentage is less than min required hold percentage, then do not sell
  const percentAfterSell = (itemForSell.value - valueSold) / holdingDetail.totalValue
  if (percentAfterSell < tickerMinPercent) return null

  // If case after sell is larger than maxmium allow cash, then do not sell
  const cashAfterSell = holdingDetail.totalCash + valueSold
  const cashMaxValue = holdingDetail.totalValue * cashMaxPercent
  if (cashAfterSell > cashMaxValue) return null

  const sharesAfterSell = itemForSell.shares - baseSharesShold

  let items
  // If no shares left, then remove from holdings
  if (sharesAfterSell) {
    const valueAfterSell = sharesAfterSell * tickerInfo.closePrice * tickerInfo.splitMultiplier
    const itemDetail = {
      tickerId: itemForSell.tickerId,
      shares: sharesAfterSell,
      value: valueAfterSell,
      splitMultiplier: tickerInfo.splitMultiplier,
    }
    items = holdingDetail.items.map((item) => item.tickerId === itemForSell.tickerId ? itemDetail : item)
  } else {
    items = holdingDetail.items.filter((item) => item.tickerId !== itemForSell.tickerId)
  }

  return {
    date: '',
    totalValue: holdingDetail.totalValue,
    totalCash: cashAfterSell,
    items,
  }
}

export const getHoldingDetailAfterSell = (
  currentDetail: interfaces.traderHoldingModel.Detail,
  sellTickerIds: number[],
  tickerInfos: interfaces.dailyTickersModel.TickerInfos,
  holdingSellPercent: number,
  tickerMinPercent: number,
  cashMaxPercent: number,
): DetailAndTransaction => {
  let hasTransaction = false
  const holdingDetail = sellTickerIds.reduce((details, tickerId) => {
    const tickerInfo = tickerInfos[tickerId]
    const item = details.items.find((item) => item.tickerId === tickerId)
    // Make sure holding and ticker info exists
    if (!tickerInfo || !item) return details

    const refreshedDetails = sellItemFromHolding(
      details,
      item,
      tickerInfo,
      holdingSellPercent,
      tickerMinPercent,
      cashMaxPercent,
    )
    // If nothing sold, keep details the same
    if (!refreshedDetails) return details

    hasTransaction = true
    return refreshedDetails
  }, currentDetail)

  return {
    hasTransaction,
    holdingDetail,
  }
}

export const buyItemToHolding = (
  holdingDetail: interfaces.traderHoldingModel.Detail,
  itemForBuy: interfaces.traderHoldingModel.Item,
  tickerInfo: interfaces.dailyTickersModel.TickerInfo,
  holdingBuyPercent: number,
  tickerMaxPercent: number,
): interfaces.traderHoldingModel.Detail | null => {
  const maxBuyAmount = holdingDetail.totalValue & holdingBuyPercent

  // Use maximum allowed cash or use total cash left if less than maximun allowed
  const maxCashToUse = holdingDetail.totalCash < maxBuyAmount
    ? holdingDetail.totalCash
    : maxBuyAmount

  const sharesBought = Math.floor(maxCashToUse / tickerInfo.closePrice)
  if (!sharesBought) return null

  const baseSharesBought = sharesBought / tickerInfo.splitMultiplier
  const valueBought = sharesBought * tickerInfo.closePrice
  const sharesAfterBuy = baseSharesBought + itemForBuy.shares
  const valueAfterBuy = sharesAfterBuy * tickerInfo.closePrice * tickerInfo.splitMultiplier

  // If hold more than maxmum allowed percentage after buy, then do not buy
  const percentAfterBuy = valueAfterBuy / holdingDetail.totalValue
  const isLessThanMaxPercent = percentAfterBuy <= tickerMaxPercent
  if (!isLessThanMaxPercent) return null

  const itemDetail = {
    tickerId: itemForBuy.tickerId,
    shares: sharesAfterBuy,
    value: valueAfterBuy,
    splitMultiplier: tickerInfo.splitMultiplier,
  }

  const isNewHolding = !itemForBuy.shares
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

export const getHoldingDetailAfterBuy = (
  currentDetail: interfaces.traderHoldingModel.Detail,
  buyTickerIds: number[],
  tickerInfos: interfaces.dailyTickersModel.TickerInfos,
  holdingBuyPercent: number,
  tickerMaxPercent: number,
): DetailAndTransaction => {
  let hasTransaction = false
  const holdingDetail = buyTickerIds.reduce((details, tickerId) => {
    const tickerInfo = tickerInfos[tickerId]
    // Make sure holding and ticker info exists
    if (!tickerInfo) return details

    // Find existing holding item or initial an empty one
    const item = details.items.find((item) => item.tickerId === tickerId) || {
      tickerId, shares: 0, splitMultiplier: 0, value: 0
    }

    const refreshedDetails = buyItemToHolding(
      details,
      item,
      tickerInfo,
      holdingBuyPercent,
      tickerMaxPercent,
    )

    // If nothing bought, keep details the same
    if (!refreshedDetails) return details

    hasTransaction = true
    return refreshedDetails
  }, currentDetail)

  return {
    holdingDetail,
    hasTransaction,
  }
}
