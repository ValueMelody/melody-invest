exports.up = (knex) => {
  return knex.schema
    .table('ticker_yearly', (table) => {
      table.renameColumn('peRatio', 'annualPeRatio')
      table.renameColumn('pbRatio', 'annualPbRatio')
      table.renameColumn('psRatio', 'annualPsRatio')
    })
}

exports.down = (knex) => {
  return knex.schema
    .table('ticker_yearly', (table) => {
      table.renameColumn('annualPeRatio', 'peRatio')
      table.renameColumn('annualPbRatio', 'pbRatio')
      table.renameColumn('annualPsRatio', 'psRatio')
    })
}
