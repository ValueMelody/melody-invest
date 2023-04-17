exports.up = (knex) => {
  return knex.schema
    .createTable('user', (table) => {
      table.increments('id')
      table.timestamp('createdAt').defaultTo(knex.raw('now()')).notNullable()
      table.timestamp('updatedAt').defaultTo(knex.raw('now()')).notNullable()
      table.timestamp('deletedAt')
      table.timestamp('activationSentAt')
      table.specificType('activationCode', 'CHAR(64)')
      table.timestamp('resetSentAt')
      table.specificType('resetCode', 'CHAR(64)')
      table.string('email', 100).notNullable()
      table.specificType('password', 'CHAR(64)').notNullable()
      table.smallint('type').notNullable()
      table.unique('email', 'user_ukey')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('user')
}
