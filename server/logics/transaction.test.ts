import * as interfaces from '@shared/interfaces'
import * as transaction from './transaction'
import { mock } from 'ts-mockito'

const dailyMock: interfaces.tickerDailyModel.Record = mock({})
const dailyTickerMock: interfaces.dailyTickersModel.DailyTicker = mock({})

describe('#refreshHoldingItemValue', () => {
  const items: interfaces.traderHoldingModel.Item[] = [
    { tickerId: 1, shares: 100, splitMultiplier: 10, value: 10000 },
    { tickerId: 2, shares: 200, splitMultiplier: 2, value: 4000 },
  ]

  const dailyTickers: interfaces.dailyTickersModel.DailyTickers = {
    1: { ...dailyTickerMock, daily: { ...dailyMock, closePrice: 12, splitMultiplier: 12 } },
    2: { ...dailyTickerMock, daily: { ...dailyMock, closePrice: 10, splitMultiplier: 3 } },
  }
  test('could refresh value', () => {
    expect(transaction.refreshHoldingItemValue(items[0], dailyTickers[1]))
      .toEqual({ tickerId: 1, shares: 100, splitMultiplier: 12, value: 14400 })
    expect(transaction.refreshHoldingItemValue(items[0], null)).toEqual(items[0])
    expect(transaction.refreshHoldingItemValue(items[1], dailyTickers[2]))
      .toEqual({ tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 })
  })
})

