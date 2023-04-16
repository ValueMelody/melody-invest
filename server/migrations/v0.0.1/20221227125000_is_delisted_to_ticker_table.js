exports.up = (knex) => {
  return knex.schema
    .table('ticker', (table) => {
      table.boolean('isDelisted').defaultTo(false).notNullable()
    })
}

exports.down = (knex) => {
  return knex.schema.table('ticker', (table) => {
    table.dropColumn('isDelisted')
  })
}
