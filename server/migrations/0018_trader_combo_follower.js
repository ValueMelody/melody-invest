exports.up = (knex) => {
  return knex.schema
    .createTable('trader_combo_follower', (table) => {
      table.integer('userId').notNullable()
      table.integer('traderComboId').notNullable()
      table.string('name', 50).notNullable()
      table.unique(['userId', 'traderComboId'], 'trader_combo_follower_ukey')
      table.foreign('userId').references('id').inTable('user')
      table.foreign('traderComboId').references('id').inTable('trader_combo')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('trader_combo_follower')
}
