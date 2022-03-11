import * as interfaces from '@interfaces'
import * as patternEnums from '../enums/pattern'
import * as tickerDailyModel from '../models/tickerDaily'
import * as tickerQuarterlyModel from '../models/tickerQuarterly'
import * as tickerYearlyModel from '../models/tickerYearly'
import * as indicatorYearlyModel from '../models/indicatorYearly'
import * as indicatorQuarterlyModel from '../models/indicatorQuarterly'
import * as indicatorMonthlyModel from '../models/indicatorMonthly'
import * as generateTool from '../tools/generate'

const BEHAVIOR_VALUES = {
  priceDailyIncreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  priceDailyIncreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  priceDailyDecreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  priceDailyDecreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  priceWeeklyIncreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  priceWeeklyIncreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  priceWeeklyDecreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  priceWeeklyDecreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  priceMonthlyIncreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  priceMonthlyIncreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  priceMonthlyDecreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  priceMonthlyDecreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  priceQuarterlyIncreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  priceQuarterlyIncreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  priceQuarterlyDecreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  priceQuarterlyDecreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  priceYearlyIncreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  priceYearlyIncreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  priceYearlyDecreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  priceYearlyDecreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  epsQuarterlyBeatsBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  epsQuarterlyMissBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  epsQuarterlyBeatsSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  epsQuarterlyMissSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  profitQuarterlyIncreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  profitQuarterlyIncreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  profitQuarterlyDecreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  profitQuarterlyDecreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  incomeQuarterlyIncreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  incomeQuarterlyIncreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  incomeQuarterlyDecreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  incomeQuarterlyDecreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  revenueQuarterlyIncreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  revenueQuarterlyIncreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  revenueQuarterlyDecreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  revenueQuarterlyDecreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  profitYearlyIncreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  profitYearlyIncreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  profitYearlyDecreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  profitYearlyDecreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  incomeYearlyIncreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  incomeYearlyIncreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  incomeYearlyDecreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  incomeYearlyDecreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  revenueYearlyIncreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  revenueYearlyIncreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  revenueYearlyDecreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  revenueYearlyDecreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  inflationYearlyIncreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  inflationYearlyDecreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  inflationYearlyIncreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  inflationYearlyDecreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  fundsRateMonthlyIncreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  fundsRateMonthlyDecreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  fundsRateMonthlyIncreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  fundsRateMonthlyDecreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  thirtyYearsTreasuryMonthlyIncreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  thirtyYearsTreasuryMonthlyDecreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  thirtyYearsTreasuryMonthlyIncreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  thirtyYearsTreasuryMonthlyDecreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  tenYearsTreasuryMonthlyIncreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  tenYearsTreasuryMonthlyDecreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  tenYearsTreasuryMonthlyIncreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  tenYearsTreasuryMonthlyDecreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  inflationMonthlyIncreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  inflationMonthlyDecreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  inflationMonthlyIncreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  inflationMonthlyDecreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  cpiMonthlyIncreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  cpiMonthlyDecreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  cpiMonthlyIncreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  cpiMonthlyDecreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  consumerSentimentMonthlyIncreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  consumerSentimentMonthlyDecreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  consumerSentimentMonthlyIncreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  consumerSentimentMonthlyDecreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  retailSalesMonthlyIncreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  retailSalesMonthlyDecreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  retailSalesMonthlyIncreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  retailSalesMonthlyDecreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  durableGoodsMonthlyIncreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  durableGoodsMonthlyDecreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  durableGoodsMonthlyIncreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  durableGoodsMonthlyDecreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  unemployeementRateMonthlyIncreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  unemployeementRateMonthlyDecreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  unemployeementRateMonthlyIncreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  unemployeementRateMonthlyDecreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  nonfarmPayrollMonthlyIncreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  nonfarmPayrollMonthlyDecreaseBuy: [...patternEnums.VALUES.MOVEMENT_VALUE],
  nonfarmPayrollMonthlyIncreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  nonfarmPayrollMonthlyDecreaseSell: [...patternEnums.VALUES.MOVEMENT_VALUE],
  gdpYearlyChangeAboveBuy: [...patternEnums.VALUES.GDP_CHANGE_PERCENT],
  gdpYearlyChangeAboveSell: [...patternEnums.VALUES.GDP_CHANGE_PERCENT],
  gdpYearlyChangeBelowBuy: [...patternEnums.VALUES.GDP_CHANGE_PERCENT],
  gdpYearlyChangeBelowSell: [...patternEnums.VALUES.GDP_CHANGE_PERCENT],
  gdpQuarterlyChangeAboveBuy: [...patternEnums.VALUES.GDP_CHANGE_PERCENT],
  gdpQuarterlyChangeAboveSell: [...patternEnums.VALUES.GDP_CHANGE_PERCENT],
  gdpQuarterlyChangeBelowBuy: [...patternEnums.VALUES.GDP_CHANGE_PERCENT],
  gdpQuarterlyChangeBelowSell: [...patternEnums.VALUES.GDP_CHANGE_PERCENT],
  gdpQuarterlyYoYChangeAboveBuy: [...patternEnums.VALUES.GDP_CHANGE_PERCENT],
  gdpQuarterlyYoYChangeAboveSell: [...patternEnums.VALUES.GDP_CHANGE_PERCENT],
  gdpQuarterlyYoYChangeBelowBuy: [...patternEnums.VALUES.GDP_CHANGE_PERCENT],
  gdpQuarterlyYoYChangeBelowSell: [...patternEnums.VALUES.GDP_CHANGE_PERCENT],
  cashMaxPercent: [...patternEnums.VALUES.CASH_MAX_PERCENT],
  tickerMinPercent: [...patternEnums.VALUES.PORTFOLIO_PERCENT],
  tickerMaxPercent: [...patternEnums.VALUES.PORTFOLIO_PERCENT],
  holdingBuyPercent: [...patternEnums.VALUES.PORTFOLIO_PERCENT],
  holdingSellPercent: [...patternEnums.VALUES.HOLDING_PERCENT],
  tradeFrequency: [...patternEnums.VALUES.TRADE_FREQUENCY],
  rebalanceFrequency: [...patternEnums.VALUES.REBALANCE_FREQUENCY],
  buyPreference: [...patternEnums.VALUES.PREFERENCE],
  sellPreference: [...patternEnums.VALUES.PREFERENCE],
}

