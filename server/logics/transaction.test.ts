import * as interfaces from '@shared/interfaces'
import * as transaction from './transaction'

const DAILY_TICKERS: interfaces.dailyTickersModel.DailyTickers = {
  1: {
    // @ts-ignore
    daily: { closePrice: 50, splitMultiplier: 1000 },
  },
  2: {
    // @ts-ignore
    daily: { closePrice: 100, splitMultiplier: 5 },
  },
}

const HOLDING_HOLDINGS: interfaces.traderHoldingModel.Item[] = [
  { tickerId: 1, shares: 100, splitMultiplier: 100, value: 10000 },
  { tickerId: 2, shares: 200, splitMultiplier: 200, value: 40000 },
  { tickerId: 3, shares: 300, splitMultiplier: 300, value: 90000 },
]

const HOLDING_DETAILS: transaction.HoldingDetails = {
  totalCash: 10000,
  totalValue: 140000,
  items: [HOLDING_HOLDINGS[0], HOLDING_HOLDINGS[1], HOLDING_HOLDINGS[2]],
}

test('could refresh holding based on daily value', () => {
  expect(transaction.refreshHoldingToDailyValue(
    HOLDING_HOLDINGS[0], DAILY_TICKERS[1],
  )).toEqual({ tickerId: 1, shares: 100, splitMultiplier: 1000, value: 5000000 })

  expect(transaction.refreshHoldingToDailyValue(
    HOLDING_HOLDINGS[0], null,
  )).toEqual(HOLDING_HOLDINGS[0])

  expect(transaction.refreshHoldingToDailyValue(
    HOLDING_HOLDINGS[1], DAILY_TICKERS[1],
  )).toEqual({ tickerId: 2, shares: 200, splitMultiplier: 1000, value: 10000000 })

  expect(transaction.refreshHoldingToDailyValue(
    HOLDING_HOLDINGS[1], null,
  )).toEqual(HOLDING_HOLDINGS[1])
})

test('could update holding details based on daily value', () => {
  expect(transaction.detailsFromCashAndHoldings(
    15,
    [HOLDING_HOLDINGS[0], HOLDING_HOLDINGS[1], HOLDING_HOLDINGS[2]],
    DAILY_TICKERS,
  )).toEqual({
    totalCash: 15,
    totalValue: 5190015,
    items: [
      { tickerId: 1, shares: 100, splitMultiplier: 1000, value: 5000000 },
      { tickerId: 2, shares: 200, splitMultiplier: 5, value: 100000 },
      { tickerId: 3, shares: 300, splitMultiplier: 300, value: 90000 },
    ],
  })
})

test('could generate empty holding detail', () => {
  expect(transaction.detailsFromCashAndHoldings(
    1000,
    [],
    DAILY_TICKERS,
  )).toEqual({
    totalCash: 1000,
    totalValue: 1000,
    items: [],
  })
})

test('should not refresh holding if holding equal to or more than ticker min percent', () => {
  expect(transaction.refreshHoldingsForLessThanMinPercent(
    HOLDING_DETAILS,
    HOLDING_HOLDINGS[0],
    5,
    5,
    20000,
  )).toEqual(null)
  expect(transaction.refreshHoldingsForLessThanMinPercent(
    HOLDING_DETAILS,
    HOLDING_HOLDINGS[0],
    5.1,
    5,
    20000,
  )).toEqual(null)
})

test('should not sell holding less than ticker min percent but exceed cash max precent', () => {
  expect(transaction.refreshHoldingsForLessThanMinPercent(
    HOLDING_DETAILS,
    HOLDING_HOLDINGS[0],
    5,
    5,
    19999,
  )).toEqual(null)
  expect(transaction.refreshHoldingsForLessThanMinPercent(
    HOLDING_DETAILS,
    HOLDING_HOLDINGS[0],
    5.1,
    5,
    20000,
  )).toEqual(null)
})

test('could refresh holdings for holding less than ticker min percent', () => {
  expect(transaction.refreshHoldingsForLessThanMinPercent(
    HOLDING_DETAILS,
    HOLDING_HOLDINGS[0],
    5,
    6,
    20000,
  )).toEqual({
    totalCash: 20000,
    totalValue: 140000,
    items: [
      { tickerId: 2, shares: 200, splitMultiplier: 200, value: 40000 },
      { tickerId: 3, shares: 300, splitMultiplier: 300, value: 90000 },
    ],
  })
})

test('should not sell holding if equal to or less than ticker max percent', () => {
  expect(transaction.refreshHoldingsForMoreThanMaxPercernt(
    HOLDING_DETAILS,
    HOLDING_HOLDINGS[0],
    16,
    16,
    11401,
    DAILY_TICKERS[1].daily,
  )).toEqual(null)

  expect(transaction.refreshHoldingsForMoreThanMaxPercernt(
    HOLDING_DETAILS,
    HOLDING_HOLDINGS[0],
    16,
    17,
    11401,
    DAILY_TICKERS[1].daily,
  )).toEqual(null)
})

test('should not sell holding if exceed cash max percent', () => {
  expect(transaction.refreshHoldingsForMoreThanMaxPercernt(
    HOLDING_DETAILS,
    HOLDING_HOLDINGS[0],
    16,
    16,
    11400,
    DAILY_TICKERS[1].daily,
  )).toEqual(null)

  expect(transaction.refreshHoldingsForMoreThanMaxPercernt(
    HOLDING_DETAILS,
    HOLDING_HOLDINGS[0],
    16,
    16,
    11399,
    DAILY_TICKERS[1].daily,
  )).toEqual(null)
})

