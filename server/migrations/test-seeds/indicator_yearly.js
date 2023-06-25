exports.seed = (knex) => {
  return knex('indicator_yearly').insert([
    {
      year: '2020',
      gdp: '11111111',
      annualInflation: '2.22',
      gdpYearlyChangePercent: '1.11',
      inflationYearlyIncrease: 2,
      inflationYearlyDecrease: 0,
    },
    {
      year: '2021',
      gdp: '11112222',
      annualInflation: '1.22',
    },
  ])
}

exports.down = () => {}