const BEHAVIOR_GROUPS: interfaces.traderPatternModel.BehaviorType[][] = [
  [
    'priceDailyIncreaseBuy',
    'priceDailyDecreaseBuy',
    'priceWeeklyIncreaseBuy',
    'priceWeeklyDecreaseBuy',
    'priceMonthlyIncreaseBuy',
    'priceMonthlyDecreaseBuy',
    'priceQuarterlyIncreaseBuy',
    'priceQuarterlyDecreaseBuy',
    'priceYearlyIncreaseBuy',
    'priceYearlyDecreaseBuy',
    'epsQuarterlyBeatsBuy',
    'epsQuarterlyMissBuy',
    'profitQuarterlyIncreaseBuy',
    'incomeQuarterlyIncreaseBuy',
    'revenueQuarterlyIncreaseBuy',
    'profitQuarterlyDecreaseBuy',
    'incomeQuarterlyDecreaseBuy',
    'revenueQuarterlyDecreaseBuy',
    'profitYearlyIncreaseBuy',
    'incomeYearlyIncreaseBuy',
    'revenueYearlyIncreaseBuy',
    'profitYearlyDecreaseBuy',
    'incomeYearlyDecreaseBuy',
    'revenueYearlyDecreaseBuy',
    'inflationYearlyIncreaseBuy',
    'inflationYearlyDecreaseBuy',
    'fundsRateMonthlyIncreaseBuy',
    'fundsRateMonthlyDecreaseBuy',
    'thirtyYearsTreasuryMonthlyIncreaseBuy',
    'thirtyYearsTreasuryMonthlyDecreaseBuy',
    'tenYearsTreasuryMonthlyIncreaseBuy',
    'tenYearsTreasuryMonthlyDecreaseBuy',
    'inflationMonthlyIncreaseBuy',
    'inflationMonthlyDecreaseBuy',
    'cpiMonthlyIncreaseBuy',
    'cpiMonthlyDecreaseBuy',
    'consumerSentimentMonthlyIncreaseBuy',
    'consumerSentimentMonthlyDecreaseBuy',
    'retailSalesMonthlyIncreaseBuy',
    'retailSalesMonthlyDecreaseBuy',
    'durableGoodsMonthlyIncreaseBuy',
    'durableGoodsMonthlyDecreaseBuy',
    'unemployeementRateMonthlyIncreaseBuy',
    'unemployeementRateMonthlyDecreaseBuy',
    'nonfarmPayrollMonthlyIncreaseBuy',
    'nonfarmPayrollMonthlyDecreaseBuy',
    'gdpYearlyChangeAboveBuy',
    'gdpYearlyChangeBelowBuy',
    'gdpQuarterlyChangeAboveBuy',
    'gdpQuarterlyChangeBelowBuy',
    'gdpQuarterlyYoYChangeAboveBuy',
    'gdpQuarterlyYoYChangeBelowBuy',
  ],
  [
    'priceDailyIncreaseSell',
    'priceDailyDecreaseSell',
    'priceWeeklyIncreaseSell',
    'priceWeeklyDecreaseSell',
    'priceMonthlyIncreaseSell',
    'priceMonthlyDecreaseSell',
    'priceQuarterlyIncreaseSell',
    'priceQuarterlyDecreaseSell',
    'priceYearlyIncreaseSell',
    'priceYearlyDecreaseSell',
    'epsQuarterlyBeatsSell',
    'epsQuarterlyMissSell',
    'profitQuarterlyIncreaseSell',
    'incomeQuarterlyIncreaseSell',
    'revenueQuarterlyIncreaseSell',
    'profitQuarterlyDecreaseSell',
    'incomeQuarterlyDecreaseSell',
    'revenueQuarterlyDecreaseSell',
    'profitYearlyIncreaseSell',
    'incomeYearlyIncreaseSell',
    'revenueYearlyIncreaseSell',
    'profitYearlyDecreaseSell',
    'incomeYearlyDecreaseSell',
    'revenueYearlyDecreaseSell',
    'inflationYearlyIncreaseSell',
    'inflationYearlyDecreaseSell',
    'fundsRateMonthlyIncreaseSell',
    'fundsRateMonthlyDecreaseSell',
    'thirtyYearsTreasuryMonthlyIncreaseSell',
    'thirtyYearsTreasuryMonthlyDecreaseSell',
    'tenYearsTreasuryMonthlyIncreaseSell',
    'tenYearsTreasuryMonthlyDecreaseSell',
    'inflationMonthlyIncreaseSell',
    'inflationMonthlyDecreaseSell',
    'cpiMonthlyIncreaseSell',
    'cpiMonthlyDecreaseSell',
    'consumerSentimentMonthlyIncreaseSell',
    'consumerSentimentMonthlyDecreaseSell',
    'retailSalesMonthlyIncreaseSell',
    'retailSalesMonthlyDecreaseSell',
    'durableGoodsMonthlyIncreaseSell',
    'durableGoodsMonthlyDecreaseSell',
    'unemployeementRateMonthlyIncreaseSell',
    'unemployeementRateMonthlyDecreaseSell',
    'nonfarmPayrollMonthlyIncreaseSell',
    'nonfarmPayrollMonthlyDecreaseSell',
    'gdpYearlyChangeAboveSell',
    'gdpYearlyChangeBelowSell',
    'gdpQuarterlyChangeAboveSell',
    'gdpQuarterlyChangeBelowSell',
    'gdpQuarterlyYoYChangeAboveSell',
    'gdpQuarterlyYoYChangeBelowSell',
  ],
  ['cashMaxPercent'],
  ['tickerMinPercent'],
  ['tickerMaxPercent'],
  ['holdingBuyPercent'],
  ['holdingSellPercent'],
  ['tradeFrequency'],
  ['rebalanceFrequency'],
  ['buyPreference'],
  ['sellPreference'],
]

