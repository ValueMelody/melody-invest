exports.up = (knex) => {
  return knex.schema
    .createTable('entity', (table) => {
      table.increments('id')
      table.string('dataKey', 20)
      table.boolean('isValidKey')
    })
    .table('user', (table) => {
      table.integer('entityId').notNullable()
      table.foreign('entityId').references('id').inTable('entity')
    })
}

exports.down = (knex) => {
  return knex.schema
    .table('user', (table) => {
      table.dropColumn('userEntityId')
    })
    .dropTable('entity')
}
