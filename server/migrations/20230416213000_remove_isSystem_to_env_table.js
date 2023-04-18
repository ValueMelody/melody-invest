exports.up = (knex) => {
  return knex.schema
    .table('trader_env', (table) => {
      table.dropColumn('isSystem')
      table.dropColumn('name')
    })
}

exports.down = (knex) => {
  return knex.schema
    .table('trader_env', (table) => {
      table.boolean('isSystem').notNullable()
      table.string('name', 20)
    })
}