interface Behavior {
  type: interfaces.traderPatternModel.BehaviorType;
  value: number;
}

type MovementKey =
  tickerDailyModel.MovementKey |
  tickerQuarterlyModel.MovementKey |
  tickerYearlyModel.MovementKey |
  indicatorYearlyModel.MovementKey |
  indicatorMonthlyModel.MovementKey

type CompareKey = indicatorYearlyModel.CompareKey |
  indicatorQuarterlyModel.CompareKey

const buildInitialTickerInfo = (
  tickerDaily: tickerDailyModel.Record,
  tickerQuarterly: tickerQuarterlyModel.Record | null,
  tickerYearly: tickerYearlyModel.Record | null,
  indicatorMonthly: indicatorMonthlyModel.Record | null,
  indicatorQuarterly: indicatorQuarterlyModel.Record | null,
  indicatorYearly: indicatorYearlyModel.Record | null,
) => {
  return {
    ...tickerDaily,
    epsQuarterlyBeats: tickerQuarterly ? tickerQuarterly.epsQuarterlyBeats : null,
    epsQuarterlyMiss: tickerQuarterly ? tickerQuarterly.epsQuarterlyMiss : null,
    profitQuarterlyIncrease: tickerQuarterly ? tickerQuarterly.profitQuarterlyIncrease : null,
    profitQuarterlyDecrease: tickerQuarterly ? tickerQuarterly.profitQuarterlyDecrease : null,
    incomeQuarterlyIncrease: tickerQuarterly ? tickerQuarterly.incomeQuarterlyIncrease : null,
    incomeQuarterlyDecrease: tickerQuarterly ? tickerQuarterly.incomeQuarterlyDecrease : null,
    revenueQuarterlyIncrease: tickerQuarterly ? tickerQuarterly.revenueQuarterlyIncrease : null,
    revenueQuarterlyDecrease: tickerQuarterly ? tickerQuarterly.revenueQuarterlyDecrease : null,
    profitYearlyIncrease: tickerYearly ? tickerYearly.profitYearlyIncrease : null,
    profitYearlyDecrease: tickerYearly ? tickerYearly.profitYearlyDecrease : null,
    incomeYearlyIncrease: tickerYearly ? tickerYearly.incomeYearlyIncrease : null,
    incomeYearlyDecrease: tickerYearly ? tickerYearly.incomeYearlyDecrease : null,
    revenueYearlyIncrease: tickerYearly ? tickerYearly.revenueYearlyIncrease : null,
    revenueYearlyDecrease: tickerYearly ? tickerYearly.revenueYearlyDecrease : null,
    inflationYearlyIncrease: indicatorYearly ? indicatorYearly.inflationYearlyIncrease : null,
    inflationYearlyDecrease: indicatorYearly ? indicatorYearly.inflationYearlyDecrease : null,
    gdpYearlyChangePercent: indicatorYearly ? indicatorYearly.gdpYearlyChangePercent : null,
    gdpQuarterlyChangePercent: indicatorQuarterly ? indicatorQuarterly.gdpQuarterlyChangePercent : null,
    gdpQuarterlyYoYChangePercent: indicatorQuarterly ? indicatorQuarterly.gdpQuarterlyYoYChangePercent : null,
    fundsRateMonthlyIncrease: indicatorMonthly ? indicatorMonthly.fundsRateMonthlyIncrease : null,
    fundsRateMonthlyDecrease: indicatorMonthly ? indicatorMonthly.fundsRateMonthlyDecrease : null,
    thirtyYearsTreasuryMonthlyIncrease: indicatorMonthly ? indicatorMonthly.thirtyYearsTreasuryMonthlyIncrease : null,
    thirtyYearsTreasuryMonthlyDecrease: indicatorMonthly ? indicatorMonthly.thirtyYearsTreasuryMonthlyDecrease : null,
    tenYearsTreasuryMonthlyIncrease: indicatorMonthly ? indicatorMonthly.tenYearsTreasuryMonthlyIncrease : null,
    tenYearsTreasuryMonthlyDecrease: indicatorMonthly ? indicatorMonthly.tenYearsTreasuryMonthlyDecrease : null,
    inflationMonthlyIncrease: indicatorMonthly ? indicatorMonthly.inflationMonthlyIncrease : null,
    inflationMonthlyDecrease: indicatorMonthly ? indicatorMonthly.inflationMonthlyDecrease : null,
    cpiMonthlyIncrease: indicatorMonthly ? indicatorMonthly.cpiMonthlyIncrease : null,
    cpiMonthlyDecrease: indicatorMonthly ? indicatorMonthly.cpiMonthlyDecrease : null,
    consumerSentimentMonthlyIncrease: indicatorMonthly ? indicatorMonthly.consumerSentimentMonthlyIncrease : null,
    consumerSentimentMonthlyDecrease: indicatorMonthly ? indicatorMonthly.consumerSentimentMonthlyDecrease : null,
    retailSalesMonthlyIncrease: indicatorMonthly ? indicatorMonthly.retailSalesMonthlyIncrease : null,
    retailSalesMonthlyDecrease: indicatorMonthly ? indicatorMonthly.retailSalesMonthlyDecrease : null,
    durableGoodsMonthlyIncrease: indicatorMonthly ? indicatorMonthly.durableGoodsMonthlyIncrease : null,
    durableGoodsMonthlyDecrease: indicatorMonthly ? indicatorMonthly.durableGoodsMonthlyDecrease : null,
    unemployeementRateMonthlyIncrease: indicatorMonthly ? indicatorMonthly.unemployeementRateMonthlyIncrease : null,
    unemployeementRateMonthlyDecrease: indicatorMonthly ? indicatorMonthly.unemployeementRateMonthlyDecrease : null,
    nonfarmPayrollMonthlyIncrease: indicatorMonthly ? indicatorMonthly.nonfarmPayrollMonthlyIncrease : null,
    nonfarmPayrollMonthlyDecrease: indicatorMonthly ? indicatorMonthly.nonfarmPayrollMonthlyDecrease : null,
  }
}

