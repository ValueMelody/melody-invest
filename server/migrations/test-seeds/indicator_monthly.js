exports.seed = (knex) => {
  return knex('indicator_monthly').insert([
    {
      month: '2021-12',
      fundsRate: '1.11',
      thirtyYearsTreasury: '2.22',
      tenYearsTreasury: '3.33',
      cpi: '4.44',
      inflation: '5.55',
      consumerSentiment: '6.66',
      unemploymentRate: '9.99',
      nonfarmPayroll: '1010',
      fundsRateMonthlyIncrease: 1,
      fundsRateMonthlyDecrease: 2,
      thirtyYearsTreasuryMonthlyIncrease: 3,
      thirtyYearsTreasuryMonthlyDecrease: 4,
      tenYearsTreasuryMonthlyIncrease: 4,
      tenYearsTreasuryMonthlyDecrease: 3,
      inflationMonthlyIncrease: 2,
      inflationMonthlyDecrease: 1,
      cpiMonthlyIncrease: 0,
      cpiMonthlyDecrease: 1,
      consumerSentimentMonthlyIncrease: 1,
      consumerSentimentMonthlyDecrease: 0,
      unemploymentRateMonthlyIncrease: 2,
      unemploymentRateMonthlyDecrease: 2,
      nonfarmPayrollMonthlyIncrease: 1,
      nonfarmPayrollMonthlyDecrease: 1,
    },
    {
      month: '2022-01',
      fundsRate: '1.12',
      thirtyYearsTreasury: '2.23',
      tenYearsTreasury: '3.34',
      cpi: '4.45',
      inflation: '5.56',
      consumerSentiment: '6.67',
      unemploymentRate: '10.00',
      nonfarmPayroll: '1011',
    },
  ])
}

exports.down = () => {}
