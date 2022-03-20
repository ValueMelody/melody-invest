exports.up = (knex) => {
  return knex.schema
    .createTable('indicator_quarterly', (table) => {
      table.increments('id')
      table.specificType('quarter', 'CHAR(7)').notNullable()
      table.specificType('reportMonth', 'CHAR(7)')
      table.string('realGDP', 12)
      table.specificType('gdpQuarterlyChangePercent', 'CHAR(5)')
      table.specificType('gdpQuarterlyYoYChangePercent', 'CHAR(5)')
      table.unique('quarter', 'indicator_quarterly_ukey')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('indicator_quarterly')
}
