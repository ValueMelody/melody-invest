exports.up = (knex) => {
  return knex.schema
    .createTable('daily_indicators', (table) => {
      table.increments('id')
      table.specificType('date', 'CHAR(10)').notNullable()
      table.jsonb('indicatorInfo').notNullable()
      table.unique('date', 'daily_indicators_ukey')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('daily_indicators')
}