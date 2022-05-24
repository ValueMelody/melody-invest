exports.seed = (knex) => {
  return knex('trader_env_follower').insert([
    {
      userId: 1,
      traderEnvId: 1,
      name: 'test1',
    },
    {
      userId: 1,
      traderEnvId: 2,
      name: 'test2',
    },
    {
      userId: 2,
      traderEnvId: 2,
      name: 'test3',
    },
  ])
}
