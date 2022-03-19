exports.up = (knex) => {
  return knex.schema
    .createTable('ticker_quarterly', (table) => {
      table.increments('id')
      table.integer('tickerId').notNullable()
      table.specificType('quarter', 'CHAR(7)').notNullable()
      table.specificType('earningDate', 'CHAR(10)')
      table.specificType('earningReportDate', 'CHAR(10)')
      table.string('eps', 10)
      table.string('estimatedEPS', 10)
      table.string('epsSurprisePercent', 5)
      table.string('ebitda', 20)
      table.string('netIncome', 20)
      table.string('grossProfit', 20)
      table.string('totalRevenue', 20)
      table.string('costOfRevenue', 20)
      table.smallint('epsQuarterlyBeat')
      table.smallint('epsQuarterlyMiss')
      table.smallint('profitQuarterlyIncrease')
      table.smallint('profitQuarterlyDecrease')
      table.smallint('revenueQuarterlyIncrease')
      table.smallint('revenueQuarterlyDecrease')
      table.smallint('incomeQuarterlyIncrease')
      table.smallint('incomeQuarterlyDecrease')
      table.unique(['tickerId', 'quarter'], 'ticker_quarterly_ukey')
      table.foreign('tickerId').references('id').inTable('ticker')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('ticker_quarterly')
}
