exports.up = (knex) => {
  return knex('trader_env').insert([
    { activeTotal: 10000, name: 'traderEnv.default', startDate: '2001-01-01' },
    { activeTotal: 10000, name: 'traderEnv.topTech', startDate: '2016-01-01', tickerIds: '1,2,3,5,6,7,8' },
  ])
}

exports.down = () => {}
