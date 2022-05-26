exports.seed = (knex) => {
  return knex('ticker_holder').insert([
    {
      tickerId: 1,
      traderId: 1,
    },
    {
      tickerId: 2,
      traderId: 1,
    },
    {
      tickerId: 3,
      traderId: 1,
    },
    {
      tickerId: 1,
      traderId: 2,
    },
    {
      tickerId: 1,
      traderId: 3,
    },
    {
      tickerId: 1,
      traderId: 4,
    },
    {
      tickerId: 1,
      traderId: 53,
    },
    {
      tickerId: 2,
      traderId: 53,
    },
    {
      tickerId: 2,
      traderId: 54,
    },
    {
      tickerId: 2,
      traderId: 55,
    },
    {
      tickerId: 1,
      traderId: 56,
    },
    {
      tickerId: 2,
      traderId: 56,
    },
  ])
}
