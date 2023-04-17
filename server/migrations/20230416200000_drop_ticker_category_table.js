exports.up = (knex) => {
  return knex.schema
    .table('ticker', (table) => {
      table.dropColumn('tickerCategoryId')
    })
    .dropTable('ticker_category')
}

exports.down = (knex) => {
  return knex.schema
    .createTable('ticker_category', (table) => {
      table.increments('id')
      table.string('name', 50).notNullable()
      table.string('desc', 50).notNullable()
      table.unique('name', 'ticker_category_ukey')
    })
    .table('ticker', (table) => {
      table.integer('tickerCategoryId')
      table.foreign('tickerCategoryId').references('id').inTable('ticker_category')
    })
}
