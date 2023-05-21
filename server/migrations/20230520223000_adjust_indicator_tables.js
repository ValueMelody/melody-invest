exports.up = (knex) => {
  return knex.schema
    .table('indicator_quarterly', (table) => {
      table.dropColumn('reportMonth')
      table.dropColumn('gdpQuarterlyChangePercent')
      table.dropColumn('gdpQuarterlyYoYChangePercent')
      table.string('gdpQuarterlyQoQ', 7)
      table.string('gdpQuarterlyYoY', 7)
    })
    .table('indicator_yearly', (table) => {
      table.dropColumn('realGDP')
      table.string('gdp', 12)
    })
}

exports.down = (knex) => {
  return knex.schema
    .table('indicator_quarterly', (table) => {
      table.specificType('reportMonth', 'CHAR(7)')
      table.specificType('gdpQuarterlyChangePercent', 'CHAR(5)')
      table.specificType('gdpQuarterlyYoYChangePercent', 'CHAR(5)')
      table.dropColumn('gdpQuarterlyQoQ')
      table.dropColumn('gdpQuarterlyYoY')
    })
    .table('indicator_yearly', (table) => {
      table.dropColumn('gdp')
      table.string('realGDP', 12)
    })
}
