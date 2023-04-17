exports.up = (knex) => {
  return knex.schema
    .createTable('policy', (table) => {
      table.increments('id')
      table.integer('type').notNullable()
      table.text('content').notNullable()
      table.timestamp('createdAt').defaultTo(knex.raw('now()')).notNullable()
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('policy')
}
