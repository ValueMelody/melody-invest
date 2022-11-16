import * as tickerDailyModel from 'models/tickerDaily'
import buildHoldingValueStats from './buildHoldingValueStats'
import getNearestPricesByDateMock from '../../../scripts/mocks/methods/getNearestPricesByDateMock'

jest
  .spyOn(tickerDailyModel, 'getNearestPricesByDate')
  .mockImplementation(getNearestPricesByDateMock)

describe('#buildHoldingValueStats', () => {
  test('could build empty stats', async () => {
    const holdings = [
      {
        date: '2001-02-01',
        totalCash: 100000,
        items: [],
      },
    ]
    const result = await buildHoldingValueStats(
      '1990-01-01',
      '2000-12-31',
      100000,
      // @ts-ignore
      holdings,
    )
    expect(result).toStrictEqual({
      totalValue: null,
      totalDays: 4017,
      grossPercentNumber: null,
      yearlyPercentNumber: null,
      pastWeekPercentNumber: null,
      pastMonthPercentNumber: null,
      pastQuarterPercentNumber: null,
      pastYearPercentNumber: null,
      oneYearTrends: [],
      oneDecadeTrends: [],
    })
  })

  test('could build holding value stats', async () => {
    const holdings = [
      {
        date: '2001-02-01',
        totalCash: 25679,
        items: [
          { tickerId: 1, shares: 10000 },
          { tickerId: 2, shares: 2000 },
          { tickerId: 3, shares: 4000 },
          { tickerId: 4, shares: 100 },
          { tickerId: 5, shares: 500 },
        ],
      },
    ]
    const result = await buildHoldingValueStats(
      '2001-01-01',
      '2010-12-31',
      100000,
      // @ts-ignore
      holdings,
    )
    expect(result).toStrictEqual({
      totalValue: 281581,
      totalDays: 3651,
      grossPercentNumber: 18158,
      yearlyPercentNumber: 1815,
      pastWeekPercentNumber: 768,
      pastMonthPercentNumber: 1103,
      pastQuarterPercentNumber: 880,
      pastYearPercentNumber: 3314,
      oneYearTrends: [
        211491, 213851,
        219794, 221929,
        224494, 224494,
        247094, 256976,
        256976, 258786,
        254666, 253606,
      ],
      oneDecadeTrends: [
        101750, 99350,
        115500, 120180,
        143020, 159320,
        168120, 175741,
        208801,
      ],
    })
  })
  test('could build value for multi holdings', async () => {
    const holdings = [
      {
        date: '2006-01-01',
        totalCash: 17514.4,
        items: [
          { tickerId: 1, shares: 10030 },
          { tickerId: 2, shares: 2100 },
          { tickerId: 3, shares: 3000 },
          { tickerId: 4, shares: 100 },
          { tickerId: 5, shares: 1000 },
        ],
      },
      {
        date: '2001-02-01',
        totalCash: 25679,
        items: [
          { tickerId: 1, shares: 10000 },
          { tickerId: 2, shares: 2000 },
          { tickerId: 3, shares: 4000 },
          { tickerId: 4, shares: 100 },
          { tickerId: 5, shares: 500 },
        ],
      },
    ]
    const result = await buildHoldingValueStats(
      '2001-01-01',
      '2010-12-31',
      100000,
      // @ts-ignore
      holdings,
    )
    expect(result).toStrictEqual({
      totalValue: 271973,
      totalDays: 3651,
      grossPercentNumber: 17197,
      yearlyPercentNumber: 1719,
      pastWeekPercentNumber: 787,
      pastMonthPercentNumber: 1143,
      pastQuarterPercentNumber: 898,
      pastYearPercentNumber: 3435,
      oneYearTrends: [
        202434, 204957,
        211090, 212428,
        214998, 214998,
        237458, 247593,
        247593, 249559,
        245014, 244073,
      ],
      oneDecadeTrends: [
        101750, 99350,
        115500, 120180,
        143020, 156779,
        164341, 168533,
        200210,
      ],
    })
  })
})
