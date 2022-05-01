exports.seed = (knex) => {
  return knex('user').insert([
    {
      email: 'a@email.com',
      type: 1,
      password: 'abc',
      activationCode: 'xyz',
      activationSentAt: '2022-01-03',
      createdAt: '2022-01-02',
      updatedAt: '2022-01-03',
    },
    {
      email: 'b@email.com',
      type: 1,
      password: 'aabbcc',
      createdAt: '2022-03-03',
      updatedAt: '2022-03-03',
    },
  ])
}

exports.down = () => {}
