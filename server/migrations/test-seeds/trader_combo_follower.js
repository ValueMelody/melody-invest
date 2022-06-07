exports.seed = (knex) => {
  return knex('trader_combo_follower').insert([
    {
      userId: 1,
      traderComboId: 1,
      name: 'test1',
    },
    {
      userId: 1,
      traderComboId: 2,
      name: 'test2',
    },
    {
      userId: 2,
      traderComboId: 1,
      name: 'test3',
    },
  ])
}
