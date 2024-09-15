exports.up = (knex) => {
  return knex.schema
    .createTable('ticker_yearly', (table) => {
      table.increments('id')
      table.integer('tickerId').notNullable()
      table.specificType('year', 'CHAR(7)')
      table.specificType('earningDate', 'CHAR(10)')
      table.string('totalLiabilities', 20)
      table.string('totalAssets', 20)
      table.string('equity', 20)
      table.string('outstandingShares', 20)
      table.string('freeCashFlow', 20)
      table.string('eps', 10)
      table.string('ebitda', 20)
      table.string('netIncome', 20)
      table.string('grossProfit', 20)
      table.string('totalRevenue', 20)
      table.string('costOfRevenue', 20)
      table.smallint('profitYearlyIncrease')
      table.smallint('profitYearlyDecrease')
      table.smallint('revenueYearlyIncrease')
      table.smallint('revenueYearlyDecrease')
      table.smallint('incomeYearlyIncrease')
      table.smallint('incomeYearlyDecrease')
      table.string('peRatio', 5)
      table.string('pbRatio', 5)
      table.string('psRatio', 5)
      table.string('bookValue', 20)
      table.smallint('peYearlyIncrease')
      table.smallint('peYearlyDecrease')
      table.smallint('pbYearlyIncrease')
      table.smallint('pbYearlyDecrease')
      table.smallint('psYearlyIncrease')
      table.smallint('psYearlyDecrease')
      table.smallint('epsYearlyIncrease')
      table.smallint('epsYearlyDecrease')
      table.smallint('ebitdaYearlyIncrease')
      table.smallint('ebitdaYearlyDecrease')
      table.smallint('bookValueYearlyIncrease')
      table.smallint('bookValueYearlyDecrease')
      table.smallint('equityYearlyIncrease')
      table.smallint('equityYearlyDecrease')
      table.smallint('freeCashFlowYearlyIncrease')
      table.smallint('freeCashFlowYearlyDecrease')
      table.unique(['tickerId', 'year'], 'ticker_yearly_ukey')
      table.foreign('tickerId').references('id').inTable('ticker')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('ticker_yearly')
}