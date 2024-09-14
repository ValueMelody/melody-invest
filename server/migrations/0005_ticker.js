exports.up = (knex) => {
  return knex.schema
    .createTable('ticker', (table) => {
      table.increments('id')
      table.integer('entityId').notNullable()
      table.foreign('entityId').references('id').inTable('entity')
      table.string('symbol', 10).notNullable()
      table.boolean('isDelisted').defaultTo(false).notNullable()
      table.specificType('region', 'CHAR(2)').notNullable()
      table.specificType('firstPriceDate', 'CHAR(10)')
      table.specificType('lastPriceDate', 'CHAR(10)')
      table.specificType('firstFinancialYear', 'CHAR(7)')
      table.specificType('lastFinancialYear', 'CHAR(7)')
      table.specificType('firstFinancialQuarter', 'CHAR(7)')
      table.specificType('lastFinancialQuarter', 'CHAR(7)')
      table.unique(['entityId', 'symbol', 'region'], 'ticker_ukey')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('ticker')
}
