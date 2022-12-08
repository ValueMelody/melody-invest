exports.up = (knex) => {
  return knex.schema
    .table('trader', (table) => {
      table.integer('fatherId')
      table.integer('motherId')
      table.boolean('hasMutation').defaultTo(false).notNullable()
      table.foreign('fatherId').references('id').inTable('trader')
      table.foreign('motherId').references('id').inTable('trader')
    })
}

exports.down = (knex) => {
  return knex.schema.table('ticker', (table) => {
    table.dropColumn('fatherId')
    table.dropColumn('motherId')
    table.dropColumn('hasMutation')
  })
}
