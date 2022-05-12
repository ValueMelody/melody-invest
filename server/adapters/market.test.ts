import * as market from './market'

describe('#getEnv', () => {
  test('could get env', () => {
    expect(market.getEnv()).toStrictEqual({
      key: 'demo',
      cooldownSeconds: 5,
      baseUrl: 'https://www.alphavantage.co/query',
    })
  })
})

describe('#getCooldownPerMin', () => {
  test('could get cooldown per min', () => {
    expect(market.getCooldownPerMin()).toBe(5)
  })
})

describe('#getFunctions', () => {
  test('have defined query functions', () => {
    expect(market.getTickerPrices).toBeDefined()
    expect(market.getTickerEarnings).toBeDefined()
    expect(market.getTickerIncomes).toBeDefined()
    expect(market.getRealGDP).toBeDefined()
    expect(market.getFundsRate).toBeDefined()
    expect(market.getCPI).toBeDefined()
    expect(market.getTreasuryYield).toBeDefined()
    expect(market.getInflation).toBeDefined()
    expect(market.getInflationExpectation).toBeDefined()
    expect(market.getConsumerSentiment).toBeDefined()
    expect(market.getRetailSales).toBeDefined()
    expect(market.getDurableGoods).toBeDefined()
    expect(market.getUnemploymentRate).toBeDefined()
    expect(market.getNonfarmPayroll).toBeDefined()
  })
})
