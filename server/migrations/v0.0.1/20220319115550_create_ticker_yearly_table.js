exports.up = (knex) => {
  return knex.schema
    .createTable('ticker_yearly', (table) => {
      table.increments('id')
      table.integer('tickerId').notNullable()
      table.specificType('year', 'CHAR(4)').notNullable()
      table.specificType('earningDate', 'CHAR(10)')
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
      table.unique(['tickerId', 'year'], 'ticker_yearly_ukey')
      table.foreign('tickerId').references('id').inTable('ticker')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('ticker_yearly')
}
