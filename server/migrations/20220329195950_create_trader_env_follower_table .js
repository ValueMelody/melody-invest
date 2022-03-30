exports.up = (knex) => {
  return knex.schema
    .createTable('trader_env_follower', (table) => {
      table.integer('userId').notNullable()
      table.integer('traderEnvId').notNullable()
      table.string('name', 50).notNullable()
      table.unique(['userId', 'traderEnvId'], 'trader_env_follower_ukey')
      table.foreign('userId').references('id').inTable('user')
      table.foreign('traderEnvId').references('id').inTable('trader_env')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('trader_env_follower')
}
