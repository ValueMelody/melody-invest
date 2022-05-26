exports.up = (knex) => {
  return knex.schema
    .createTable('ticker_holder', (table) => {
      table.integer('tickerId').notNullable()
      table.integer('traderId').notNullable()
      table.unique(['tickerId', 'traderId'], 'ticker_holder_ukey')
      table.foreign('tickerId').references('id').inTable('ticker')
      table.foreign('traderId').references('id').inTable('trader')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('ticker_holder')
}
