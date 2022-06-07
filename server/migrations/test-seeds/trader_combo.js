exports.seed = (knex) => {
  return knex('trader_combo').insert([
    {
      traderIds: '1,2,3',
    },
    {
      traderIds: '4,5,6',
    },
    {
      traderIds: '1,2',
    },
  ])
}
