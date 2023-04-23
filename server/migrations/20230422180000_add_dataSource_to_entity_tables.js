exports.up = (knex) => {
  return knex.schema
    .table('entity', (table) => {
      table.string('dataSource', 20)
      table.text('dataKey').alter()
    })
}

exports.down = (knex) => {
  return knex.schema
    .table('ticker', (table) => {
      table.dropColumn('dataSource')
      table.string('dataKey', 20).alter()
    })
}
