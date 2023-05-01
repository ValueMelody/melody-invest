exports.up = (knex) => {
  return knex.schema
    .table('ticker', (table) => {
      table.specificType('firstFinancialYear', 'CHAR(7)').alter()
      table.specificType('lastFinancialYear', 'CHAR(7)').alter()
    })
}

exports.down = (knex) => {
  return knex.schema
    .table('ticker', (table) => {
      table.specificType('firstFinancialYear', 'CHAR(4)').alter()
      table.specificType('lastFinancialYear', 'CHAR(4)').alter()
    })
}
