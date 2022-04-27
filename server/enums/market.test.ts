import * as market from './market'

describe('#Type', () => {
  test('Have defined market data type', () => {
    expect(market.Type.Prices).toBeDefined()
    expect(market.Type.Earnings).toBeDefined()
    expect(market.Type.Incomes).toBeDefined()
    expect(market.Type.GDP).toBeDefined()
    expect(market.Type.FundsRate).toBeDefined()
    expect(market.Type.TreasuryYield).toBeDefined()
    expect(market.Type.CPI).toBeDefined()
    expect(market.Type.Inflation).toBeDefined()
    expect(market.Type.InflationExpectation).toBeDefined()
    expect(market.Type.ConsumerSentiment).toBeDefined()
    expect(market.Type.RetailSales).toBeDefined()
    expect(market.Type.DurableGoods).toBeDefined()
    expect(market.Type.UnemploymentRate).toBeDefined()
    expect(market.Type.NonfarmPayroll).toBeDefined()
  })
})

describe('GDPInterval', () => {
  test('Have defined GDPInterval', () => {
    expect(market.GDPInterval.Yearly).toBeDefined()
    expect(market.GDPInterval.Quarterly).toBeDefined()
  })
})

describe('#TreasuryType', () => {
  test('Have defined TreasuryType', () => {
    expect(market.TreasuryType.TenYears).toBeDefined()
    expect(market.TreasuryType.ThirtyYears).toBeDefined()
  })
})