test('could refresh holdings for holding greater than ticker max percent', () => {
  expect(transaction.refreshHoldingsForMoreThanMaxPercernt(
    HOLDING_DETAILS,
    HOLDING_HOLDINGS[0],
    16,
    15,
    11401,
    DAILY_TICKERS[1].daily,
  )).toEqual({
    totalCash: 11400,
    totalValue: 140000,
    items: [
      { tickerId: 1, shares: 99.972, splitMultiplier: 1000, value: 4998600 },
      { tickerId: 2, shares: 200, splitMultiplier: 200, value: 40000 },
      { tickerId: 3, shares: 300, splitMultiplier: 300, value: 90000 },
    ],
  })
})

test('should have no transaction if should not rebalance', () => {
  expect(transaction.detailsAfterRebalance(
    false,
    HOLDING_DETAILS,
    DAILY_TICKERS,
    8,
    65,
    140000,
  )).toEqual({
    hasTransaction: false,
    holdingDetails: HOLDING_DETAILS,
  })
})

test('should have no transaction if not triggerring max/min percernt rule', () => {
  expect(transaction.detailsAfterRebalance(
    true,
    HOLDING_DETAILS,
    DAILY_TICKERS,
    7,
    65,
    140000,
  )).toEqual({
    hasTransaction: false,
    holdingDetails: HOLDING_DETAILS,
  })
})

test('should have no transaction if not exceed max cash after sell', () => {
  expect(transaction.detailsAfterRebalance(
    true,
    HOLDING_DETAILS,
    DAILY_TICKERS,
    7,
    65,
    139999,
  )).toEqual({
    hasTransaction: false,
    holdingDetails: HOLDING_DETAILS,
  })
})

test('could update holding details after rebalance for min percernt rule', () => {
  expect(transaction.detailsAfterRebalance(
    true,
    HOLDING_DETAILS,
    DAILY_TICKERS,
    8,
    65,
    140000,
  )).toEqual({
    hasTransaction: true,
    holdingDetails: {
      totalCash: 20000,
      totalValue: 140000,
      items: [
        { tickerId: 2, shares: 200, splitMultiplier: 200, value: 40000 },
        { tickerId: 3, shares: 300, splitMultiplier: 300, value: 90000 },
      ],
    },
  })
})

test('should not have transaction if daily ticker not persist', () => {
  expect(transaction.detailsAfterRebalance(
    true,
    HOLDING_DETAILS,
    {},
    8,
    64,
    140000,
  )).toEqual({
    hasTransaction: false,
    holdingDetails: HOLDING_DETAILS,
  })

  expect(transaction.detailsAfterRebalance(
    true,
    HOLDING_DETAILS,
    DAILY_TICKERS,
    7,
    64,
    100000000,
  )).toEqual({
    hasTransaction: false,
    holdingDetails: HOLDING_DETAILS,
  })
})

test('should have no transaction if exceel max cash rule', () => {
  expect(transaction.detailsAfterRebalance(
    true,
    HOLDING_DETAILS,
    {
      // @ts-ignore
      3: { daily: { closePrice: 50, splitMultiplier: 1 } },
    },
    7,
    64,
    10450,
  )).toEqual({
    hasTransaction: false,
    holdingDetails: HOLDING_DETAILS,
  })
})

test('could update holding details after rebalance for max percernt rule', () => {
  expect(transaction.detailsAfterRebalance(
    true,
    HOLDING_DETAILS,
    {
      // @ts-ignore
      3: { daily: { closePrice: 50, splitMultiplier: 1 } },
    },
    7,
    64,
    10451,
  )).toEqual({
    hasTransaction: true,
    holdingDetails: {
      totalCash: 10450,
      totalValue: 140000,
      items: [
        { tickerId: 1, shares: 100, splitMultiplier: 100, value: 10000 },
        { tickerId: 2, shares: 200, splitMultiplier: 200, value: 40000 },
        { tickerId: 3, shares: 291, splitMultiplier: 1, value: 14550 },
      ],
    },
  })
})

test('should only trigger min rule if exceel max cash after sell min holding', () => {
  expect(transaction.detailsAfterRebalance(
    true,
    HOLDING_DETAILS,
    {
      ...DAILY_TICKERS,
      // @ts-ignore
      3: { daily: { closePrice: 50, splitMultiplier: 1 } },
    },
    8,
    65,
    139999,
  )).toEqual({
    hasTransaction: true,
    holdingDetails: {
      totalCash: 20000,
      totalValue: 140000,
      items: [
        { tickerId: 2, shares: 200, splitMultiplier: 200, value: 40000 },
        { tickerId: 3, shares: 300, splitMultiplier: 300, value: 90000 },
      ],
    },
  })
})

test('could update holding details after rebalance for both min and max percernt rule', () => {
  expect(transaction.detailsAfterRebalance(
    true,
    HOLDING_DETAILS,
    {
      ...DAILY_TICKERS,
      // @ts-ignore
      3: { daily: { closePrice: 50, splitMultiplier: 1 } },
    },
    8,
    64,
    20451,
  )).toEqual({
    hasTransaction: true,
    holdingDetails: {
      totalCash: 20450,
      totalValue: 140000,
      items: [
        { tickerId: 2, shares: 200, splitMultiplier: 200, value: 40000 },
        { tickerId: 3, shares: 291, splitMultiplier: 1, value: 14550 },
      ],
    },
  })
})