export const getPriceMovementBuyWeights = (
  pattern: interfaces.traderPatternModel.Record,
  tickerDaily: tickerDailyModel.Record,
  tickerQuarterly: tickerQuarterlyModel.Record | null,
  tickerYearly: tickerYearlyModel.Record | null,
  indicatorMonthly: indicatorMonthlyModel.Record | null,
  indicatorQuarterly: indicatorQuarterlyModel.Record | null,
  indicatorYearly: indicatorYearlyModel.Record | null,
): number => {
  const MOVEMENT_TRIGGERS: {
    [key in interfaces.traderPatternModel.MovementBuyBehavior]: MovementKey
  } = {
    priceDailyIncreaseBuy: 'priceDailyIncrease',
    priceDailyDecreaseBuy: 'priceDailyDecrease',
    priceWeeklyIncreaseBuy: 'priceWeeklyIncrease',
    priceWeeklyDecreaseBuy: 'priceWeeklyDecrease',
    priceMonthlyIncreaseBuy: 'priceMonthlyIncrease',
    priceMonthlyDecreaseBuy: 'priceMonthlyDecrease',
    priceQuarterlyIncreaseBuy: 'priceQuarterlyIncrease',
    priceQuarterlyDecreaseBuy: 'priceQuarterlyDecrease',
    priceYearlyIncreaseBuy: 'priceYearlyIncrease',
    priceYearlyDecreaseBuy: 'priceYearlyDecrease',
    epsQuarterlyBeatsBuy: 'epsQuarterlyBeats',
    epsQuarterlyMissBuy: 'epsQuarterlyMiss',
    profitQuarterlyIncreaseBuy: 'profitQuarterlyIncrease',
    profitQuarterlyDecreaseBuy: 'profitQuarterlyDecrease',
    incomeQuarterlyIncreaseBuy: 'incomeQuarterlyIncrease',
    incomeQuarterlyDecreaseBuy: 'incomeQuarterlyDecrease',
    revenueQuarterlyIncreaseBuy: 'revenueQuarterlyIncrease',
    revenueQuarterlyDecreaseBuy: 'revenueQuarterlyDecrease',
    profitYearlyIncreaseBuy: 'profitYearlyIncrease',
    profitYearlyDecreaseBuy: 'profitYearlyDecrease',
    incomeYearlyIncreaseBuy: 'incomeYearlyIncrease',
    incomeYearlyDecreaseBuy: 'incomeYearlyDecrease',
    revenueYearlyIncreaseBuy: 'revenueYearlyIncrease',
    revenueYearlyDecreaseBuy: 'revenueYearlyDecrease',
    inflationYearlyIncreaseBuy: 'inflationMonthlyIncrease',
    inflationYearlyDecreaseBuy: 'inflationYearlyDecrease',
    fundsRateMonthlyIncreaseBuy: 'fundsRateMonthlyIncrease',
    fundsRateMonthlyDecreaseBuy: 'fundsRateMonthlyDecrease',
    thirtyYearsTreasuryMonthlyIncreaseBuy: 'thirtyYearsTreasuryMonthlyIncrease',
    thirtyYearsTreasuryMonthlyDecreaseBuy: 'thirtyYearsTreasuryMonthlyDecrease',
    tenYearsTreasuryMonthlyIncreaseBuy: 'tenYearsTreasuryMonthlyIncrease',
    tenYearsTreasuryMonthlyDecreaseBuy: 'tenYearsTreasuryMonthlyDecrease',
    inflationMonthlyIncreaseBuy: 'inflationMonthlyIncrease',
    inflationMonthlyDecreaseBuy: 'inflationMonthlyDecrease',
    cpiMonthlyIncreaseBuy: 'cpiMonthlyIncrease',
    cpiMonthlyDecreaseBuy: 'cpiMonthlyDecrease',
    consumerSentimentMonthlyIncreaseBuy: 'consumerSentimentMonthlyIncrease',
    consumerSentimentMonthlyDecreaseBuy: 'consumerSentimentMonthlyDecrease',
    retailSalesMonthlyIncreaseBuy: 'retailSalesMonthlyIncrease',
    retailSalesMonthlyDecreaseBuy: 'retailSalesMonthlyDecrease',
    durableGoodsMonthlyIncreaseBuy: 'durableGoodsMonthlyIncrease',
    durableGoodsMonthlyDecreaseBuy: 'durableGoodsMonthlyDecrease',
    unemployeementRateMonthlyIncreaseBuy: 'unemployeementRateMonthlyIncrease',
    unemployeementRateMonthlyDecreaseBuy: 'unemployeementRateMonthlyDecrease',
    nonfarmPayrollMonthlyIncreaseBuy: 'nonfarmPayrollMonthlyIncrease',
    nonfarmPayrollMonthlyDecreaseBuy: 'nonfarmPayrollMonthlyDecrease',
  }

  const COMPARE_TRIGGERS: {
    [key in interfaces.traderPatternModel.CompareBuyBehavior]: CompareKey
  } = {
    gdpYearlyChangeAboveBuy: 'gdpYearlyChangePercent',
    gdpYearlyChangeBelowBuy: 'gdpYearlyChangePercent',
    gdpQuarterlyChangeAboveBuy: 'gdpQuarterlyChangePercent',
    gdpQuarterlyChangeBelowBuy: 'gdpQuarterlyChangePercent',
    gdpQuarterlyYoYChangeAboveBuy: 'gdpQuarterlyChangePercent',
    gdpQuarterlyYoYChangeBelowBuy: 'gdpQuarterlyChangePercent',
  }

  const tickerInfo = buildInitialTickerInfo(
    tickerDaily, tickerQuarterly, tickerYearly, indicatorMonthly, indicatorQuarterly, indicatorYearly,
  )
  const movementTriggers = Object.keys(MOVEMENT_TRIGGERS) as Array<keyof typeof MOVEMENT_TRIGGERS>
  const compareTriggers = Object.keys(COMPARE_TRIGGERS) as Array<keyof typeof COMPARE_TRIGGERS>

  const movementWeights = movementTriggers.reduce((
    weights: number, behavior,
  ): number => {
    const tickerKey = MOVEMENT_TRIGGERS[behavior]
    const tickerValue = tickerInfo[tickerKey]
    const patternValue = pattern[behavior]

    if (!patternValue) return weights
    if (!tickerValue || tickerValue < patternValue) return 0
    return weights * (tickerValue - patternValue + 2)
  }, 1)

  const compareWeights = compareTriggers.reduce((
    weights: number, behavior,
  ): number => {
    const tickerKey = COMPARE_TRIGGERS[behavior]
    const tickerValue = tickerInfo[tickerKey]
    const patternValue = pattern[behavior]

    if (patternValue === null) return weights
    if (behavior.includes('Above') && tickerValue && tickerValue > patternValue) {
      return weights * (tickerValue - patternValue + 2)
    }

    if (behavior.includes('Below') && tickerValue && tickerValue < patternValue) {
      return weights * (tickerValue - patternValue + 2)
    }

    return 0
  }, 1)

  if (!movementWeights || !compareWeights) return 0

  return movementWeights * compareWeights
}

