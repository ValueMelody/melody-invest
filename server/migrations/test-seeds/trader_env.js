exports.seed = (knex) => {
  return knex('trader_env').insert([
    {
      activeTotal: 10000,
      name: 'traderEnv.default',
      isSystem: true,
      startDate: '2001-01-01',
    },
    {
      activeTotal: 10000,
      name: null,
      isSystem: false,
      startDate: '2012-01-01',
    },
    {
      activeTotal: 10000,
      name: null,
      isSystem: false,
      startDate: '2015-06-01',
      tickerIds: '1,2',
    },
  ])
}
