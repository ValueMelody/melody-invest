exports.seed = (knex) => {
  return knex('daily_tickers').insert([
    {
      date: '2022-01-01',
      entityId: 1,
      tickerInfos: {},
      priceInfo: {},
    },
  ])
}

exports.down = () => {}
