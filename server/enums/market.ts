export const Type = Object.freeze({
  Prices: 'TIME_SERIES_DAILY_ADJUSTED',
  Earnings: 'EARNINGS',
  Incomes: 'INCOME_STATEMENT',
  GDP: 'REAL_GDP',
  FundsRate: 'FEDERAL_FUNDS_RATE',
  TreasuryYield: 'TREASURY_YIELD',
  CPI: 'CPI',
  Inflation: 'INFLATION',
  InflationExpectation: 'INFLATION_EXPECTATION',
  ConsumerSentiment: 'CONSUMER_SENTIMENT',
  RetailSales: 'RETAIL_SALES',
  DurableGoods: 'DURABLES',
  UnemploymentRate: 'UNEMPLOYMENT',
  NonfarmPayroll: 'NONFARM_PAYROLL',
})

export const GDPInterval = Object.freeze({
  Yearly: 'annual',
  Quarterly: 'quarterly',
})

export const TreasuryType = Object.freeze({
  TenYears: '10year',
  ThirtyYears: '30year',
})
