exports.up = (knex) => {
  return knex.schema
    .createTable('trader_env', (table) => {
      table.increments('id')
      table.specificType('startDate', 'CHAR(10)')
      table.text('tickerIds')
      table.integer('activeTotal').notNullable()
      table.unique(['startDate', 'tickerIds'], 'trader_env_ukey')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('trader_env')
}
