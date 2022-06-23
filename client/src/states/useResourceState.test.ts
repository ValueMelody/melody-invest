import { renderHook } from 'test.utils'
import useResourceState from './useResourceState'

const store = {
  resources: {
    privacyPolicy: 'this is privacy policy',
    termsPolicy: 'this is terms policy',
    tickerIdentities: {
      1: { symbol: 'B' },
      2: { symbol: 'C' },
      3: { symbol: 'A' },
    },
    tickerCategories: {
      1: { id: 1 },
      3: { id: 3 },
      2: { id: 2 },
    },
    overallTopTraderProfiles: 'this is top trader profile ids',
  },
}

describe('#getPolicy', () => {
  test('could getPolicy', () => {
    const { result } = renderHook(
      useResourceState,
      { wrapperProps: { store } },
    )
    expect(result.current.getPolicy()).toStrictEqual({
      privacyPolicy: store.resources.privacyPolicy,
      termsPolicy: store.resources.termsPolicy,
    })
  })
})

describe('#tickerIdentity', () => {
  test('could getTickerIdentities', () => {
    const { result } = renderHook(
      useResourceState,
      { wrapperProps: { store } },
    )
    expect(result.current.getTickerIdentities()).toStrictEqual([
      store.resources.tickerIdentities[3],
      store.resources.tickerIdentities[1],
      store.resources.tickerIdentities[2],
    ])
  })

  test('could getTickerIdentity', () => {
    const { result } = renderHook(
      useResourceState,
      { wrapperProps: { store } },
    )
    expect(result.current.getTickerIdentity(1)).toStrictEqual(
      store.resources.tickerIdentities[1],
    )
    expect(result.current.getTickerIdentity(2)).toStrictEqual(
      store.resources.tickerIdentities[2],
    )
    expect(result.current.getTickerIdentity(3)).toStrictEqual(
      store.resources.tickerIdentities[3],
    )
    expect(result.current.getTickerIdentity(4)).toBe(null)
  })
})

describe('#tickerCategory', () => {
  test('could getTickerCategories', () => {
    const { result } = renderHook(
      useResourceState,
      { wrapperProps: { store } },
    )
    expect(result.current.getTickerCategories()).toStrictEqual([
      store.resources.tickerCategories[1],
      store.resources.tickerCategories[2],
      store.resources.tickerCategories[3],
    ])
  })

  test('could getTickerCategory', () => {
    const { result } = renderHook(
      useResourceState,
      { wrapperProps: { store } },
    )
    expect(result.current.getTickerCategory(1)).toStrictEqual(
      store.resources.tickerCategories[1],
    )
    expect(result.current.getTickerCategory(2)).toStrictEqual(
      store.resources.tickerCategories[2],
    )
    expect(result.current.getTickerCategory(3)).toStrictEqual(
      store.resources.tickerCategories[3],
    )
    expect(result.current.getTickerCategory(4)).toBe(null)
  })
})

describe('#getOverallTopTraderProfiles', () => {
  test('could getOverallTopTraderProfiles', () => {
    const { result } = renderHook(
      useResourceState,
      { wrapperProps: { store } },
    )
    expect(result.current.getOverallTopTraderProfiles()).toStrictEqual(
      store.resources.overallTopTraderProfiles,
    )
  })
})