export const getPriceMovementSellWeights = (
  pattern: interfaces.traderPatternModel.Record,
  tickerDaily: tickerDailyModel.Record,
  tickerQuarterly: tickerQuarterlyModel.Record | null,
  tickerYearly: tickerYearlyModel.Record | null,
  indicatorMonthly: indicatorMonthlyModel.Record | null,
  indicatorQuarterly: indicatorQuarterlyModel.Record | null,
  indicatorYearly: indicatorYearlyModel.Record | null,
): number => {
  const MOVEMENT_TRIGGERS: {
    [key in interfaces.traderPatternModel.MovementSellBehavior]: MovementKey
  } = {
    priceDailyIncreaseSell: 'priceDailyIncrease',
    priceDailyDecreaseSell: 'priceDailyDecrease',
    priceWeeklyIncreaseSell: 'priceWeeklyIncrease',
    priceWeeklyDecreaseSell: 'priceWeeklyDecrease',
    priceMonthlyIncreaseSell: 'priceMonthlyIncrease',
    priceMonthlyDecreaseSell: 'priceMonthlyDecrease',
    priceQuarterlyIncreaseSell: 'priceQuarterlyIncrease',
    priceQuarterlyDecreaseSell: 'priceQuarterlyDecrease',
    priceYearlyIncreaseSell: 'priceYearlyIncrease',
    priceYearlyDecreaseSell: 'priceYearlyDecrease',
    epsQuarterlyBeatsSell: 'epsQuarterlyBeats',
    epsQuarterlyMissSell: 'epsQuarterlyMiss',
    profitQuarterlyIncreaseSell: 'profitQuarterlyIncrease',
    profitQuarterlyDecreaseSell: 'profitQuarterlyDecrease',
    incomeQuarterlyIncreaseSell: 'incomeQuarterlyIncrease',
    incomeQuarterlyDecreaseSell: 'incomeQuarterlyDecrease',
    revenueQuarterlyIncreaseSell: 'revenueQuarterlyIncrease',
    revenueQuarterlyDecreaseSell: 'revenueQuarterlyDecrease',
    profitYearlyIncreaseSell: 'profitYearlyIncrease',
    profitYearlyDecreaseSell: 'profitYearlyDecrease',
    incomeYearlyIncreaseSell: 'incomeYearlyIncrease',
    incomeYearlyDecreaseSell: 'incomeYearlyDecrease',
    revenueYearlyIncreaseSell: 'revenueYearlyIncrease',
    revenueYearlyDecreaseSell: 'revenueYearlyDecrease',
    inflationYearlyIncreaseSell: 'inflationYearlyIncrease',
    inflationYearlyDecreaseSell: 'inflationYearlyDecrease',
    fundsRateMonthlyIncreaseSell: 'fundsRateMonthlyIncrease',
    fundsRateMonthlyDecreaseSell: 'fundsRateMonthlyDecrease',
    thirtyYearsTreasuryMonthlyIncreaseSell: 'thirtyYearsTreasuryMonthlyIncrease',
    thirtyYearsTreasuryMonthlyDecreaseSell: 'thirtyYearsTreasuryMonthlyDecrease',
    tenYearsTreasuryMonthlyIncreaseSell: 'tenYearsTreasuryMonthlyIncrease',
    tenYearsTreasuryMonthlyDecreaseSell: 'tenYearsTreasuryMonthlyDecrease',
    inflationMonthlyIncreaseSell: 'inflationMonthlyIncrease',
    inflationMonthlyDecreaseSell: 'inflationMonthlyDecrease',
    cpiMonthlyIncreaseSell: 'cpiMonthlyIncrease',
    cpiMonthlyDecreaseSell: 'cpiMonthlyDecrease',
    consumerSentimentMonthlyIncreaseSell: 'consumerSentimentMonthlyIncrease',
    consumerSentimentMonthlyDecreaseSell: 'consumerSentimentMonthlyDecrease',
    retailSalesMonthlyIncreaseSell: 'retailSalesMonthlyIncrease',
    retailSalesMonthlyDecreaseSell: 'retailSalesMonthlyDecrease',
    durableGoodsMonthlyIncreaseSell: 'durableGoodsMonthlyIncrease',
    durableGoodsMonthlyDecreaseSell: 'durableGoodsMonthlyDecrease',
    unemployeementRateMonthlyIncreaseSell: 'unemployeementRateMonthlyIncrease',
    unemployeementRateMonthlyDecreaseSell: 'unemployeementRateMonthlyDecrease',
    nonfarmPayrollMonthlyIncreaseSell: 'nonfarmPayrollMonthlyIncrease',
    nonfarmPayrollMonthlyDecreaseSell: 'nonfarmPayrollMonthlyDecrease',
  }

  const COMPARE_TRIGGERS: {
    [key in interfaces.traderPatternModel.CompareSellBehavior]: CompareKey
  } = {
    gdpYearlyChangeAboveSell: 'gdpYearlyChangePercent',
    gdpYearlyChangeBelowSell: 'gdpYearlyChangePercent',
    gdpQuarterlyChangeAboveSell: 'gdpQuarterlyChangePercent',
    gdpQuarterlyChangeBelowSell: 'gdpQuarterlyChangePercent',
    gdpQuarterlyYoYChangeAboveSell: 'gdpQuarterlyYoYChangePercent',
    gdpQuarterlyYoYChangeBelowSell: 'gdpQuarterlyYoYChangePercent',
  }

  const tickerInfo = buildInitialTickerInfo(
    tickerDaily, tickerQuarterly, tickerYearly, indicatorMonthly, indicatorQuarterly, indicatorYearly,
  )
  const movementTriggers = Object.keys(MOVEMENT_TRIGGERS) as Array<keyof typeof MOVEMENT_TRIGGERS>
  const compareTriggers = Object.keys(COMPARE_TRIGGERS) as Array<keyof typeof COMPARE_TRIGGERS>

  const movementWeights = movementTriggers.reduce((
    weights: number, behavior,
  ): number => {
    const tickerKey = MOVEMENT_TRIGGERS[behavior]
    const tickerValue = tickerInfo[tickerKey]
    const patternValue = pattern[behavior]

    if (!patternValue) return weights
    if (!tickerValue || tickerValue < patternValue) return 0
    return weights * (tickerValue - patternValue + 2)
  }, 1)

  const compareWeights = compareTriggers.reduce((
    weights: number, behavior,
  ): number => {
    const tickerKey = COMPARE_TRIGGERS[behavior]
    const tickerValue = tickerInfo[tickerKey]
    const patternValue = pattern[behavior]

    if (patternValue === null) return weights
    if (behavior.includes('Above') && tickerValue && tickerValue > patternValue) {
      return weights * (tickerValue - patternValue + 2)
    }

    if (behavior.includes('Below') && tickerValue && tickerValue < patternValue) {
      return weights * (tickerValue - patternValue + 2)
    }

    return 0
  }, 1)

  if (!movementWeights || !compareWeights) return 0

  return movementWeights * compareWeights
}

