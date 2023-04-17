exports.up = (knex) => {
  return knex.schema
    .createTable('indicator_monthly', (table) => {
      table.increments('id')
      table.specificType('month', 'CHAR(7)').notNullable()
      table.string('fundsRate', 5)
      table.string('thirtyYearsTreasury', 5)
      table.string('tenYearsTreasury', 5)
      table.string('cpi', 10)
      table.string('inflationExpectation', 5)
      table.string('consumerSentiment', 5)
      table.string('retailSales', 10)
      table.string('durableGoods', 10)
      table.string('unemploymentRate', 5)
      table.string('nonfarmPayroll', 10)
      table.smallint('fundsRateMonthlyIncrease')
      table.smallint('fundsRateMonthlyDecrease')
      table.smallint('thirtyYearsTreasuryMonthlyIncrease')
      table.smallint('thirtyYearsTreasuryMonthlyDecrease')
      table.smallint('tenYearsTreasuryMonthlyIncrease')
      table.smallint('tenYearsTreasuryMonthlyDecrease')
      table.smallint('inflationMonthlyIncrease')
      table.smallint('inflationMonthlyDecrease')
      table.smallint('cpiMonthlyIncrease')
      table.smallint('cpiMonthlyDecrease')
      table.smallint('consumerSentimentMonthlyIncrease')
      table.smallint('consumerSentimentMonthlyDecrease')
      table.smallint('retailSalesMonthlyIncrease')
      table.smallint('retailSalesMonthlyDecrease')
      table.smallint('durableGoodsMonthlyIncrease')
      table.smallint('durableGoodsMonthlyDecrease')
      table.smallint('unemploymentRateMonthlyIncrease')
      table.smallint('unemploymentRateMonthlyDecrease')
      table.smallint('nonfarmPayrollMonthlyIncrease')
      table.smallint('nonfarmPayrollMonthlyDecrease')

      table.unique('month', 'indicator_monthly_ukey')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('indicator_monthly')
}
