exports.seed = (knex) => {
  return knex('indicator_quarterly').insert([
    {
      quarter: '2021-12',
      reportMonth: '2022-03',
      realGDP: '11111111',
      gdpQuarterlyChangePercent: '1.11',
      gdpQuarterlyYoYChangePercent: '-2.22',
    },
    {
      quarter: '2022-03',
      reportMonth: '2022-04',
      realGDP: '11113333',
      gdpQuarterlyChangePercent: '2.22',
      gdpQuarterlyYoYChangePercent: '3.33',
    },
  ])
}

exports.down = () => {}
