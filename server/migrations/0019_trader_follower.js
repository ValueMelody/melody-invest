exports.up = (knex) => {
  return knex.schema
    .createTable('trader_follower', (table) => {
      table.integer('userId').notNullable()
      table.integer('traderId').notNullable()
      table.unique(['userId', 'traderId'], 'trader_follower_ukey')
      table.foreign('userId').references('id').inTable('user')
      table.foreign('traderId').references('id').inTable('trader')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('trader_follower')
}
