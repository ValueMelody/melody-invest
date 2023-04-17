exports.up = (knex) => {
  return knex.schema
    .createTable('trader_env', (table) => {
      table.increments('id')
      table.integer('entityId').notNullable()
      table.foreign('entityId').references('id').inTable('entity')
      table.specificType('startDate', 'CHAR(10)').notNullable()
      table.text('tickerIds')
      table.integer('activeTotal').notNullable()
      table.string('name', 20)
      table.boolean('isSystem').notNullable()
      table.unique(['entityId', 'startDate', 'tickerIds'], 'trader_env_ukey')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('trader_env')
}
