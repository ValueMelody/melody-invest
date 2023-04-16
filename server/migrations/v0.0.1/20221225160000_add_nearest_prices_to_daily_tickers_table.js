exports.up = (knex) => {
  return knex.schema
    .table('daily_tickers', (table) => {
      table.jsonb('nearestPrices').defaultTo({}).notNullable()
    })
    .alterTable('daily_tickers', (table) => {
      table.jsonb('tickers').nullable().alter()
    })
}

exports.down = (knex) => {
  return knex.schema
    .table('daily_tickers', (table) => {
      table.dropColumn('nearestPrices')
    })
    .alterTable('daily_tickers', (table) => {
      table.jsonb('tickers').notNullable().alter()
    })
}
