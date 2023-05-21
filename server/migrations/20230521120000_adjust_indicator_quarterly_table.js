exports.up = (knex) => {
  return knex.schema
    .table('indicator_quarterly', (table) => {
      table.dropColumn('realGDP')
      table.dropColumn('gdpQuarterlyQoQ')
      table.dropColumn('gdpQuarterlyYoY')
      table.string('seasonalGDP', 12)
      table.string('seasonalGDPQoQ', 7)
      table.string('seasonalGDPYoY', 7)
    })
}

exports.down = (knex) => {
  return knex.schema
    .table('indicator_quarterly', (table) => {
      table.dropColumn('seasonalGDP')
      table.dropColumn('seasonalGDPQoQ')
      table.dropColumn('seasonalGDPYoY')
      table.string('realGDP', 12)
      table.string('gdpQuarterlyQoQ', 7)
      table.string('gdpQuarterlyYoY', 7)
    })
}
