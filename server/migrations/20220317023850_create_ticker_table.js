exports.up = (knex) => {
  return knex.schema
    .createTable('ticker', (table) => {
      table.increments('id')
      table.string('name', 50).notNullable()
      table.string('symbol', 10).notNullable()
      table.specificType('region', 'CHAR(2)').notNullable()
      table.specificType('firstPriceDate', 'CHAR(10)')
      table.specificType('lastPriceDate', 'CHAR(10)')
      table.specificType('firstEPSYear', 'CHAR(4)')
      table.specificType('lastEPSYear', 'CHAR(4)')
      table.specificType('firstEPSQuarter', 'CHAR(7)')
      table.specificType('lastEPSQuarter', 'CHAR(7)')
      table.specificType('firstIncomeYear', 'CHAR(4)')
      table.specificType('lastIncomeYear', 'CHAR(4)')
      table.specificType('firstIncomeQuarter', 'CHAR(7)')
      table.specificType('lastIncomeQuarter', 'CHAR(7)')
      table.specificType('quarterlyEPSMonthDiffer', 'INT2')
      table.unique(['symbol', 'region'], 'ticker_ukey')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('ticker')
}
