exports.up = (knex) => {
  return knex.schema
    .table('daily_tickers', (table) => {
      table.dropColumn('indicators')
      table.renameColumn('tickers', 'tickerInfos')
      table.renameColumn('nearestPrices', 'priceInfo')
    })
}

exports.down = (knex) => {
  return knex.schema
    .table('daily_tickers', (table) => {
      table.jsonb('indicators')
      table.renameColumn('tickerInfos', 'tickers')
      table.renameColumn('priceInfo', 'nearestPrices')
    })
}
