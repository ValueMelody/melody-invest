exports.seed = (knex) => {
  return knex('ticker').insert([
    { symbol: 'AAPL', region: 'US', isDelisted: false, name: 'Apple Inc.', tickerCategoryId: 2 },
    { symbol: 'MSFT', region: 'US', isDelisted: false, name: 'Microsoft Corp', tickerCategoryId: 1 },
    { symbol: 'GOOG', region: 'US', isDelisted: false, name: 'Google' },
  ])
}

exports.down = () => {}
