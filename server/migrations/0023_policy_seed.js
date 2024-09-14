exports.up = (knex) => {
  return knex('policy').insert([
    {
      type: 1,
      content: 'Privacy policy',
      createdAt: new Date(),
    },
    {
      type: 2,
      content: 'Terms and Conditions',
      createdAt: new Date(),
    },
  ])
}

exports.down = (knex) => {
}