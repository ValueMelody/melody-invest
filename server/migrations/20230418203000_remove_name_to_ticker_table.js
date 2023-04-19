exports.up = (knex) => {
  return knex.schema
    .table('ticker', (table) => {
      table.dropColumn('name')
    })
}

exports.down = (knex) => {
  return knex.schema
    .table('ticker', (table) => {
      table.string('name', 50)
    })
}
