import * as interfaces from '@shared/interfaces'
import * as trader from './trader'

const HOLDING_HOLDINGS: interfaces.traderHoldingModel.Holding[] = [
  { tickerId: 1, shares: 100, splitMultiplier: 100, value: 10000 },
  { tickerId: 2, shares: 200, splitMultiplier: 200, value: 40000 },
  { tickerId: 3, shares: 300, splitMultiplier: 300, value: 90000 },
  { tickerId: 1, shares: 400, splitMultiplier: 400, value: 160000 },
  { tickerId: 1, shares: 500, splitMultiplier: 500, value: 250000 },
  { tickerId: 2, shares: 600, splitMultiplier: 600, value: 360000 },
]

const HOLDINGS: interfaces.traderHoldingModel.Record[] = [
  {
    id: 'a',
    traderId: 1,
    date: '2000-01-01',
    totalValue: 100,
    totalCash: 50,
    holdings: [HOLDING_HOLDINGS[0], HOLDING_HOLDINGS[1]],
  },
  {
    id: 'b',
    traderId: 1,
    date: '2001-01-01',
    totalValue: 200,
    totalCash: 10,
    holdings: [HOLDING_HOLDINGS[1]],
  },
  {
    id: 'c',
    traderId: 2,
    date: '2002-01-01',
    totalValue: 300,
    totalCash: 40,
    holdings: [HOLDING_HOLDINGS[2]],
  },
]

const DETAILS: interfaces.traderHoldingModel.Detail[] = [
  {
    date: '2000-01-01',
    totalValue: 100,
    totalCash: 100,
    holdings: [HOLDING_HOLDINGS[0], HOLDING_HOLDINGS[1], HOLDING_HOLDINGS[2]],
  },
  {
    date: '2000-01-02',
    totalValue: 100,
    totalCash: 100,
    holdings: [HOLDING_HOLDINGS[3]],
  },
  {
    date: '2000-01-03',
    totalValue: 100,
    totalCash: 100,
    holdings: [HOLDING_HOLDINGS[4], HOLDING_HOLDINGS[5]],
  },
]

test('could group holding records by traders', () => {
  const records = [HOLDINGS[0], HOLDINGS[1], HOLDINGS[2]]
  expect(trader.groupHoldingRecordsByTraders(records)).toStrictEqual({
    1: [HOLDINGS[0], HOLDINGS[1]],
    2: [HOLDINGS[2]],
  })
})

test('could gather record by date', () => {
  const holdings = [HOLDINGS[0], HOLDINGS[1], HOLDINGS[2]]
  expect(trader.gatherTraderHoldingRecordsByDate(
    [1, 2],
    holdings,
    trader.groupHoldingRecordsByTraders(holdings),
  )).toStrictEqual({
    '2000-01-01': [HOLDINGS[0], null],
    '2001-01-01': [HOLDINGS[1], null],
    '2002-01-01': [HOLDINGS[1], HOLDINGS[2]],
  })
})

test('could group holdings by tickers', () => {
  const holdings = [HOLDING_HOLDINGS[0], HOLDING_HOLDINGS[1], HOLDING_HOLDINGS[2]]
  expect(trader.groupHoldingsByTickers(holdings)).toStrictEqual({
    1: HOLDING_HOLDINGS[0],
    2: HOLDING_HOLDINGS[1],
    3: HOLDING_HOLDINGS[2],
  })
})

test('could merge holding for same tickers', () => {
  expect(trader.mergeHoldingDetails(DETAILS[0], DETAILS[1])).toStrictEqual([
    {
      tickerId: 1,
      shares: 500,
      splitMultiplier: 400,
      value: 170000,
    },
    HOLDING_HOLDINGS[1],
    HOLDING_HOLDINGS[2],
  ])
  expect(trader.mergeHoldingDetails(DETAILS[0], DETAILS[2])).toStrictEqual([
    {
      tickerId: 1,
      shares: 600,
      splitMultiplier: 500,
      value: 260000,
    },
    {
      tickerId: 2,
      shares: 800,
      splitMultiplier: 600,
      value: 400000,
    },
    HOLDING_HOLDINGS[2],
  ])
})

test('could merge holdings by date', () => {
  expect(trader.mergeHoldingsByDate(
    '2000-01-01',
    [HOLDINGS[0], null, HOLDINGS[0], HOLDINGS[1], HOLDINGS[2]],
    1,
  )).toStrictEqual({
    date: '2000-01-01',
    totalValue: 701,
    totalCash: 151,
    holdings: [
      {
        tickerId: 1,
        shares: 200,
        splitMultiplier: 100,
        value: 20000,
      },
      {
        tickerId: 2,
        shares: 600,
        splitMultiplier: 200,
        value: 120000,
      },
      {
        tickerId: 3,
        shares: 300,
        splitMultiplier: 300,
        value: 90000,
      },
    ],
  })
})

test('could present traderProfile', () => {
  // @ts-ignore
  const TRADER_1: interfaces.traderModel.Record = {
    id: 1,
    traderEnvId: 1,
    traderPatternId: 1,
    accessCode: '123',
  }
  // @ts-ignore
  const TRADER_2: interfaces.traderModel.Record = {
    id: 2,
    traderEnvId: 1,
    traderPatternId: 2,
    accessCode: '123',
    isActive: true,
  }
  const TRADER_PATTERNS: interfaces.traderPatternModel.Public[] = [
    // @ts-ignore
    { id: 1 },
    // @ts-ignore
    { id: 2 },
    // @ts-ignore
    { id: 3 },
  ]
  expect(trader.presentTraderProfile(TRADER_1, TRADER_PATTERNS)).toStrictEqual({
    trader: TRADER_1,
    pattern: TRADER_PATTERNS[0],
  })
  expect(trader.presentTraderProfile(TRADER_2, TRADER_PATTERNS)).toStrictEqual({
    trader: TRADER_2,
    pattern: TRADER_PATTERNS[1],
  })
})
