exports.seed = (knex) => {
  return knex('trader_combo').insert([
    {
      entityId: 1,
      traderIds: '1,2,3',
    },
    {
      entityId: 1,
      traderIds: '4,5,6',
    },
    {
      entityId: 2,
      traderIds: '1,2',
    },
  ])
}
