exports.up = (knex) => {
  return knex.schema
    .createTable('trader_combo', (table) => {
      table.increments('id')
      table.integer('entityId').notNullable()
      table.foreign('entityId').references('id').inTable('entity')
      table.text('traderIds').notNullable()
      table.unique(['entityId', 'traderIds'], 'trader_combo_ukey')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('trader_combo')
}
