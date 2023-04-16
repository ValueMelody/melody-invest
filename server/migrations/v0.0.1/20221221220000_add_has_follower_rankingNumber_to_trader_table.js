exports.up = (knex) => {
  return knex.schema
    .table('trader', (table) => {
      table.integer('rankingNumber')
      table.boolean('hasFollower').defaultTo(false).notNullable()
    })
}

exports.down = (knex) => {
  return knex.schema.table('trader', (table) => {
    table.dropColumn('rankingNumber')
    table.dropColumn('hasFollower')
  })
}
