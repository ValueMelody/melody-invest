exports.up = (knex) => {
  return knex.schema
    .createTable('user_payment', (table) => {
      table.increments('id')
      table.integer('userId').notNullable()
      table.string('orderId', 20).notNullable()
      table.string('price', 6).notNullable()
      table.string('tax', 5).notNullable()
      table.specificType('stateCode', 'CHAR(2)')
      table.specificType('provinceCode', 'CHAR(2)')
      table.specificType('startAtUTC', 'CHAR(20)').notNullable()
      table.specificType('endAtUTC', 'CHAR(20)').notNullable()
      table.unique('orderId', 'user_payment_ukey')
      table.foreign('userId').references('id').inTable('user')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('user_payment')
}
