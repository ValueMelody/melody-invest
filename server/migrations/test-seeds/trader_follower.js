exports.seed = (knex) => {
  return knex('trader_follower').insert([
    {
      userId: 1,
      traderId: 1,
    },
    {
      userId: 1,
      traderId: 2,
    },
    {
      userId: 1,
      traderId: 3,
    },
    {
      userId: 2,
      traderId: 1,
    },
    {
      userId: 2,
      traderId: 2,
    },
  ])
}
