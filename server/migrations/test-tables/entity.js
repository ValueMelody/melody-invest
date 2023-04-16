exports.up = (knex) => {
  return knex.schema
    .createTable('entity', (table) => {
      table.increments('id')
      table.string('dataKey', 20)
      table.boolean('isValidKey')
    })
}

exports.down = (knex) => {
  return knex.schema
    .dropTable('entity')
}
