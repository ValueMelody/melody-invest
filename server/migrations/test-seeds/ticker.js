exports.up = (knex) => {
  return knex('ticker').insert([
    { symbol: 'AAPL', region: 'US', name: 'Apple Inc.', tickerCategoryId: 2 },
    { symbol: 'MSFT', region: 'US', name: 'Microsoft Corp', tickerCategoryId: 1 },
    { symbol: 'GOOG', region: 'US', name: 'Google' },
  ])
}

exports.down = () => {}
