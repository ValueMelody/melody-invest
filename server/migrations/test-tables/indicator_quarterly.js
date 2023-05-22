exports.up = (knex) => {
  return knex.schema
    .createTable('indicator_quarterly', (table) => {
      table.increments('id')
      table.specificType('quarter', 'CHAR(7)').notNullable()
      table.string('seasonalGDP', 12)
      table.string('seasonalGDPQoQ', 7)
      table.string('seasonalGDPYoY', 7)
      table.smallint('seasonalGDPQuarterlyIncrease')
      table.smallint('seasonalGDPQuarterlyDecrease')
      table.unique('quarter', 'indicator_quarterly_ukey')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('indicator_quarterly')
}
