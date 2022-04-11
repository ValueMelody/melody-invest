import * as interfaces from '@shared/interfaces'
import * as trader from './trader'

const HOLDING_1 = {
  tickerId: 1,
  shares: 100,
  splitMultiplier: 100,
  value: 10000,
}
const HOLDING_2 = {
  tickerId: 2,
  shares: 200,
  splitMultiplier: 200,
  value: 40000,
}
const HOLDING_3 = {
  tickerId: 3,
  shares: 300,
  splitMultiplier: 300,
  value: 90000,
}

const RECORD_1 = {
  id: 'a',
  traderId: 1,
  date: '2000-01-01',
  totalValue: 100,
  totalCash: 50,
  holdings: [HOLDING_1, HOLDING_2],
}
const RECORD_2 = {
  id: 'b',
  traderId: 1,
  date: '2001-01-01',
  totalValue: 200,
  totalCash: 10,
  holdings: [HOLDING_2],
}
const RECORD_3 = {
  id: 'c',
  traderId: 2,
  date: '2002-01-01',
  totalValue: 300,
  totalCash: 40,
  holdings: [HOLDING_3],
}

test('could group holding records by traders', () => {
  const records = [RECORD_1, RECORD_2, RECORD_3]
  expect(trader.groupHoldingRecordsByTraders(records)).toStrictEqual({
    1: [RECORD_1, RECORD_2],
    2: [RECORD_3],
  })
})

test('could gather record by date', () => {
  const holdings = [RECORD_1, RECORD_2, RECORD_3]
  expect(trader.gatherTraderHoldingRecordsByDate(
    [1, 2],
    holdings,
    trader.groupHoldingRecordsByTraders(holdings),
  )).toStrictEqual({
    '2000-01-01': [RECORD_1, null],
    '2001-01-01': [RECORD_2, null],
    '2002-01-01': [RECORD_2, RECORD_3],
  })
})

test('could group holdings by tickers', () => {
  const holdings = [HOLDING_1, HOLDING_2, HOLDING_3]
  expect(trader.groupHoldingsByTickers(holdings)).toStrictEqual({
    1: HOLDING_1,
    2: HOLDING_2,
    3: HOLDING_3,
  })
})

const HOLDING_4 = {
  tickerId: 1,
  shares: 400,
  splitMultiplier: 400,
  value: 160000,
}
const HOLDING_5 = {
  tickerId: 1,
  shares: 500,
  splitMultiplier: 500,
  value: 250000,
}
const HOLDING_6 = {
  tickerId: 2,
  shares: 600,
  splitMultiplier: 600,
  value: 360000,
}

const DETAIL_1 = {
  date: '2000-01-01',
  totalValue: 100,
  totalCash: 100,
  holdings: [HOLDING_1, HOLDING_2, HOLDING_3],
}
const DETAIL_2 = {
  date: '2000-01-02',
  totalValue: 100,
  totalCash: 100,
  holdings: [HOLDING_4],
}
const DETAIL_3 = {
  date: '2000-01-03',
  totalValue: 100,
  totalCash: 100,
  holdings: [HOLDING_5, HOLDING_6],
}

test('could merge holding for same tickers', () => {
  expect(trader.mergeHoldingDetails(DETAIL_1, DETAIL_2)).toStrictEqual([
    {
      tickerId: 1,
      shares: 500,
      splitMultiplier: 400,
      value: 170000,
    },
    HOLDING_2,
    HOLDING_3,
  ])
  expect(trader.mergeHoldingDetails(DETAIL_1, DETAIL_3)).toStrictEqual([
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
    HOLDING_3,
  ])
})

test('could merge holdings by date', () => {
  expect(trader.mergeHoldingsByDate(
    '2000-01-01',
    [RECORD_1, null, RECORD_1, RECORD_2, RECORD_3],
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

const TRADER_1 = {
  id: 1,
  traderEnvId: 1,
  traderPatternId: 1,
  accessCode: '123',
  isActive: true,
  rebalancedAt: null,
  estimatedAt: null,
  startedAt: null,
  totalDays: null,
  yearlyPercentNumber: null,
  grossPercentNumber: null,
  pastYearPercentNumber: null,
  pastQuarterPercentNumber: null,
  pastMonthPercentNumber: null,
  pastWeekPercentNumber: null,
  totalValue: null,
}

const TRADER_2 = {
  id: 2,
  traderEnvId: 1,
  traderPatternId: 2,
  accessCode: '123',
  isActive: true,
  rebalancedAt: null,
  estimatedAt: null,
  startedAt: null,
  totalDays: null,
  yearlyPercentNumber: null,
  grossPercentNumber: null,
  pastYearPercentNumber: null,
  pastQuarterPercentNumber: null,
  pastMonthPercentNumber: null,
  pastWeekPercentNumber: null,
  totalValue: null,
}

const TRADER_PATTERNS: interfaces.traderPatternModel.Public[] = [
  // @ts-ignore
  { id: 1 },
  // @ts-ignore
  { id: 2 },
  // @ts-ignore
  { id: 3 },
]

test('could present traderProfile', () => {
  expect(trader.presentTraderProfile(TRADER_1, TRADER_PATTERNS)).toStrictEqual({
    trader: TRADER_1,
    pattern: TRADER_PATTERNS[0],
  })
  expect(trader.presentTraderProfile(TRADER_2, TRADER_PATTERNS)).toStrictEqual({
    trader: TRADER_2,
    pattern: TRADER_PATTERNS[1],
  })
})
