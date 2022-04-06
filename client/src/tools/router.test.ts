import * as routerTool from './router'

test('get correct url for ticker list route', () => {
  expect(routerTool.tickerListRoute()).toBe('/tickers')
})