describe('#detailsFromCashAndHoldings', () => {
  const items: interfaces.traderHoldingModel.Item[] = [
    { tickerId: 1, shares: 100, splitMultiplier: 10, value: 10000 },
    { tickerId: 2, shares: 200, splitMultiplier: 2, value: 4000 },
    { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
  ]
  const dailyTickers: interfaces.dailyTickersModel.DailyTickers = {
    1: { ...dailyTickerMock, daily: { ...dailyMock, closePrice: 12, splitMultiplier: 12 } },
    2: { ...dailyTickerMock, daily: { ...dailyMock, closePrice: 10, splitMultiplier: 3 } },
  }
  test('could generate holdingDetail from cash adn items', () => {
    expect(transaction.detailFromCashAndItems(50, items, dailyTickers, '', {})).toEqual({
      totalCash: 50,
      totalValue: 20650,
      date: '',
      items: [
        { tickerId: 1, shares: 100, splitMultiplier: 12, value: 14400 },
        { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
        { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
      ],
    })
  })
})

describe('#sellForLessThanTickerMinPercent', () => {
  const holding = {
    totalCash: 50,
    totalValue: 20650,
    date: '',
    items: [
      { tickerId: 1, shares: 100, splitMultiplier: 12, value: 14400 },
      { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
      { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
    ],
  }
  test('should refresh if match tickerMinPercent', () => {
    expect(transaction.sellForLessThanTickerMinPercent(
      holding,
      { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
      1,
      1.1,
      250,
    )).toEqual({
      totalCash: 250,
      totalValue: 20650,
      date: '',
      items: [
        { tickerId: 1, shares: 100, splitMultiplier: 12, value: 14400 },
        { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
      ],
    })
  })
  test('should not refresh if not match any condition', () => {
    expect(transaction.sellForLessThanTickerMinPercent(
      holding,
      { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
      1,
      1,
      20000,
    )).toEqual(null)
    expect(transaction.sellForLessThanTickerMinPercent(
      holding,
      { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
      1,
      1.1,
      249,
    )).toEqual(null)
  })
})

describe('#sellForMoreThanTickerMaxPercernt', () => {
  const holding = {
    totalCash: 50,
    totalValue: 20650,
    date: '',
    items: [
      { tickerId: 1, shares: 100, splitMultiplier: 12, value: 14400 },
      { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
      { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
    ],
  }
  test('could sell correctly', () => {
    const tickerDaily: interfaces.tickerDailyModel.Record = {
      ...dailyMock,
      closePrice: 12,
      splitMultiplier: 4,
    }
    expect(transaction.sellForMoreThanTickerMaxPercernt(
      holding,
      { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
      29,
      25,
      879,
      tickerDaily,
    )).toStrictEqual({
      totalCash: 878,
      totalValue: 20650,
      date: '',
      items: [
        { tickerId: 1, shares: 100, splitMultiplier: 12, value: 14400 },
        { tickerId: 2, shares: 182.75, splitMultiplier: 4, value: 8772 },
        { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
      ],
    })
  })
  test('should not sell if not match any condition', () => {
    const tickerDaily: interfaces.tickerDailyModel.Record = {
      ...dailyMock,
      closePrice: 12,
      splitMultiplier: 4,
    }
    expect(transaction.sellForMoreThanTickerMaxPercernt(
      holding,
      { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
      29,
      25,
      879,
      null,
    )).toStrictEqual(null)
    expect(transaction.sellForMoreThanTickerMaxPercernt(
      holding,
      { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
      29,
      29.1,
      879,
      tickerDaily,
    )).toStrictEqual(null)
    expect(transaction.sellForMoreThanTickerMaxPercernt(
      holding,
      { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
      50,
      0.1,
      10000,
      tickerDaily,
    )).toStrictEqual(null)
  })
})

describe('#detailAfterRebalance', () => {
  const holding = {
    totalCash: 50,
    totalValue: 20650,
    date: '',
    items: [
      { tickerId: 1, shares: 100, splitMultiplier: 12, value: 14400 },
      { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
      { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
    ],
  }
  const dailyTickers: interfaces.dailyTickersModel.DailyTickers = {
    1: { ...dailyTickerMock, daily: { ...dailyMock, closePrice: 12, splitMultiplier: 12 } },
    3: { ...dailyTickerMock, daily: { ...dailyMock, closePrice: 10, splitMultiplier: 1 } },
  }
  test('could refresh for min only', () => {
    expect(transaction.detailAfterRebalance(
      true,
      holding,
      dailyTickers,
      1,
      50,
      250,
    )).toStrictEqual({
      hasTransaction: true,
      holdingDetail: {
        totalCash: 250,
        totalValue: 20650,
        date: '',
        items: [
          { tickerId: 1, shares: 100, splitMultiplier: 12, value: 14400 },
          { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
        ],
      },
    })
    expect(transaction.detailAfterRebalance(
      true,
      holding,
      dailyTickers,
      1,
      50,
      249,
    )).toStrictEqual({ hasTransaction: false, holdingDetail: holding })
  })
  test('could refresh for max', () => {
    const detailForMax = {
      totalCash: 8200,
      totalValue: 28800,
      date: '',
      items: [
        { tickerId: 1, shares: 100, splitMultiplier: 12, value: 14400 },
        { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
        { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
      ],
    }
    expect(transaction.detailAfterRebalance(
      true,
      detailForMax,
      dailyTickers,
      0.009,
      45.5,
      10000,
    )).toStrictEqual({
      hasTransaction: true,
      holdingDetail: {
        totalCash: 9496,
        totalValue: 28800,
        date: '',
        items: [
          { tickerId: 1, shares: 91, splitMultiplier: 12, value: 13104 },
          { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
          { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
        ],
      },
    })
    expect(transaction.detailAfterRebalance(
      true,
      detailForMax,
      dailyTickers,
      0.009,
      50.1,
      10000,
    )).toStrictEqual({
      hasTransaction: false,
      holdingDetail: detailForMax,
    })
  })
  test('could refresh for both', () => {
    const detailForBoth = {
      totalCash: 8200,
      totalValue: 28800,
      date: '',
      items: [
        { tickerId: 1, shares: 100, splitMultiplier: 12, value: 14400 },
        { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
        { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
      ],
    }
    expect(transaction.detailAfterRebalance(
      true,
      detailForBoth,
      dailyTickers,
      1,
      45.5,
      10000,
    )).toStrictEqual({
      hasTransaction: true,
      holdingDetail: {
        totalCash: 9696,
        totalValue: 28800,
        date: '',
        items: [
          { tickerId: 1, shares: 91, splitMultiplier: 12, value: 13104 },
          { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
        ],
      },
    })
    expect(transaction.detailAfterRebalance(
      false,
      detailForBoth,
      dailyTickers,
      1,
      45.5,
      10000,
    )).toStrictEqual({ hasTransaction: false, holdingDetail: detailForBoth })
  })
})

describe('#sellForHoldingPercent', () => {
  const holding = {
    totalCash: 3400,
    totalValue: 24000,
    date: '',
    items: [
      { tickerId: 1, shares: 100, splitMultiplier: 12, value: 14400 },
      { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
      { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
    ],
  }

  const tickerDaily: interfaces.tickerDailyModel.Record = {
    ...dailyMock,
    closePrice: 10,
    splitMultiplier: 3,
  }
  test('could sell based on percent', () => {
    expect(transaction.sellForHoldingPercent(
      holding,
      { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
      tickerDaily,
      50,
      12.5,
      6400,
    )).toStrictEqual({
      totalCash: 6400,
      totalValue: 24000,
      date: '',
      items: [
        { tickerId: 1, shares: 100, splitMultiplier: 12, value: 14400 },
        { tickerId: 2, shares: 100, splitMultiplier: 3, value: 3000 },
        { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
      ],
    })
  })
  test('should not sell if not match any condition', () => {
    expect(transaction.sellForHoldingPercent(
      holding,
      { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
      tickerDaily,
      50,
      12.6,
      6400,
    )).toStrictEqual(null)
    expect(transaction.sellForHoldingPercent(
      holding,
      { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
      tickerDaily,
      50,
      12.5,
      6399,
    )).toStrictEqual(null)
    expect(transaction.sellForHoldingPercent(
      holding,
      { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
      tickerDaily,
      101,
      0,
      100000,
    )).toStrictEqual(null)
  })
  test('could sell all', () => {
    expect(transaction.sellForHoldingPercent(
      holding,
      { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
      tickerDaily,
      100,
      0,
      9400,
    )).toStrictEqual({
      totalCash: 9400,
      totalValue: 24000,
      date: '',
      items: [
        { tickerId: 1, shares: 100, splitMultiplier: 12, value: 14400 },
        { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
      ],
    })
  })
})

describe('#detailAfterSell', () => {
  const holding = {
    totalCash: 3400,
    totalValue: 24000,
    date: '',
    items: [
      { tickerId: 1, shares: 100, splitMultiplier: 12, value: 14400 },
      { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
      { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
    ],
  }
  const dailyTickers: interfaces.dailyTickersModel.DailyTickers = {
    1: { ...dailyTickerMock, daily: { ...dailyMock, closePrice: 12, splitMultiplier: 12 } },
    2: { ...dailyTickerMock, daily: { ...dailyMock, closePrice: 10, splitMultiplier: 3 } },
  }
  test('could refresh correctly after sell', () => {
    expect(transaction.detailAfterSell(
      holding,
      [1, 2, 3],
      dailyTickers,
      50,
      12.5,
      13600,
    )).toStrictEqual({
      hasTransaction: true,
      holdingDetail: {
        totalCash: 13600,
        totalValue: 24000,
        date: '',
        items: [
          { tickerId: 1, shares: 50, splitMultiplier: 12, value: 7200 },
          { tickerId: 2, shares: 100, splitMultiplier: 3, value: 3000 },
          { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
        ],
      },
    })
    expect(transaction.detailAfterSell(
      holding,
      [1, 2, 3],
      dailyTickers,
      50,
      12.4,
      10599,
    )).toStrictEqual({
      hasTransaction: true,
      holdingDetail: {
        totalCash: 6400,
        totalValue: 24000,
        date: '',
        items: [
          { tickerId: 1, shares: 100, splitMultiplier: 12, value: 14400 },
          { tickerId: 2, shares: 100, splitMultiplier: 3, value: 3000 },
          { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
        ],
      },
    })
    expect(transaction.detailAfterSell(
      holding,
      [1, 2, 3],
      dailyTickers,
      50,
      12.5,
      6400,
    )).toStrictEqual({
      hasTransaction: true,
      holdingDetail: {
        totalCash: 6400,
        totalValue: 24000,
        date: '',
        items: [
          { tickerId: 1, shares: 100, splitMultiplier: 12, value: 14400 },
          { tickerId: 2, shares: 100, splitMultiplier: 3, value: 3000 },
          { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
        ],
      },
    })
    expect(transaction.detailAfterSell(
      holding,
      [1, 2, 3],
      dailyTickers,
      50,
      12.4,
      10600,
    )).toStrictEqual({
      hasTransaction: true,
      holdingDetail: {
        totalCash: 10600,
        totalValue: 24000,
        date: '',
        items: [
          { tickerId: 1, shares: 50, splitMultiplier: 12, value: 7200 },
          { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
          { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
        ],
      },
    })
    expect(transaction.detailAfterSell(
      holding,
      [1, 2, 3],
      dailyTickers,
      50,
      12.6,
      15600,
    )).toStrictEqual({
      hasTransaction: true,
      holdingDetail: {
        totalCash: 10600,
        totalValue: 24000,
        date: '',
        items: [
          { tickerId: 1, shares: 50, splitMultiplier: 12, value: 7200 },
          { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
          { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
        ],
      },
    })
    expect(transaction.detailAfterSell(
      holding,
      [1, 2, 3],
      dailyTickers,
      50,
      12.5,
      6399,
    )).toStrictEqual({
      hasTransaction: false,
      holdingDetail: {
        totalCash: 3400,
        totalValue: 24000,
        date: '',
        items: [
          { tickerId: 1, shares: 100, splitMultiplier: 12, value: 14400 },
          { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
          { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
        ],
      },
    })
  })
})

describe('#buyForHoldingPercent', () => {
  const holding = {
    totalCash: 3400,
    totalValue: 24000,
    date: '',
    items: [
      { tickerId: 1, shares: 100, splitMultiplier: 12, value: 14400 },
      { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
      { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
    ],
  }
  test('could buy for new holding', () => {
    const tickerDaily: interfaces.tickerDailyModel.Record = {
      ...dailyMock,
      closePrice: 100,
      splitMultiplier: 2,
    }
    expect(transaction.buyForHoldingPercent(
      holding,
      { tickerId: 4, shares: 0, splitMultiplier: 0, value: 0 },
      tickerDaily,
      1200,
      5,
    )).toStrictEqual({
      totalCash: 2200,
      totalValue: 24000,
      date: '',
      items: [
        { tickerId: 1, shares: 100, splitMultiplier: 12, value: 14400 },
        { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
        { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
        { tickerId: 4, shares: 6, splitMultiplier: 2, value: 1200 },
      ],
    })
    expect(transaction.buyForHoldingPercent(
      holding,
      { tickerId: 4, shares: 0, splitMultiplier: 0, value: 0 },
      tickerDaily,
      1200,
      4.9,
    )).toStrictEqual(null)
    expect(transaction.buyForHoldingPercent(
      holding,
      { tickerId: 4, shares: 0, splitMultiplier: 0, value: 0 },
      tickerDaily,
      3500,
      15,
    )).toStrictEqual({
      totalCash: 0,
      totalValue: 24000,
      date: '',
      items: [
        { tickerId: 1, shares: 100, splitMultiplier: 12, value: 14400 },
        { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
        { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
        { tickerId: 4, shares: 17, splitMultiplier: 2, value: 3400 },
      ],
    })
    expect(transaction.buyForHoldingPercent(
      holding,
      { tickerId: 4, shares: 0, splitMultiplier: 0, value: 0 },
      tickerDaily,
      3500,
      14,
    )).toStrictEqual(null)
    expect(transaction.buyForHoldingPercent(
      holding,
      { tickerId: 4, shares: 0, splitMultiplier: 0, value: 0 },
      { ...dailyMock, closePrice: 10, splitMultiplier: 3 },
      1200,
      5,
    )).toStrictEqual({
      totalCash: 2200,
      totalValue: 24000,
      date: '',
      items: [
        { tickerId: 1, shares: 100, splitMultiplier: 12, value: 14400 },
        { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
        { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
        { tickerId: 4, shares: 40, splitMultiplier: 3, value: 1200 },
      ],
    })
  })
  test('could buy for old holding', () => {
    const tickerDaily: interfaces.tickerDailyModel.Record = {
      ...dailyMock,
      closePrice: 10,
      splitMultiplier: 1,
    }
    expect(transaction.buyForHoldingPercent(
      holding,
      { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
      tickerDaily,
      1200,
      6,
    )).toStrictEqual({
      totalCash: 2200,
      totalValue: 24000,
      date: '',
      items: [
        { tickerId: 1, shares: 100, splitMultiplier: 12, value: 14400 },
        { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
        { tickerId: 3, shares: 140, splitMultiplier: 1, value: 1400 },
      ],
    })
    expect(transaction.buyForHoldingPercent(
      holding,
      { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
      tickerDaily,
      1200,
      5.8,
    )).toStrictEqual(null)
    expect(transaction.buyForHoldingPercent(
      holding,
      { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
      tickerDaily,
      3600,
      15,
    )).toStrictEqual({
      totalCash: 0,
      totalValue: 24000,
      date: '',
      items: [
        { tickerId: 1, shares: 100, splitMultiplier: 12, value: 14400 },
        { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
        { tickerId: 3, shares: 360, splitMultiplier: 1, value: 3600 },
      ],
    })
    expect(transaction.buyForHoldingPercent(
      holding,
      { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
      tickerDaily,
      3600,
      14,
    )).toStrictEqual(null)
    expect(transaction.buyForHoldingPercent(
      holding,
      { tickerId: 2, shares: 200, splitMultiplier: 3, value: 6000 },
      { ...dailyMock, closePrice: 10, splitMultiplier: 3 },
      1200,
      30,
    )).toStrictEqual({
      totalCash: 2200,
      totalValue: 24000,
      date: '',
      items: [
        { tickerId: 1, shares: 100, splitMultiplier: 12, value: 14400 },
        { tickerId: 2, shares: 240, splitMultiplier: 3, value: 7200 },
        { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
      ],
    })
  })
  test('could buy nothing', () => {
    const tickerDaily: interfaces.tickerDailyModel.Record = {
      ...dailyMock,
      closePrice: 10,
      splitMultiplier: 1,
    }
    expect(transaction.buyForHoldingPercent(
      {
        ...holding,
        totalCash: 9.99,
      },
      { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
      tickerDaily,
      1200,
      6,
    )).toBeNull()
  })
})

describe('#detailAfterBuy', () => {
  test('could refresh detail after buy', () => {
    const holding = {
      totalCash: 3400,
      totalValue: 19600,
      date: '',
      items: [
        { tickerId: 1, shares: 1000, splitMultiplier: 1, value: 10000 },
        { tickerId: 2, shares: 300, splitMultiplier: 2, value: 6000 },
        { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
      ],
    }
    const dailyTickers: interfaces.dailyTickersModel.DailyTickers = {
      1: { ...dailyTickerMock, daily: { ...dailyMock, closePrice: 10, splitMultiplier: 1 } },
      2: { ...dailyTickerMock, daily: { ...dailyMock, closePrice: 10, splitMultiplier: 2 } },
      4: { ...dailyTickerMock, daily: { ...dailyMock, closePrice: 5, splitMultiplier: 2 } },
    }
    expect(transaction.detailAfterBuy(
      holding,
      [1, 2, 4, 5],
      dailyTickers,
      1000,
      57,
    )).toStrictEqual({
      hasTransaction: true,
      holdingDetail: {
        totalCash: 400,
        totalValue: 19600,
        date: '',
        items: [
          { tickerId: 1, shares: 1100, splitMultiplier: 1, value: 11000 },
          { tickerId: 2, shares: 350, splitMultiplier: 2, value: 7000 },
          { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
          { tickerId: 4, shares: 100, splitMultiplier: 2, value: 1000 },
        ],
      },
    })
    expect(transaction.detailAfterBuy(
      holding,
      [1, 2, 4, 5],
      dailyTickers,
      1000,
      56,
    )).toStrictEqual({
      hasTransaction: true,
      holdingDetail: {
        totalCash: 1400,
        totalValue: 19600,
        date: '',
        items: [
          { tickerId: 1, shares: 1000, splitMultiplier: 1, value: 10000 },
          { tickerId: 2, shares: 350, splitMultiplier: 2, value: 7000 },
          { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
          { tickerId: 4, shares: 100, splitMultiplier: 2, value: 1000 },
        ],
      },
    })
    expect(transaction.detailAfterBuy(
      holding,
      [1, 2, 4, 5],
      dailyTickers,
      2000,
      56,
    )).toStrictEqual({
      hasTransaction: true,
      holdingDetail: {
        totalCash: 0,
        totalValue: 19600,
        date: '',
        items: [
          { tickerId: 1, shares: 1000, splitMultiplier: 1, value: 10000 },
          { tickerId: 2, shares: 400, splitMultiplier: 2, value: 8000 },
          { tickerId: 3, shares: 20, splitMultiplier: 1, value: 200 },
          { tickerId: 4, shares: 140, splitMultiplier: 2, value: 1400 },
        ],
      },
    })
  })
})
