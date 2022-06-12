exports.seed = (knex) => {
  return knex('user_subscription').insert([
    {
      userId: 1,
      subscriptionId: 'AAAA1',
      status: 3,
    },
    {
      userId: 1,
      subscriptionId: 'AAAA2',
      status: 2,
    },
    {
      userId: 1,
      subscriptionId: 'AAAA3',
      status: 3,
    },
    {
      userId: 2,
      subscriptionId: 'AAAA4',
      status: 1,
    },
  ])
}

exports.down = () => {}
