exports.up = (knex) => {
  return knex.schema
    .table('daily_tickers', (table) => {
      table.jsonb('indicators').nullable()
    })
}

exports.down = (knex) => {
  return knex.schema
    .table('daily_tickers', (table) => {
      table.dropColumn('indicators')
    })
}
