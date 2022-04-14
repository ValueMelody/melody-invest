exports.up = (knex) => {
  return knex.schema
    .table('ticker', (table) => {
      table.integer('tickerCategoryId')
      table.foreign('tickerCategoryId').references('id').inTable('ticker_category')
    })
}

exports.down = (knex) => {
  return knex.schema.table('ticker', (table) => {
    table.dropColumn('tickerCategoryId')
  })
}
