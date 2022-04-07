exports.up = (knex) => {
  return knex.schema
    .createTable('trader_combo', (table) => {
      table.increments('id')
      table.integer('traderEnvId').notNullable()
      table.text('traderIds').notNullable()
      table.unique('traderIds', 'trader_combo_ukey')
      table.foreign('traderEnvId').references('id').inTable('trader_env')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('trader_combo')
}
