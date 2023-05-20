exports.up = (knex) => {
  return knex.schema
    .table('ticker_yearly', (table) => {
      table.string('bookValue', 20)
      table.string('peRatio', 7).alter()
      table.string('pbRatio', 7).alter()
      table.string('psRatio', 7).alter()
    })
    .table('ticker_quarterly', (table) => {
      table.string('bookValue', 20)
      table.string('peRatio', 7).alter()
      table.string('pbRatio', 7).alter()
      table.string('psRatio', 7).alter()
      table.dropColumn('grossMarginChangePercent')
      table.string('grossMarginQoQ', 7)
      table.string('debtEquityQoQ', 7)
    })
}

exports.down = (knex) => {
  return knex.schema
    .table('ticker_yearly', (table) => {
      table.dropColumn('bookValue')
      table.string('peRatio', 5).alter()
      table.string('pbRatio', 5).alter()
      table.string('psRatio', 5).alter()
    })
    .table('ticker_quarterly', (table) => {
      table.dropColumn('bookValue')
      table.string('peRatio', 5).alter()
      table.string('pbRatio', 5).alter()
      table.string('psRatio', 5).alter()
      table.dropColumn('grossMarginQoQ')
      table.dropColumn('debtEquityQoQ')
    })
}
