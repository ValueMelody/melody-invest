exports.up = (knex) => {
  return knex.schema
    .table('ticker', (table) => {
      table.specificType('firstFinancialYear', 'CHAR(4)')
      table.specificType('lastFinancialYear', 'CHAR(4)')
      table.specificType('firstFinancialQuarter', 'CHAR(7)')
      table.specificType('lastFinancialQuarter', 'CHAR(7)')
      table.dropColumn('firstEPSYear')
      table.dropColumn('lastEPSYear')
      table.dropColumn('firstEPSQuarter')
      table.dropColumn('lastEPSQuarter')
      table.dropColumn('firstIncomeYear')
      table.dropColumn('lastIncomeYear')
      table.dropColumn('firstIncomeQuarter')
      table.dropColumn('lastIncomeQuarter')
    })
    .table('ticker_quarterly', (table) => {
      table.string('equity', 20)
      table.string('totalAssets', 20)
      table.string('totalLiabilities', 20)
      table.string('freeCashFlow', 20)
      table.string('grossMargin', 20)
      table.string('debtEquity', 20)
      table.string('roa', 20)
      table.string('roe', 20)
      table.string('outstandingShares', 20)
      table.string('epsQoQ', 5)
      table.string('revenueQoQ', 5)
      table.dropColumn('earningReportDate')
      table.dropColumn('estimatedEPS')
      table.dropColumn('epsSurprisePercent')
      table.dropColumn('epsQuarterlyBeat')
      table.dropColumn('epsQuarterlyMiss')
    })
    .table('ticker_yearly', (table) => {
      table.specificType('year', 'CHAR(7)').alter()
      table.string('totalLiabilities', 20)
      table.string('totalAssets', 20)
      table.string('equity', 20)
      table.string('outstandingShares', 20)
      table.string('freeCashFlow', 20)
    })
}

exports.down = (knex) => {
  return knex.schema
    .table('ticker', (table) => {
      table.dropColumn('firstFinancialYear')
      table.dropColumn('lastFinancialYear')
      table.dropColumn('firstFinancialQuarter')
      table.dropColumn('lastFinancialQuarter')
      table.specificType('firstEPSYear', 'CHAR(4)')
      table.specificType('lastEPSYear', 'CHAR(4)')
      table.specificType('firstEPSQuarter', 'CHAR(7)')
      table.specificType('lastEPSQuarter', 'CHAR(7)')
      table.specificType('firstIncomeYear', 'CHAR(4)')
      table.specificType('lastIncomeYear', 'CHAR(4)')
      table.specificType('firstIncomeQuarter', 'CHAR(7)')
      table.specificType('lastIncomeQuarter', 'CHAR(7)')
    })
    .table('ticker_quarterly', (table) => {
      table.specificType('earningReportDate', 'CHAR(10)')
      table.dropColumn('equity')
      table.dropColumn('totalAssets')
      table.dropColumn('totalLiabilities')
      table.dropColumn('freeCashFlow')
      table.dropColumn('grossMargin')
      table.dropColumn('debtEquity')
      table.dropColumn('roa')
      table.dropColumn('roe')
      table.dropColumn('epsQoQ')
      table.dropColumn('revenueQoQ')
      table.dropColumn('outstandingShares')
      table.string('estimatedEPS', 10)
      table.string('epsSurprisePercent', 5)
      table.smallint('epsQuarterlyBeat')
      table.smallint('epsQuarterlyMiss')
    })
    .table('ticker_yearly', (table) => {
      table.specificType('year', 'CHAR(4)').alter()
      table.dropColumn('totalLiabilities')
      table.dropColumn('totalAssets')
      table.dropColumn('equity')
      table.dropColumn('freeCashFlow')
      table.dropColumn('outstandingShares')
    })
}