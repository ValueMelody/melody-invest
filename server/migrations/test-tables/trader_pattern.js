exports.up = (knex) => {
  return knex.schema
    .createTable('trader_pattern', (table) => {
      table.increments('id')
      table.specificType('hashCode', 'CHAR(128)').notNullable()
      table.smallint('buyPreference').notNullable()
      table.smallint('sellPreference').notNullable()
      table.smallint('cashMaxPercent').notNullable()
      table.smallint('tickerMinPercent').notNullable()
      table.smallint('tickerMaxPercent').notNullable()
      table.smallint('holdingBuyPercent').notNullable()
      table.smallint('holdingSellPercent').notNullable()
      table.smallint('tradeFrequency').notNullable()
      table.smallint('rebalanceFrequency').notNullable()
      table.smallint('priceDailyIncreaseBuy')
      table.smallint('priceDailyIncreaseSell')
      table.smallint('priceDailyDecreaseBuy')
      table.smallint('priceDailyDecreaseSell')
      table.smallint('priceWeeklyIncreaseBuy')
      table.smallint('priceWeeklyIncreaseSell')
      table.smallint('priceWeeklyDecreaseBuy')
      table.smallint('priceWeeklyDecreaseSell')
      table.smallint('priceMonthlyIncreaseBuy')
      table.smallint('priceMonthlyIncreaseSell')
      table.smallint('priceMonthlyDecreaseBuy')
      table.smallint('priceMonthlyDecreaseSell')
      table.smallint('priceQuarterlyIncreaseBuy')
      table.smallint('priceQuarterlyIncreaseSell')
      table.smallint('priceQuarterlyDecreaseBuy')
      table.smallint('priceQuarterlyDecreaseSell')
      table.smallint('priceYearlyIncreaseBuy')
      table.smallint('priceYearlyIncreaseSell')
      table.smallint('priceYearlyDecreaseBuy')
      table.smallint('priceYearlyDecreaseSell')
      table.smallint('incomeQuarterlyIncreaseBuy')
      table.smallint('incomeQuarterlyIncreaseSell')
      table.smallint('incomeQuarterlyDecreaseBuy')
      table.smallint('incomeQuarterlyDecreaseSell')
      table.smallint('profitQuarterlyIncreaseBuy')
      table.smallint('profitQuarterlyIncreaseSell')
      table.smallint('profitQuarterlyDecreaseBuy')
      table.smallint('profitQuarterlyDecreaseSell')
      table.smallint('revenueQuarterlyIncreaseBuy')
      table.smallint('revenueQuarterlyIncreaseSell')
      table.smallint('revenueQuarterlyDecreaseBuy')
      table.smallint('revenueQuarterlyDecreaseSell')
      table.smallint('incomeYearlyIncreaseBuy')
      table.smallint('incomeYearlyIncreaseSell')
      table.smallint('incomeYearlyDecreaseBuy')
      table.smallint('incomeYearlyDecreaseSell')
      table.smallint('profitYearlyIncreaseBuy')
      table.smallint('profitYearlyIncreaseSell')
      table.smallint('profitYearlyDecreaseBuy')
      table.smallint('profitYearlyDecreaseSell')
      table.smallint('revenueYearlyIncreaseBuy')
      table.smallint('revenueYearlyIncreaseSell')
      table.smallint('revenueYearlyDecreaseBuy')
      table.smallint('revenueYearlyDecreaseSell')
      table.smallint('inflationYearlyIncreaseBuy')
      table.smallint('inflationYearlyIncreaseSell')
      table.smallint('inflationYearlyDecreaseBuy')
      table.smallint('inflationYearlyDecreaseSell')
      table.smallint('fundsRateMonthlyIncreaseBuy')
      table.smallint('fundsRateMonthlyIncreaseSell')
      table.smallint('fundsRateMonthlyDecreaseBuy')
      table.smallint('fundsRateMonthlyDecreaseSell')
      table.smallint('thirtyYearsTreasuryMonthlyIncreaseBuy')
      table.smallint('thirtyYearsTreasuryMonthlyIncreaseSell')
      table.smallint('thirtyYearsTreasuryMonthlyDecreaseBuy')
      table.smallint('thirtyYearsTreasuryMonthlyDecreaseSell')
      table.smallint('tenYearsTreasuryMonthlyIncreaseBuy')
      table.smallint('tenYearsTreasuryMonthlyIncreaseSell')
      table.smallint('tenYearsTreasuryMonthlyDecreaseBuy')
      table.smallint('tenYearsTreasuryMonthlyDecreaseSell')
      table.smallint('inflationMonthlyIncreaseBuy')
      table.smallint('inflationMonthlyIncreaseSell')
      table.smallint('inflationMonthlyDecreaseBuy')
      table.smallint('inflationMonthlyDecreaseSell')
      table.smallint('cpiMonthlyIncreaseBuy')
      table.smallint('cpiMonthlyIncreaseSell')
      table.smallint('cpiMonthlyDecreaseBuy')
      table.smallint('cpiMonthlyDecreaseSell')
      table.smallint('consumerSentimentMonthlyIncreaseBuy')
      table.smallint('consumerSentimentMonthlyIncreaseSell')
      table.smallint('consumerSentimentMonthlyDecreaseBuy')
      table.smallint('consumerSentimentMonthlyDecreaseSell')
      table.smallint('unemploymentRateMonthlyIncreaseBuy')
      table.smallint('unemploymentRateMonthlyIncreaseSell')
      table.smallint('unemploymentRateMonthlyDecreaseBuy')
      table.smallint('unemploymentRateMonthlyDecreaseSell')
      table.smallint('nonfarmPayrollMonthlyIncreaseBuy')
      table.smallint('nonfarmPayrollMonthlyIncreaseSell')
      table.smallint('nonfarmPayrollMonthlyDecreaseBuy')
      table.smallint('nonfarmPayrollMonthlyDecreaseSell')
      table.smallint('gdpYearlyChangeAboveBuy')
      table.smallint('gdpYearlyChangeAboveSell')
      table.smallint('gdpYearlyChangeBelowBuy')
      table.smallint('gdpYearlyChangeBelowSell')
      table.smallint('seasonalGDPQoQAboveBuy')
      table.smallint('seasonalGDPQoQAboveSell')
      table.smallint('seasonalGDPQoQBelowBuy')
      table.smallint('seasonalGDPQoQBelowSell')
      table.smallint('seasonalGDPYoYAboveBuy')
      table.smallint('seasonalGDPYoYAboveSell')
      table.smallint('seasonalGDPYoYBelowBuy')
      table.smallint('seasonalGDPYoYBelowSell')
      table.smallint('peQuarterlyIncreaseBuy')
      table.smallint('peQuarterlyIncreaseSell')
      table.smallint('peQuarterlyDecreaseBuy')
      table.smallint('peQuarterlyDecreaseSell')
      table.smallint('pbQuarterlyIncreaseBuy')
      table.smallint('pbQuarterlyIncreaseSell')
      table.smallint('pbQuarterlyDecreaseBuy')
      table.smallint('pbQuarterlyDecreaseSell')
      table.smallint('psQuarterlyIncreaseBuy')
      table.smallint('psQuarterlyIncreaseSell')
      table.smallint('psQuarterlyDecreaseBuy')
      table.smallint('psQuarterlyDecreaseSell')
      table.smallint('epsQuarterlyIncreaseBuy')
      table.smallint('epsQuarterlyIncreaseSell')
      table.smallint('epsQuarterlyDecreaseBuy')
      table.smallint('epsQuarterlyDecreaseSell')
      table.smallint('ebitdaQuarterlyIncreaseBuy')
      table.smallint('ebitdaQuarterlyIncreaseSell')
      table.smallint('ebitdaQuarterlyDecreaseBuy')
      table.smallint('ebitdaQuarterlyDecreaseSell')
      table.smallint('freeCashFlowQuarterlyIncreaseBuy')
      table.smallint('freeCashFlowQuarterlyIncreaseSell')
      table.smallint('freeCashFlowQuarterlyDecreaseBuy')
      table.smallint('freeCashFlowQuarterlyDecreaseSell')
      table.smallint('roaQuarterlyIncreaseBuy')
      table.smallint('roaQuarterlyIncreaseSell')
      table.smallint('roaQuarterlyDecreaseBuy')
      table.smallint('roaQuarterlyDecreaseSell')
      table.smallint('roeQuarterlyIncreaseBuy')
      table.smallint('roeQuarterlyIncreaseSell')
      table.smallint('roeQuarterlyDecreaseBuy')
      table.smallint('roeQuarterlyDecreaseSell')
      table.smallint('grossMarginQuarterlyIncreaseBuy')
      table.smallint('grossMarginQuarterlyIncreaseSell')
      table.smallint('grossMarginQuarterlyDecreaseBuy')
      table.smallint('grossMarginQuarterlyDecreaseSell')
      table.smallint('debtEquityQuarterlyIncreaseBuy')
      table.smallint('debtEquityQuarterlyIncreaseSell')
      table.smallint('debtEquityQuarterlyDecreaseBuy')
      table.smallint('debtEquityQuarterlyDecreaseSell')
      table.smallint('peRatioQuarterlyAboveBuy')
      table.smallint('peRatioQuarterlyAboveSell')
      table.smallint('peRatioQuarterlyBelowBuy')
      table.smallint('peRatioQuarterlyBelowSell')
      table.smallint('pbRatioQuarterlyAboveBuy')
      table.smallint('pbRatioQuarterlyAboveSell')
      table.smallint('pbRatioQuarterlyBelowBuy')
      table.smallint('pbRatioQuarterlyBelowSell')
      table.smallint('psRatioQuarterlyAboveBuy')
      table.smallint('psRatioQuarterlyAboveSell')
      table.smallint('psRatioQuarterlyBelowBuy')
      table.smallint('psRatioQuarterlyBelowSell')
      table.smallint('roaQuarterlyAboveBuy')
      table.smallint('roaQuarterlyAboveSell')
      table.smallint('roaQuarterlyBelowBuy')
      table.smallint('roaQuarterlyBelowSell')
      table.smallint('roeQuarterlyAboveBuy')
      table.smallint('roeQuarterlyAboveSell')
      table.smallint('roeQuarterlyBelowBuy')
      table.smallint('roeQuarterlyBelowSell')
      table.smallint('grossMarginQuarterlyAboveBuy')
      table.smallint('grossMarginQuarterlyAboveSell')
      table.smallint('grossMarginQuarterlyBelowBuy')
      table.smallint('grossMarginQuarterlyBelowSell')
      table.smallint('debtEquityQuarterlyAboveBuy')
      table.smallint('debtEquityQuarterlyAboveSell')
      table.smallint('debtEquityQuarterlyBelowBuy')
      table.smallint('debtEquityQuarterlyBelowSell')
      table.smallint('peYearlyIncreaseBuy')
      table.smallint('peYearlyIncreaseSell')
      table.smallint('peYearlyDecreaseBuy')
      table.smallint('peYearlyDecreaseSell')
      table.smallint('pbYearlyIncreaseBuy')
      table.smallint('pbYearlyIncreaseSell')
      table.smallint('pbYearlyDecreaseBuy')
      table.smallint('pbYearlyDecreaseSell')
      table.smallint('psYearlyIncreaseBuy')
      table.smallint('psYearlyIncreaseSell')
      table.smallint('psYearlyDecreaseBuy')
      table.smallint('psYearlyDecreaseSell')
      table.smallint('epsYearlyIncreaseBuy')
      table.smallint('epsYearlyIncreaseSell')
      table.smallint('epsYearlyDecreaseBuy')
      table.smallint('epsYearlyDecreaseSell')
      table.smallint('ebitdaYearlyIncreaseBuy')
      table.smallint('ebitdaYearlyIncreaseSell')
      table.smallint('ebitdaYearlyDecreaseBuy')
      table.smallint('ebitdaYearlyDecreaseSell')
      table.smallint('freeCashFlowYearlyIncreaseBuy')
      table.smallint('freeCashFlowYearlyIncreaseSell')
      table.smallint('freeCashFlowYearlyDecreaseBuy')
      table.smallint('freeCashFlowYearlyDecreaseSell')
      table.smallint('peRatioYearlyAboveBuy')
      table.smallint('peRatioYearlyAboveSell')
      table.smallint('peRatioYearlyBelowBuy')
      table.smallint('peRatioYearlyBelowSell')
      table.smallint('pbRatioYearlyAboveBuy')
      table.smallint('pbRatioYearlyAboveSell')
      table.smallint('pbRatioYearlyBelowBuy')
      table.smallint('pbRatioYearlyBelowSell')
      table.smallint('psRatioYearlyAboveBuy')
      table.smallint('psRatioYearlyAboveSell')
      table.smallint('psRatioYearlyBelowBuy')
      table.smallint('psRatioYearlyBelowSell')
      table.smallint('fundsRateMonthlyAboveBuy')
      table.smallint('fundsRateMonthlyAboveSell')
      table.smallint('fundsRateMonthlyBelowBuy')
      table.smallint('fundsRateMonthlyBelowSell')
      table.smallint('tenYearsTreasuryMonthlyAboveBuy')
      table.smallint('tenYearsTreasuryMonthlyAboveSell')
      table.smallint('tenYearsTreasuryMonthlyBelowBuy')
      table.smallint('tenYearsTreasuryMonthlyBelowSell')
      table.smallint('thirtyYearsTreasuryMonthlyAboveBuy')
      table.smallint('thirtyYearsTreasuryMonthlyAboveSell')
      table.smallint('thirtyYearsTreasuryMonthlyBelowBuy')
      table.smallint('thirtyYearsTreasuryMonthlyBelowSell')
      table.smallint('inflationMonthlyAboveBuy')
      table.smallint('inflationMonthlyAboveSell')
      table.smallint('inflationMonthlyBelowBuy')
      table.smallint('inflationMonthlyBelowSell')
      table.smallint('consumerSentimentMonthlyAboveBuy')
      table.smallint('consumerSentimentMonthlyAboveSell')
      table.smallint('consumerSentimentMonthlyBelowBuy')
      table.smallint('consumerSentimentMonthlyBelowSell')
      table.smallint('nonfarmPayrollMonthlyAboveBuy')
      table.smallint('nonfarmPayrollMonthlyAboveSell')
      table.smallint('nonfarmPayrollMonthlyBelowBuy')
      table.smallint('nonfarmPayrollMonthlyBelowSell')
      table.smallint('seasonalGDPQuarterlyIncreaseBuy')
      table.smallint('seasonalGDPQuarterlyIncreaseSell')
      table.smallint('seasonalGDPQuarterlyDecreaseBuy')
      table.smallint('seasonalGDPQuarterlyDecreaseSell')
      table.smallint('gdpYearlyIncreaseBuy')
      table.smallint('gdpYearlyIncreaseSell')
      table.smallint('gdpYearlyDecreaseBuy')
      table.smallint('gdpYearlyDecreaseSell')
      table.smallint('inflationYearlyAboveBuy')
      table.smallint('inflationYearlyAboveSell')
      table.smallint('inflationYearlyBelowBuy')
      table.smallint('inflationYearlyBelowSell')
      table.unique('hashCode', 'trader_pattern_ukey')
    })
}

exports.down = (knex) => {
  return knex.schema.dropTable('trader_pattern')
}
