exports.up = (knex) => {
  return knex.schema
    .createTable('ticker_daily', (table) => {
      table.increments('id')
      table.integer('tickerId').notNullable()
      table.specificType('date', 'CHAR(10)').notNullable()
      table.integer('volumn').notNullable()
      table.integer('closePrice').notNullable()
      table.string('splitMultiplier', 20).notNullable()
      table.string('dividend', 10).notNullable()
      table.integer('weeklyAverageFinalPrice')
      table.integer('monthlyAverageFinalPrice')
      table.integer('quarterlyAverageFinalPrice')
      table.integer('yearlyAverageFinalPrice')
      table.smallint('priceDailyIncrease')
      table.smallint('priceDailyDecrease')
      table.smallint('priceWeeklyIncrease')
      table.smallint('priceWeeklyDecrease')
      table.smallint('priceMonthlyIncrease')
      table.smallint('priceMonthlyDecrease')
      table.smallint('priceQuarterlyIncrease')
      table.smallint('priceQuarterlyDecrease')
      table.smallint('priceYearlyIncrease')
      table.smallint('priceYearlyDecrease')
      table.unique(['tickerId', 'date'], 'ticker_daily_ukey')
      table.foreign('tickerId').references('id').inTable('ticker')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('ticker_daily')
}
