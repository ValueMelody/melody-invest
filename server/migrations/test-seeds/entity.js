exports.seed = (knex) => {
  return knex('entity').insert([
    {
      dataKey: null,
    },
    {
      dataKey: null,
    },
    {
      dataKey: null,
    },
  ])
}

exports.down = () => {}
