exports.up = (knex) => {
  return knex.schema
    .createTable('email', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.string('sendTo', 100).notNullable()
      table.string('sendBy', 50).notNullable()
      table.text('content').notNullable()
      table.boolean('isActive').notNullable()
      table.smallint('status').notNullable()
      table.timestamp('createdAt').defaultTo(knex.raw('now()')).notNullable()
      table.timestamp('sentAt')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('email')
}
