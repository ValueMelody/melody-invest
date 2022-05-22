import * as interfaces from '@shared/interfaces'
import * as trader from './trader'

describe('#presentTraderProfile', () => {
  // @ts-ignore
  const trader1: interfaces.traderModel.Record = {
    id: 1,
    traderEnvId: 1,
    traderPatternId: 1,
    accessCode: '123',
  }
  // @ts-ignore
  const trader2: interfaces.traderModel.Record = {
    id: 2,
    traderEnvId: 1,
    traderPatternId: 2,
    accessCode: '123',
    isActive: true,
  }
  const traderPatterns: interfaces.traderPatternModel.Public[] = [
    // @ts-ignore
    { id: 1 }, { id: 2 }, { id: 3 },
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
      // @ts-ignore
      { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 },
    ]
    expect(trader.groupTraderCouples(traders)).toStrictEqual([
      [{ id: 1 }, { id: 2 }],
      [{ id: 3 }, { id: 4 }],
      [{ id: 5 }, { id: 6 }],
      [{ id: 7 }],
    ])
  })
})
