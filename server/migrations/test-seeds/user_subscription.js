exports.seed = (knex) => {
  return knex('user_subscription').insert([
    {
      userId: 1,
      subscriptionId: 'AAAA1',
      status: 3,
      startAtUTC: '2022-01-01T01:02:03',
      endAtUTC: '2022-02-01T01:02:03',
    },
    {
      userId: 1,
      subscriptionId: 'AAAA2',
      status: 2,
      startAtUTC: '2022-02-02T02:02:03',
      endAtUTC: '2022-03-01T02:02:03',
    },
    {
      userId: 1,
      subscriptionId: 'AAAA3',
      status: 1,
      startAtUTC: '2022-05-01T01:02:03',
    },
    {
      userId: 2,
      subscriptionId: 'AAAA4',
      status: 1,
      startAtUTC: '2021-01-01T00:00:01',
    },
  ])
}

exports.down = () => {}
