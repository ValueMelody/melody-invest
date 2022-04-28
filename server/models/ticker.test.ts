import * as ticker from './ticker'

describe('#getAll', () => {
  test('could get all', async () => {
    const tickers = await ticker.getAll()
    expect(tickers.length).toBe(0)
  })
})
