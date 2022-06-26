import { renderHook } from 'test.utils'
import useTraderState from './useTraderState'

const store = {
  traderCombos: {
    1: 'This is combo 1',
    2: 'This is combo 2',
  },
  traderEnvs: {
    1: 'This is env 1',
    2: 'This is env 2',
  },
  traderBehaviors: {
    '1-1': 'This is env 1, behavior 1',
    '1-2': 'This is env 1, behavior 2',
    '2-1': 'This is env 2, behavior 1',
  },
  traderTickers: {
    '1-1': 'This is env 1, ticker 1',
    '1-2': 'This is env 1, ticker 2',
    '2-1': 'This is env 2, ticker 1',
  },
  traderProfiles: {
    1: 'This is profile 1',
    2: 'This is profile 2',
  },
}

describe('#trader combos', () => {
  test('could getTraderCombos', () => {
    const { result } = renderHook(
      useTraderState,
      { store },
    )
    expect(result.current.getTraderCombos()).toStrictEqual([
      store.traderCombos[1],
      store.traderCombos[2],
    ])
  })

  test('could getTraderCombo', () => {
    const { result } = renderHook(
      useTraderState,
      { store },
    )
    expect(result.current.getTraderCombo(1)).toStrictEqual(store.traderCombos[1])
    expect(result.current.getTraderCombo(2)).toStrictEqual(store.traderCombos[2])
    expect(result.current.getTraderCombo(3)).toBe(null)
    expect(result.current.getTraderCombo(null)).toBe(null)
  })
})

describe('#trader envs', () => {
  test('could getTraderEnvs', () => {
    const { result } = renderHook(
      useTraderState,
      { store },
    )
    expect(result.current.getTraderEnvs()).toStrictEqual([
      store.traderEnvs[1],
      store.traderEnvs[2],
    ])
  })

  test('could getTraderEnv', () => {
    const { result } = renderHook(
      useTraderState,
      { store },
    )
    expect(result.current.getTraderEnv(1)).toStrictEqual(store.traderEnvs[1])
    expect(result.current.getTraderEnv(2)).toStrictEqual(store.traderEnvs[2])
    expect(result.current.getTraderEnv(3)).toBe(null)
    expect(result.current.getTraderEnv(null)).toBe(null)
  })
})

describe('#getTraderBehavior', () => {
  test('could getTraderBehavior', () => {
    const { result } = renderHook(
      useTraderState,
      { store },
    )
    expect(result.current.getTraderBehavior(1, '1')).toStrictEqual(store.traderBehaviors['1-1'])
    expect(result.current.getTraderBehavior(1, '2')).toStrictEqual(store.traderBehaviors['1-2'])
    expect(result.current.getTraderBehavior(2, '1')).toStrictEqual(store.traderBehaviors['2-1'])
    expect(result.current.getTraderBehavior(3, '1')).toBe(null)
    expect(result.current.getTraderBehavior(2, '2')).toBe(null)
    expect(result.current.getTraderBehavior(null, '1')).toBe(null)
    expect(result.current.getTraderBehavior(1, null)).toBe(null)
  })
})

describe('#getTraderTicker', () => {
  test('could getTraderTicker', () => {
    const { result } = renderHook(
      useTraderState,
      { store },
    )
    expect(result.current.getTraderTicker(1, 1)).toStrictEqual(store.traderTickers['1-1'])
    expect(result.current.getTraderTicker(1, 2)).toStrictEqual(store.traderTickers['1-2'])
    expect(result.current.getTraderTicker(2, 1)).toStrictEqual(store.traderTickers['2-1'])
    expect(result.current.getTraderTicker(3, 1)).toBe(null)
    expect(result.current.getTraderTicker(2, 2)).toBe(null)
    expect(result.current.getTraderTicker(null, 1)).toBe(null)
    expect(result.current.getTraderTicker(1, null)).toBe(null)
  })
})

describe('#getTraderProfile', () => {
  test('could getTraderProfile', () => {
    const { result } = renderHook(
      useTraderState,
      { store },
    )
    expect(result.current.getTraderProfile(1)).toStrictEqual(store.traderProfiles[1])
    expect(result.current.getTraderProfile(2)).toStrictEqual(store.traderProfiles[2])
    expect(result.current.getTraderProfile(3)).toBe(null)
    expect(result.current.getTraderProfile(null)).toBe(null)
  })
})
