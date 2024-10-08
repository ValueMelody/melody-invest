exports.up = (knex) => {
  return knex.schema
    .createTable('indicator_yearly', (table) => {
      table.increments('id')
      table.specificType('year', 'CHAR(7)').notNullable()
      table.string('gdp', 12)
      table.string('gdpYearlyChangePercent', 5)
      table.string('annualInflation', 5)
      table.smallint('inflationYearlyIncrease')
      table.smallint('inflationYearlyDecrease')
      table.smallint('gdpYearlyIncrease')
      table.smallint('gdpYearlyDecrease')
      table.unique('year', 'indicator_yearly_ukey')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('indicator_yearly')
}
