exports.up = (knex) => {
  return knex.schema
    .createTable('daily_tickers', (table) => {
      table.increments('id')
      table.specificType('date', 'CHAR(10)').notNullable()
      table.jsonb('tickers').notNullable()
      table.unique('date', 'daily_tickers_ukey')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('daily_tickers')
}
