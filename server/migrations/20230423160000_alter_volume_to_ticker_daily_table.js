exports.up = (knex) => {
  return knex.schema
    .table('ticker_daily', (table) => {
      table.integer('volume').alter()
      table.dropColumn('dividendAmount')
    })
}

exports.down = (knex) => {
  return knex.schema
    .table('ticker_daily', (table) => {
      table.string('volume', 20).alter()
      table.string('dividendAmount', 10).notNullable()
    })
}