export const getTickerPreferValue = (
  preference: number,
  tickerDaily: tickerDailyModel.Record,
  tickerQuarterly: tickerQuarterlyModel.Record | null,
  tickerYearly: tickerYearlyModel.Record | null,
): number | null => {
  switch (preference) {
    case patternEnums.PREFERENCE.HIGHER_PRICE:
    case patternEnums.PREFERENCE.LOWER_PRICE:
      return tickerDaily.closePrice
    case patternEnums.PREFERENCE.HIGHER_QUARTER_EPS:
    case patternEnums.PREFERENCE.LOWER_QUARTER_EPS:
      return tickerQuarterly ? tickerQuarterly.eps : null
    case patternEnums.PREFERENCE.HIGHER_QUARTER_EBITDA:
    case patternEnums.PREFERENCE.LOWER_QUARTER_EBITDA:
      return tickerQuarterly ? tickerQuarterly.ebitda : null
    case patternEnums.PREFERENCE.HIGHER_QUARTER_INCOME:
    case patternEnums.PREFERENCE.LOWER_QUARTER_INCOME:
      return tickerQuarterly ? tickerQuarterly.netIncome : null
    case patternEnums.PREFERENCE.HIGHER_QUARTER_PROFIT:
    case patternEnums.PREFERENCE.LOWER_QUARTER_PROFIT:
      return tickerQuarterly ? tickerQuarterly.grossProfit : null
    case patternEnums.PREFERENCE.HIGHER_QUARTER_REVENUE:
    case patternEnums.PREFERENCE.LOWER_QUARTER_REVENUE:
      return tickerQuarterly ? tickerQuarterly.totalRevenue : null
    case patternEnums.PREFERENCE.HIGHER_YEAR_EPS:
    case patternEnums.PREFERENCE.LOWER_YEAR_EPS:
      return tickerYearly ? tickerYearly.eps : null
    case patternEnums.PREFERENCE.HIGHER_YEAR_EBITDA:
    case patternEnums.PREFERENCE.LOWER_YEAR_EBITDA:
      return tickerYearly ? tickerYearly.ebitda : null
    case patternEnums.PREFERENCE.HIGHER_YEAR_INCOME:
    case patternEnums.PREFERENCE.LOWER_YEAR_INCOME:
      return tickerYearly ? tickerYearly.netIncome : null
    case patternEnums.PREFERENCE.HIGHER_YEAR_PROFIT:
    case patternEnums.PREFERENCE.LOWER_YEAR_PROFIT:
      return tickerYearly ? tickerYearly.grossProfit : null
    case patternEnums.PREFERENCE.HIGHER_YEAR_REVENUE:
    case patternEnums.PREFERENCE.LOWER_YEAR_REVENUE:
      return tickerYearly ? tickerYearly.totalRevenue : null
    default:
      return null
  }
}

