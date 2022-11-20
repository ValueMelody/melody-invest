import * as interfaces from '@shared/interfaces'
import * as trader from './trader'
import { instance, mock } from 'ts-mockito'

const traderMock: interfaces.traderModel.Record = mock({})
const traderInstance = instance(traderMock)
const traderPatternMock: interfaces.traderPatternModel.Public = mock({})

describe('#presentTraderProfile', () => {
  const trader1: interfaces.traderModel.Record = {
    ...traderMock,
    id: 1,
    traderEnvId: 1,
    traderPatternId: 1,
    accessCode: '123',
  }
  const trader2: interfaces.traderModel.Record = {
    ...traderMock,
    id: 2,
    traderEnvId: 1,
    traderPatternId: 2,
    accessCode: '123',
    isActive: true,
  }
  const traderPatterns: interfaces.traderPatternModel.Public[] = [
    { ...traderPatternMock, id: 1 }, { ...traderPatternMock, id: 2 }, { ...traderPatternMock, id: 3 },
  ]
  test('could present traderProfile', () => {
    expect(trader.presentTraderProfile(trader1, traderPatterns)).toStrictEqual({
      trader: trader1,
      pattern: traderPatterns[0],
    })
    expect(trader.presentTraderProfile(trader2, traderPatterns)).toStrictEqual({
      trader: trader2,
      pattern: traderPatterns[1],
    })
  })
})

describe('#groupTraderCouples', () => {
  test('could group trader couples', () => {
    const traders: interfaces.traderModel.Record[] = [
      { ...traderInstance, id: 1 },
      { ...traderInstance, id: 2 },
      { ...traderInstance, id: 3 },
      { ...traderInstance, id: 4 },
      { ...traderInstance, id: 5 },
      { ...traderInstance, id: 6 },
      { ...traderInstance, id: 7 },
    ]
    expect(trader.groupTraderCouples(traders)).toStrictEqual([
      [{ id: 1 }, { id: 2 }],
      [{ id: 3 }, { id: 4 }],
      [{ id: 5 }, { id: 6 }],
      [{ id: 7 }],
    ])
  })
})
