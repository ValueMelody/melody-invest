exports.up = (knex) => {
  return knex.schema
    .createTable('user_subscription', (table) => {
      table.increments('id')
      table.integer('userId').notNullable()
      table.string('subscriptionId', 20).notNullable()
      table.smallint('status').notNullable()
      table.specificType('startAtUTC', 'CHAR(20)').notNullable()
      table.specificType('endAtUTC', 'CHAR(20)')
      table.unique('subscriptionId', 'user_subscription_ukey')
      table.foreign('userId').references('id').inTable('user')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('user_subscription')
}
