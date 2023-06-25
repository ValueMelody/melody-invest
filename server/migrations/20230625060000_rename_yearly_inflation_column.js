exports.up = (knex) => {
  return knex.schema
    .table('indicator_yearly', (table) => {
      table.renameColumn('inflation', 'annualInflation')
    })
}

exports.down = (knex) => {
  return knex.schema
    .table('indicator_yearly', (table) => {
      table.renameColumn('annualInflation', 'inflation')
    })
}
