exports.up = (knex) => {
  return knex.schema
    .createTable('daily_tickers', (table) => {
      table.increments('id')
      table.integer('entityId').notNullable()
      table.foreign('entityId').references('id').inTable('entity')
      table.specificType('date', 'CHAR(10)').notNullable()
      table.jsonb('tickerInfos')
      table.jsonb('priceInfo').notNullable()
      table.unique(['entityId', 'date'], 'daily_tickers_ukey')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('daily_tickers')
}
