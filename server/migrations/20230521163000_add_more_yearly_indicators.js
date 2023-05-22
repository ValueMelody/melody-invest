exports.up = (knex) => {
  return knex.schema
    .table('indicator_yearly', (table) => {
      table.smallint('gdpYearlyIncrease')
      table.smallint('gdpYearlyDecrease')
    })
    .table('indicator_quarterly', (table) => {
      table.smallint('seasonalGDPQuarterlyIncrease')
      table.smallint('seasonalGDPQuarterlyDecrease')
    })
}

exports.down = (knex) => {
  return knex.schema
    .table('indicator_yearly', (table) => {
      table.dropColumn('gdpYearlyIncrease')
      table.dropColumn('gdpYearlyDecrease')
    })
    .table('indicator_quarterly', (table) => {
      table.dropColumn('seasonalGDPQuarterlyIncrease')
      table.dropColumn('seasonalGDPQuarterlyDecrease')
    })
}
