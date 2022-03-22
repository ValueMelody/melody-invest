exports.up = (knex) => {
  return knex.schema
    .createTable('trader_holding', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.specificType('date', 'CHAR(10)').notNullable()
      table.integer('traderId').notNullable()
      table.string('totalValue', 15).notNullable()
      table.string('totalCash', 15).notNullable()
      table.jsonb('holdings').notNullable()
      table.unique(['date', 'traderId'], 'trader_holding_ukey')
      table.foreign('traderId').references('id').inTable('trader')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('trader_holding')
}
