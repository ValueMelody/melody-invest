exports.seed = (knex) => {
  return knex('indicator_yearly').insert([
    {
      year: '2020',
      realGDP: '11111111',
      inflation: '2.22',
      gdpYearlyChangePercent: '1.11',
      inflationYearlyIncrease: 2,
      inflationYearlyDecrease: 0,
    },
    {
      year: '2021',
      realGDP: '11112222',
      inflation: '1.22',
    },
  ])
}

exports.down = () => {}
