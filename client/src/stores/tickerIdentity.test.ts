import { store } from './index'
import { tickerIdentitySlice } from './tickerIdentity'

afterEach(() => {
  store.dispatch(tickerIdentitySlice.actions._resetForTest())
})

describe('#store', () => {
  test('get default state', () => {
    expect(store.getState().tickerIdentity).toStrictEqual({
      base: {},
    })
  })
})
