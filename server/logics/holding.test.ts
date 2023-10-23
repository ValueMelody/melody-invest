
import * as interfaces from '@shared/interfaces'
import { instance, mock } from 'ts-mockito'
import * as holding from './holding'

describe('#groupHoldingsByTraders', () => {
  const holdingMock: interfaces.traderHoldingModel.Record = mock({})

  const holdings: interfaces.traderHoldingModel.Record[] = [
    { ...holdingMock, id: 'a', traderId: 1 },
    { ...holdingMock, id: 'b', traderId: 1 },
    { ...holdingMock, id: 'c', traderId: 2 },
    { ...holdingMock, id: 'd', traderId: 3 },
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
  const holdingMock: interfaces.traderHoldingModel.Record = mock({})

  const holdings: interfaces.traderHoldingModel.Record[] = [
    { ...holdingMock, traderId: 1, date: '2001-01-01' },
    { ...holdingMock, traderId: 1, date: '2001-01-02' },
    { ...holdingMock, traderId: 2, date: '2001-01-03' },
  ]
  expect(holding.getNearestHoldingByDate('2000-12-31', holdings)).toBe(null)
  expect(holding.getNearestHoldingByDate('2001-01-01', holdings)).toBe(holdings[0])
  expect(holding.getNearestHoldingByDate('2001-01-02', holdings)).toBe(holdings[1])
  expect(holding.getNearestHoldingByDate('2001-01-03', holdings)).toBe(holdings[2])
  expect(holding.getNearestHoldingByDate('2001-01-04', holdings)).toBe(holdings[2])
})

describe('#groupTraderHoldingsByDate', () => {
  const dates = ['2001-01-05', '2001-01-06', '2001-01-07', '2001-01-08']
  const traderIds = [1, 2, 3]

  const holdingMock: interfaces.traderHoldingModel.Record = mock({})
  const holdingInstance = instance(holdingMock)

  const holdingsByTraders: holding.HoldingsByTraders = {
    1: [
      { ...holdingInstance, traderId: 1, date: '2001-01-06' },
      { ...holdingInstance, traderId: 1, date: '2001-01-07' },
      { ...holdingInstance, traderId: 1, date: '2001-01-08' },
    ],
    2: [
      { ...holdingInstance, traderId: 2, date: '2001-01-07' },
      { ...holdingInstance, traderId: 2, date: '2001-01-09' },
    ],
  }
  test('could group correctly', () => {
    expect(holding.groupTraderHoldingsByDate(dates, traderIds, holdingsByTraders))
      .toStrictEqual({
        '2001-01-05': [null, null, null],
        '2001-01-06': [{ traderId: 1, date: '2001-01-06' }, null, null],
        '2001-01-07': [{ traderId: 1, date: '2001-01-07' }, { traderId: 2, date: '2001-01-07' }, null],
        '2001-01-08': [{ traderId: 1, date: '2001-01-08' }, { traderId: 2, date: '2001-01-07' }, null],
      })
  })
})

describe('#groupHoldingItemsByTickers', () => {
  const holdingMock: interfaces.traderHoldingModel.Item = mock({})
  const holdingInstance = instance(holdingMock)

  const holdingItems: interfaces.traderHoldingModel.Item[] = [
    { ...holdingInstance, tickerId: 1, shares: 101 },
    { ...holdingInstance, tickerId: 2, shares: 102 },
    { ...holdingInstance, tickerId: 3, shares: 103 },
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
  const holdingMock: interfaces.traderHoldingModel.Detail = mock({})
  const holdingInstance = instance(holdingMock)

  const firstHolding: interfaces.traderHoldingModel.Detail = {
    ...holdingInstance,
    date: '2001-02-03',
    items: [
      { tickerId: 1, shares: 5, value: 100, splitMultiplier: 2 },
      { tickerId: 2, shares: 4, value: 200, splitMultiplier: 3 },
    ],
  }
  const secondHolding: interfaces.traderHoldingModel.Detail = {
    ...holdingInstance,
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
  const holdingMock: interfaces.traderHoldingModel.Record = mock({})
  const holdingInstance = instance(holdingMock)

  const traderHolding1: holding.TraderHolding = {
    ...holdingInstance,
    date: '2001-02-03',
    totalValue: 82,
    totalCash: 12,
    items: [
      { tickerId: 1, value: 25, splitMultiplier: 2, shares: 4 },
      { tickerId: 2, value: 45, splitMultiplier: 3, shares: 5 },
    ],
  }

  const traderHolding2: holding.TraderHolding = {
    ...holdingInstance,
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