export const getPatternHashCode = (
  pattern: interfaces.traderPatternModel.Record | interfaces.traderPatternModel.Create,
): string => {
  const template = BEHAVIOR_GROUPS.map((group) => group.map((behavior) => pattern[behavior]))
  return generateTool.toSHA512(JSON.stringify(template))
}

export const groupPatternCouples = (
  traders: interfaces.traderModel.Record[],
): interfaces.traderModel.Record[][] => {
  return traders.reduce((couples: interfaces.traderModel.Record[][], trader, index) => {
    if (index % 2 === 0) {
      return [...couples, [trader]]
    }

    const lastCouple = [...couples[couples.length - 1], trader]
    return couples.map((couple, i) => i === couples.length - 1 ? lastCouple : couple)
  }, [])
}

const pickTradingPatterns = (
  behaviorTypes: interfaces.traderPatternModel.BehaviorType[],
  first: interfaces.traderPatternModel.Record,
  second: interfaces.traderPatternModel.Record,
): Behavior[] => {
  const allValues = behaviorTypes.reduce((
    values: Behavior[], type: interfaces.traderPatternModel.BehaviorType,
  ): Behavior[] => {
    if (first[type]) return [...values, { type, value: first[type]! }]
    if (second[type]) return [...values, { type, value: second[type]! }]
    return values
  }, [])
  const remainingTotal = Math.floor(allValues.length / 2) || 1
  const chanceOfStay = remainingTotal * 100 / allValues.length
  const subValues = allValues.reduce((values: Behavior[], value: Behavior) => {
    const shouldStay = generateTool.pickNumberInRange(1, 100) <= chanceOfStay
    const hasRoom = values.length < remainingTotal
    if (shouldStay && hasRoom) return [...values, value]
    return values
  }, [])

  if (!subValues.length) {
    const index = generateTool.pickNumberInRange(0, allValues.length - 1)
    subValues.push(allValues[index])
  }

  return subValues
}

