import { tickerIdentitySlice } from './tickerIdentity'
import { store } from './index'

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
