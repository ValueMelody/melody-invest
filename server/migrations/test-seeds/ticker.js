exports.seed = (knex) => {
  return knex('ticker').insert([
    { entityId: 1, symbol: 'AAPL', region: 'US', isDelisted: false, name: 'Apple Inc.' },
    { entityId: 1, symbol: 'MSFT', region: 'US', isDelisted: false, name: 'Microsoft Corp' },
    { entityId: 2, symbol: 'GOOG', region: 'US', isDelisted: false, name: 'Google' },
  ])
}

exports.down = () => {}
