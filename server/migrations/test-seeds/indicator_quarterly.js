exports.seed = (knex) => {
  return knex('indicator_quarterly').insert([
    {
      quarter: '2021-12',
      seasonalGDP: '11111111',
      seasonalGDPQoQ: '1.11',
      seasonalGDPYoY: '-2.22',
    },
    {
      quarter: '2022-03',
      seasonalGDP: '11113333',
      seasonalGDPQoQ: '2.22',
      seasonalGDPYoY: '3.33',
    },
  ])
}

exports.down = () => {}
