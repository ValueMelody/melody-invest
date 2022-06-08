exports.seed = (knex) => {
  return knex('daily_tickers').insert([
    {
      date: '2021-12-31',
      tickers: {
        info: {
          weeklyAverageFinalPrice: null,
          monthlyAverageFinalPrice: null,
          quarterlyAverageFinalPrice: null,
          yearlyAverageFinalPrice: null,
          priceDailyIncrease: null,
          priceDailyDecrease: null,
          priceWeeklyIncrease: null,
          priceWeeklyDecrease: null,
          priceMonthlyIncrease: null,
          priceMonthlyDecrease: null,
          priceQuarterlyIncrease: null,
          priceQuarterlyDecrease: null,
          priceYearlyIncrease: null,
          priceYearlyDecrease: null,
          epsQuarterlyBeat: 2,
          epsQuarterlyMiss: 0,
          profitQuarterlyIncrease: 1,
          profitQuarterlyDecrease: 0,
          revenueQuarterlyIncrease: 0,
          revenueQuarterlyDecrease: 0,
          incomeQuarterlyIncrease: 1,
          incomeQuarterlyDecrease: 0,
          profitYearlyIncrease: null,
          profitYearlyDecrease: null,
          revenueYearlyIncrease: null,
          revenueYearlyDecrease: null,
          incomeYearlyIncrease: null,
          incomeYearlyDecrease: null,
        },
        daily: {
          tickerId: 1,
          date: '2021-12-31',
          volume: '100000',
          closePrice: 100,
          splitMultiplier: '1.00000',
          dividendAmount: '0.00000',
          weeklyAverageFinalPrice: null,
          monthlyAverageFinalPrice: null,
          quarterlyAverageFinalPrice: null,
          yearlyAverageFinalPrice: null,
          priceDailyIncrease: null,
          priceDailyDecrease: null,
          priceWeeklyIncrease: null,
          priceWeeklyDecrease: null,
          priceMonthlyIncrease: null,
          priceMonthlyDecrease: null,
          priceQuarterlyIncrease: null,
          priceQuarterlyDecrease: null,
          priceYearlyIncrease: null,
          priceYearlyDecrease: null,
        },
        quarterly: {
          tickerId: 1,
          quarter: '2021-12',
          earningDate: '2021-12-31',
          earningReportDate: '2022-01-15',
          eps: '0.05',
          estimatedEPS: '0.03',
          epsSurprisePercent: '25',
          ebitda: '1111111111',
          netIncome: '1000000000',
          grossProfit: '555555555',
          totalRevenue: '150000000000',
          costOfRevenue: '888888888',
          epsQuarterlyBeat: 2,
          epsQuarterlyMiss: 0,
          profitQuarterlyIncrease: 1,
          profitQuarterlyDecrease: 0,
          revenueQuarterlyIncrease: 0,
          revenueQuarterlyDecrease: 0,
          incomeQuarterlyIncrease: 1,
          incomeQuarterlyDecrease: 0,
        },
        yearly: {
          tickerId: 1,
          year: '2020',
          earningDate: '2020-09-30',
          eps: '0.9',
          ebitda: '555555555555',
          netIncome: '333333333333',
          grossProfit: '111111111111',
          totalRevenue: '777777777777',
          costOfRevenue: '444444444444',
          profitYearlyIncrease: null,
          profitYearlyDecrease: null,
          revenueYearlyIncrease: null,
          revenueYearlyDecrease: null,
          incomeYearlyIncrease: null,
          incomeYearlyDecrease: null,
        },
      },
    },
    {
      date: '2022-01-01',
      tickers: {},
    },
  ])
}

exports.down = () => {}
