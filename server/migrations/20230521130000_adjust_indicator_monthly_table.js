exports.up = (knex) => {
  return knex.schema
    .table('indicator_monthly', (table) => {
      table.renameColumn('inflationExpectation', 'inflation')
      table.dropColumn('retailSales')
      table.dropColumn('durableGoods')
    })
}

exports.down = (knex) => {
  return knex.schema
    .table('indicator_monthly', (table) => {
      table.renameColumn('inflation', 'inflationExpectation')
    })
}
