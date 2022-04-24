import * as interfaces from '@shared/interfaces'
import * as holding from './holding'

describe('getHoldingTotalValue', () => {
  const holdingDetail: interfaces.traderHoldingModel.Detail = {
    date: '2001-01-01',
    totalValue: 10000,
    totalCash: 1000,
    items: [
      { tickerId: 1, shares: 100, splitMultiplier: 2, value: 300 },
      { tickerId: 2, shares: 3, splitMultiplier: 20, value: 10 },
      { tickerId: 3, shares: 50, splitMultiplier: 1, value: 220 },
    ],
  }
  const tickerPrices1: interfaces.tickerDailyModel.TickerPrices = { 1: 1, 3: 5 }
  const tickerPrices2: interfaces.tickerDailyModel.TickerPrices = { 1: 2, 2: 3, 3: 4 }
  const tickerPrices3: interfaces.tickerDailyModel.TickerPrices = {}
  test('could get correct value', () => {
    expect(holding.getHoldingTotalValue(holdingDetail, tickerPrices1)).toBe(1350)
    expect(holding.getHoldingTotalValue(holdingDetail, tickerPrices2)).toBe(1409)
    expect(holding.getHoldingTotalValue(holdingDetail, tickerPrices3)).toBe(1000)
  })
})

describe('#groupHoldingsByTraders', () => {
  const holdings: interfaces.traderHoldingModel.Record[] = [
    // @ts-ignore
    { id: 'a', traderId: 1 }, { id: 'b', traderId: 1 }, { id: 'c', traderId: 2 }, { id: 'd', traderId: 3 },
  ]
  test('could group correctly', () => {
    expect(holding.groupHoldingsByTraders(holdings)).toStrictEqual({
      1: [holdings[0], holdings[1]],
      2: [holdings[2]],
      3: [holdings[3]],
    })
  })
})

describe('#getNearestHoldingByDate', () => {
  const holdings: interfaces.traderHoldingModel.Record[] = [
    // @ts-ignore
    { traderId: 1, date: '2001-01-01' }, { traderId: 1, date: '2001-01-02' }, { traderId: 2, date: '2001-01-03' },
  ]
  expect(holding.getNearestHoldingByDate('2000-12-31', holdings)).toBe(null)
  expect(holding.getNearestHoldingByDate('2001-01-01', holdings)).toBe(holdings[0])
  expect(holding.getNearestHoldingByDate('2001-01-02', holdings)).toBe(holdings[1])
  expect(holding.getNearestHoldingByDate('2001-01-03', holdings)).toBe(holdings[2])
  expect(holding.getNearestHoldingByDate('2001-01-04', holdings)).toBe(holdings[2])
})

describe('#groupTraderHoldingsByDate', () => {
  const dates = ['2001-01-05', '2001-01-06', '2001-01-07', '2001-01-08']
  const traderIds = [1, 2]
  const holdingsByTraders: holding.HoldingsByTraders = {
    // @ts-ignore
    1: [{ traderId: 1, date: '2001-01-06' }, { traderId: 1, date: '2001-01-07' }, { traderId: 1, date: '2001-01-08' }],
    // @ts-ignore
    2: [{ traderId: 2, date: '2001-01-07' }, { traderId: 2, date: '2001-01-09' }],
  }
  test('could group correctly', () => {
    expect(holding.groupTraderHoldingsByDate(dates, traderIds, holdingsByTraders))
      .toStrictEqual({
        '2001-01-05': [null, null],
        '2001-01-06': [{ traderId: 1, date: '2001-01-06' }, null],
        '2001-01-07': [{ traderId: 1, date: '2001-01-07' }, { traderId: 2, date: '2001-01-07' }],
        '2001-01-08': [{ traderId: 1, date: '2001-01-08' }, { traderId: 2, date: '2001-01-07' }],
      })
  })
})

describe('#groupHoldingItemsByTickers', () => {
  const holdingItems: interfaces.traderHoldingModel.Item[] = [
    // @ts-ignore
    { tickerId: 1, shares: 101 }, { tickerId: 2, shares: 102 }, { tickerId: 3, shares: 103 },
  ]
  test('could group holding items', () => {
    expect(holding.groupHoldingItemsByTickers(holdingItems))
      .toStrictEqual({
        1: { tickerId: 1, shares: 101 },
        2: { tickerId: 2, shares: 102 },
        3: { tickerId: 3, shares: 103 },
      })
  })
})

describe('#mergeHoldingItems', () => {
  test('could correctly merge', () => {
    expect(holding.mergeHoldingItems(
      { tickerId: 1, value: 100, shares: 20, splitMultiplier: 3 },
      { tickerId: 1, value: 200, shares: 33, splitMultiplier: 4 },
      5,
    )).toStrictEqual({ tickerId: 1, value: 300, shares: 53, splitMultiplier: 5 })
    expect(holding.mergeHoldingItems(
      { tickerId: 2, value: 300, shares: 10, splitMultiplier: 6 },
      { tickerId: 2, value: 200, shares: 2, splitMultiplier: 7 },
      3,
    )).toStrictEqual({ tickerId: 2, value: 500, shares: 12, splitMultiplier: 3 })
  })
})

describe('#getMergedHoldingItems', () => {
  // @ts-ignore
  const firstHolding: interfaces.traderHoldingModel.Detail = {
    date: '2001-02-03',
    items: [
      { tickerId: 1, shares: 5, value: 100, splitMultiplier: 2 },
      { tickerId: 2, shares: 4, value: 200, splitMultiplier: 3 },
    ],
  }
  // @ts-ignore
  const secondHolding: interfaces.traderHoldingModel.Detail = {
    date: '2001-02-04',
    items: [
      { tickerId: 1, shares: 7, value: 33, splitMultiplier: 4 },
    ],
  }
  test('could get correct items', () => {
    expect(holding.getMergedHoldingItems(firstHolding, secondHolding))
      .toStrictEqual([
        { tickerId: 1, shares: 12, value: 133, splitMultiplier: 4 },
        { tickerId: 2, shares: 4, value: 200, splitMultiplier: 3 },
      ])
  })
})

describe('#mergeTraderHoldingsByDate', () => {
  // @ts-ignore
  const traderHolding1: holding.TraderHolding = {
    date: '2001-02-03',
    totalValue: 82,
    totalCash: 12,
    items: [
      { tickerId: 1, value: 25, splitMultiplier: 2, shares: 4 },
      { tickerId: 2, value: 45, splitMultiplier: 3, shares: 5 },
    ],
  }
  // @ts-ignore
  const traderHolding2: holding.TraderHolding = {
    date: '2001-02-02',
    totalValue: 43,
    totalCash: 32,
    items: [
      { tickerId: 1, value: 11, splitMultiplier: 1, shares: 3 },
    ],
  }
  const traderHolding3: holding.TraderHolding = null
  test('could merge trader holding by date', () => {
    expect(holding.mergeTraderHoldingsByDate(
      '2001-02-03', [traderHolding1, traderHolding2, traderHolding3],
    )).toStrictEqual({
      date: '2001-02-03',
      totalValue: 10000125,
      totalCash: 10000044,
      items: [
        { tickerId: 1, value: 36, splitMultiplier: 2, shares: 7 },
        { tickerId: 2, value: 45, splitMultiplier: 3, shares: 5 },
      ],
    })
  })
})
