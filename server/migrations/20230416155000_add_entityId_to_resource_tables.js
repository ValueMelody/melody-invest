exports.up = (knex) => {
  return knex.schema
    .table('ticker', (table) => {
      table.integer('entityId').notNullable()
      table.foreign('entityId').references('id').inTable('entity')
      table.dropUnique([], 'ticker_ukey')
      table.unique(['entityId', 'symbol', 'region'], 'ticker_ukey')
    })
    .table('daily_tickers', (table) => {
      table.integer('entityId').notNullable()
      table.foreign('entityId').references('id').inTable('entity')
      table.dropUnique([], 'daily_tickers_ukey')
      table.unique(['entityId', 'date'], 'daily_tickers_ukey')
    })
    .table('trader_env', (table) => {
      table.integer('entityId').notNullable()
      table.foreign('entityId').references('id').inTable('entity')
      table.dropUnique([], 'trader_env_ukey')
      table.unique(['entityId', 'startDate', 'tickerIds'], 'trader_env_ukey')
    })
    .table('trader_combo', (table) => {
      table.integer('entityId').notNullable()
      table.foreign('entityId').references('id').inTable('entity')
      table.dropUnique([], 'trader_combo_ukey')
      table.unique(['entityId', 'traderIds'], 'trader_combo_ukey')
    })
}

exports.down = (knex) => {
  return knex.schema
    .table('ticker', (table) => {
      table.dropColumn('entityId')
      table.dropUnique([], 'ticker_ukey')
      table.unique(['symbol', 'region'], 'ticker_ukey')
    })
    .table('daily_tickers', (table) => {
      table.dropColumn('entityId')
      table.dropUnique([], 'daily_tickers_ukey')
      table.unique(['date'], 'daily_tickers_ukey')
    })
    .table('trader_env', (table) => {
      table.dropColumn('entityId')
      table.dropUnique([], 'trader_env_ukey')
      table.unique(['startDate', 'tickerIds'], 'trader_env_ukey')
    })
    .table('trader_combo', (table) => {
      table.dropColumn('entityId')
      table.dropUnique([], 'trader_combo_ukey')
      table.unique(['traderIds'], 'trader_combo_ukey')
    })
}
