exports.seed = (knex) => {
  return knex('entity').insert([
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
  ])
}

exports.down = () => {}
