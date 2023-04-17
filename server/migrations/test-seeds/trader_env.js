exports.seed = (knex) => {
  return knex('trader_env').insert([
    {
      entityId: 1,
      activeTotal: 10000,
      startDate: '2001-01-01',
    },
    {
      entityId: 2,
      activeTotal: 10000,
      startDate: '2012-01-01',
    },
    {
      entityId: 1,
      activeTotal: 10000,
      startDate: '2015-06-01',
      tickerIds: '1,2',
    },
  ])
}
