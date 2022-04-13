exports.up = (knex) => {
  return knex.schema
    .createTable('ticker_category', (table) => {
      table.increments('id')
      table.string('name', 20).notNullable()
      table.string('desc', 50).notNullable()
      table.unique('name', 'ticker_category_ukey')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('ticker_category')
}
