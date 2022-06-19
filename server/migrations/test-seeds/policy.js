exports.seed = (knex) => {
  return knex('policy').insert([
    {
      type: 1,
      content: 'Privacy policy 1',
      createdAt: new Date('2022-01-01'),
    },
    {
      type: 2,
      content: 'Terms and Conditions 1',
      createdAt: new Date(),
    },
    {
      type: 1,
      content: 'Privacy policy 2',
      createdAt: new Date('2022-03-01'),
    },
  ])
}
