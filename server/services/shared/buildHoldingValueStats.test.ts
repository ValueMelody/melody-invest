import * as interfaces from '@shared/interfaces'
import * as tickerDailyModel from 'models/tickerDaily'
import buildHoldingValueStats from './buildHoldingValueStats'
import getNearestPricesByDateMock from '../../../scripts/mocks/methods/getNearestPricesByDateMock'
import { mock } from 'ts-mockito'

jest
  .spyOn(tickerDailyModel, 'getNearestPricesByDate')
  .mockImplementation(getNearestPricesByDateMock)

const holdingMock: interfaces.traderHoldingModel.Detail = mock({})
const itemMock: interfaces.traderHoldingModel.Item = mock({})

describe('#buildHoldingValueStats', () => {
  test('could build empty stats', async () => {
    const holdings = [
      {
        ...holdingMock,
        date: '2001-02-01',
        totalCash: 100000,
        items: [],
      },
    ]
    const result = await buildHoldingValueStats(
      '1990-01-01',
      '2000-12-31',
      100000,
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
      rankingNumber: null,
      oneYearTrends: [],
      oneDecadeTrends: [],
    })
  })

  test('could build holding value stats', async () => {
    const holdings = [
      {
        ...holdingMock,
        date: '2001-02-01',
        totalCash: 25679,
        items: [
          { ...itemMock, tickerId: 1, shares: 10000 },
          { ...itemMock, tickerId: 2, shares: 2000 },
          { ...itemMock, tickerId: 3, shares: 4000 },
          { ...itemMock, tickerId: 4, shares: 100 },
          { ...itemMock, tickerId: 5, shares: 500 },
        ],
      },
    ]
    const result = await buildHoldingValueStats(
      '2001-01-01',
      '2010-12-31',
      100000,
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
      rankingNumber: 7880,
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
        ...holdingMock,
        date: '2006-01-01',
        totalCash: 17514.4,
        items: [
          { ...itemMock, tickerId: 1, shares: 10030 },
          { ...itemMock, tickerId: 2, shares: 2100 },
          { ...itemMock, tickerId: 3, shares: 3000 },
          { ...itemMock, tickerId: 4, shares: 100 },
          { ...itemMock, tickerId: 5, shares: 1000 },
        ],
      },
      {
        ...holdingMock,
        date: '2001-02-01',
        totalCash: 25679,
        items: [
          { ...itemMock, tickerId: 1, shares: 10000 },
          { ...itemMock, tickerId: 2, shares: 2000 },
          { ...itemMock, tickerId: 3, shares: 4000 },
          { ...itemMock, tickerId: 4, shares: 100 },
          { ...itemMock, tickerId: 5, shares: 500 },
        ],
      },
    ]
    const result = await buildHoldingValueStats(
      '2001-01-01',
      '2010-12-31',
      100000,
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
      rankingNumber: 7982,
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
