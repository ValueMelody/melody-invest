exports.up = (knex) => {
  return knex.schema
    .createTable('trader_combo', (table) => {
      table.increments('id')
      table.text('traderIds').notNullable()
      table.unique('traderIds', 'trader_combo_ukey')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('trader_combo')
}