export const generatePatternChild = (
  first: interfaces.traderPatternModel.Record,
  second: interfaces.traderPatternModel.Record,
  shouldMutation: boolean = false,
) => {
  const newChild: interfaces.traderPatternModel.Create = {
    hashCode: '',
    accessCode: '',
    priceDailyIncreaseBuy: null,
    priceDailyIncreaseSell: null,
    priceDailyDecreaseBuy: null,
    priceDailyDecreaseSell: null,
    priceWeeklyIncreaseBuy: null,
    priceWeeklyIncreaseSell: null,
    priceWeeklyDecreaseBuy: null,
    priceWeeklyDecreaseSell: null,
    priceMonthlyIncreaseBuy: null,
    priceMonthlyIncreaseSell: null,
    priceMonthlyDecreaseBuy: null,
    priceMonthlyDecreaseSell: null,
    priceQuarterlyIncreaseBuy: null,
    priceQuarterlyIncreaseSell: null,
    priceQuarterlyDecreaseBuy: null,
    priceQuarterlyDecreaseSell: null,
    priceYearlyIncreaseBuy: null,
    priceYearlyIncreaseSell: null,
    priceYearlyDecreaseBuy: null,
    priceYearlyDecreaseSell: null,
    epsQuarterlyBeatsBuy: null,
    epsQuarterlyMissBuy: null,
    epsQuarterlyBeatsSell: null,
    epsQuarterlyMissSell: null,
    profitQuarterlyIncreaseBuy: null,
    profitQuarterlyDecreaseBuy: null,
    incomeQuarterlyIncreaseBuy: null,
    incomeQuarterlyDecreaseBuy: null,
    revenueQuarterlyIncreaseBuy: null,
    revenueQuarterlyDecreaseBuy: null,
    profitQuarterlyIncreaseSell: null,
    profitQuarterlyDecreaseSell: null,
    incomeQuarterlyIncreaseSell: null,
    incomeQuarterlyDecreaseSell: null,
    revenueQuarterlyIncreaseSell: null,
    revenueQuarterlyDecreaseSell: null,
    profitYearlyIncreaseBuy: null,
    profitYearlyDecreaseBuy: null,
    incomeYearlyIncreaseBuy: null,
    incomeYearlyDecreaseBuy: null,
    revenueYearlyIncreaseBuy: null,
    revenueYearlyDecreaseBuy: null,
    profitYearlyIncreaseSell: null,
    profitYearlyDecreaseSell: null,
    incomeYearlyIncreaseSell: null,
    incomeYearlyDecreaseSell: null,
    revenueYearlyIncreaseSell: null,
    revenueYearlyDecreaseSell: null,
    inflationYearlyIncreaseBuy: null,
    inflationYearlyDecreaseBuy: null,
    inflationYearlyIncreaseSell: null,
    inflationYearlyDecreaseSell: null,
    fundsRateMonthlyIncreaseBuy: null,
    fundsRateMonthlyDecreaseBuy: null,
    fundsRateMonthlyIncreaseSell: null,
    fundsRateMonthlyDecreaseSell: null,
    thirtyYearsTreasuryMonthlyIncreaseBuy: null,
    thirtyYearsTreasuryMonthlyDecreaseBuy: null,
    thirtyYearsTreasuryMonthlyIncreaseSell: null,
    thirtyYearsTreasuryMonthlyDecreaseSell: null,
    tenYearsTreasuryMonthlyIncreaseBuy: null,
    tenYearsTreasuryMonthlyDecreaseBuy: null,
    tenYearsTreasuryMonthlyIncreaseSell: null,
    tenYearsTreasuryMonthlyDecreaseSell: null,
    inflationMonthlyIncreaseBuy: null,
    inflationMonthlyDecreaseBuy: null,
    inflationMonthlyIncreaseSell: null,
    inflationMonthlyDecreaseSell: null,
    cpiMonthlyIncreaseBuy: null,
    cpiMonthlyDecreaseBuy: null,
    cpiMonthlyIncreaseSell: null,
    cpiMonthlyDecreaseSell: null,
    consumerSentimentMonthlyIncreaseBuy: null,
    consumerSentimentMonthlyDecreaseBuy: null,
    consumerSentimentMonthlyIncreaseSell: null,
    consumerSentimentMonthlyDecreaseSell: null,
    retailSalesMonthlyIncreaseBuy: null,
    retailSalesMonthlyDecreaseBuy: null,
    retailSalesMonthlyIncreaseSell: null,
    retailSalesMonthlyDecreaseSell: null,
    durableGoodsMonthlyIncreaseBuy: null,
    durableGoodsMonthlyDecreaseBuy: null,
    durableGoodsMonthlyIncreaseSell: null,
    durableGoodsMonthlyDecreaseSell: null,
    unemployeementRateMonthlyIncreaseBuy: null,
    unemployeementRateMonthlyDecreaseBuy: null,
    unemployeementRateMonthlyIncreaseSell: null,
    unemployeementRateMonthlyDecreaseSell: null,
    nonfarmPayrollMonthlyIncreaseBuy: null,
    nonfarmPayrollMonthlyDecreaseBuy: null,
    nonfarmPayrollMonthlyIncreaseSell: null,
    nonfarmPayrollMonthlyDecreaseSell: null,
    gdpYearlyChangeAboveBuy: null,
    gdpYearlyChangeAboveSell: null,
    gdpYearlyChangeBelowBuy: null,
    gdpYearlyChangeBelowSell: null,
    gdpQuarterlyChangeAboveBuy: null,
    gdpQuarterlyChangeAboveSell: null,
    gdpQuarterlyChangeBelowBuy: null,
    gdpQuarterlyChangeBelowSell: null,
    gdpQuarterlyYoYChangeAboveBuy: null,
    gdpQuarterlyYoYChangeAboveSell: null,
    gdpQuarterlyYoYChangeBelowBuy: null,
    gdpQuarterlyYoYChangeBelowSell: null,
    cashMaxPercent: generateTool.pickOneNumber(first.cashMaxPercent, second.cashMaxPercent),
    tickerMinPercent: generateTool.pickOneNumber(first.tickerMinPercent, second.tickerMinPercent),
    tickerMaxPercent: generateTool.pickOneNumber(first.tickerMaxPercent, second.tickerMaxPercent),
    holdingBuyPercent: generateTool.pickOneNumber(first.holdingBuyPercent, second.holdingBuyPercent),
    holdingSellPercent: generateTool.pickOneNumber(first.holdingSellPercent, second.holdingSellPercent),
    tradeFrequency: generateTool.pickOneNumber(first.tradeFrequency, second.tradeFrequency),
    rebalanceFrequency: generateTool.pickOneNumber(first.rebalanceFrequency, second.rebalanceFrequency),
    buyPreference: generateTool.pickOneNumber(first.buyPreference, second.buyPreference),
    sellPreference: generateTool.pickOneNumber(first.sellPreference, second.sellPreference),
  }

  const buyBehaviorKeys = BEHAVIOR_GROUPS[0]
  const childBuyBehaviors = pickTradingPatterns(buyBehaviorKeys, first, second)
  childBuyBehaviors.forEach((behavior) => {
    newChild[behavior.type] = newChild[behavior.type]
      ? generateTool.pickOneNumber(behavior.value, newChild[behavior.type]!)
      : behavior.value
  })

  const sellBehaviorKeys = BEHAVIOR_GROUPS[1]
  const childSellBehaviors = pickTradingPatterns(sellBehaviorKeys, first, second)
  childSellBehaviors.forEach((behavior) => {
    newChild[behavior.type] = newChild[behavior.type]
      ? generateTool.pickOneNumber(behavior.value, newChild[behavior.type]!)
      : behavior.value
  })

  if (shouldMutation) {
    const potentialKeys = Object.keys(BEHAVIOR_VALUES) as Array<keyof typeof BEHAVIOR_VALUES>
    const keyIndex = generateTool.pickNumberInRange(0, potentialKeys.length - 1)
    const behaviorKey = potentialKeys[keyIndex]
    const potentialValues = BEHAVIOR_VALUES[behaviorKey]
    const valueIndex = generateTool.pickNumberInRange(0, potentialValues.length - 1)
    const behaviorValue = potentialValues[valueIndex]
    newChild[behaviorKey] = behaviorValue
  }

  newChild.hashCode = getPatternHashCode(newChild)
  newChild.accessCode = newChild.hashCode.substring(0, 10)

  return newChild
}
