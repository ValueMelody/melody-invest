import * as geneEnums from '../enums/gene'
import * as traderDNAModel from '../models/traderDNA'
import * as tickerDailyModel from '../models/tickerDaily'
import * as tickerQuarterlyModel from '../models/tickerQuarterly'
import * as tickerYearlyModel from '../models/tickerYearly'

const GENE_VALUES = {
  priceDailyIncreaseBuy: [...geneEnums.VALUES.PRICE_DAILY_VALUES],
  priceDailyIncreaseSell: [...geneEnums.VALUES.PRICE_DAILY_VALUES],
  priceDailyDecreaseBuy: [...geneEnums.VALUES.PRICE_DAILY_VALUES],
  priceDailyDecreaseSell: [...geneEnums.VALUES.PRICE_DAILY_VALUES],
  priceWeeklyIncreaseBuy: [...geneEnums.VALUES.PRICE_WEEKLY_VALUES],
  priceWeeklyIncreaseSell: [...geneEnums.VALUES.PRICE_WEEKLY_VALUES],
  priceWeeklyDecreaseBuy: [...geneEnums.VALUES.PRICE_WEEKLY_VALUES],
  priceWeeklyDecreaseSell: [...geneEnums.VALUES.PRICE_WEEKLY_VALUES],
  priceMonthlyIncreaseBuy: [...geneEnums.VALUES.PRICE_MONTHLY_VALUES],
  priceMonthlyIncreaseSell: [...geneEnums.VALUES.PRICE_MONTHLY_VALUES],
  priceMonthlyDecreaseBuy: [...geneEnums.VALUES.PRICE_MONTHLY_VALUES],
  priceMonthlyDecreaseSell: [...geneEnums.VALUES.PRICE_MONTHLY_VALUES],
  priceQuarterlyIncreaseBuy: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  priceQuarterlyIncreaseSell: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  priceQuarterlyDecreaseBuy: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  priceQuarterlyDecreaseSell: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  priceYearlyIncreaseBuy: [...geneEnums.VALUES.PRICE_YEARLY_VALUES],
  priceYearlyIncreaseSell: [...geneEnums.VALUES.PRICE_YEARLY_VALUES],
  priceYearlyDecreaseBuy: [...geneEnums.VALUES.PRICE_YEARLY_VALUES],
  priceYearlyDecreaseSell: [...geneEnums.VALUES.PRICE_YEARLY_VALUES],
  epsQuarterlyBeatsBuy: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  epsQuarterlyMissBuy: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  epsQuarterlyBeatsSell: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  epsQuarterlyMissSell: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  profitQuarterlyIncreaseBuy: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  profitQuarterlyIncreaseSell: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  profitQuarterlyDecreaseBuy: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  profitQuarterlyDecreaseSell: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  incomeQuarterlyIncreaseBuy: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  incomeQuarterlyIncreaseSell: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  incomeQuarterlyDecreaseBuy: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  incomeQuarterlyDecreaseSell: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  revenueQuarterlyIncreaseBuy: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  revenueQuarterlyIncreaseSell: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  revenueQuarterlyDecreaseBuy: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  revenueQuarterlyDecreaseSell: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  profitYearlyIncreaseBuy: [...geneEnums.VALUES.PRICE_YEARLY_VALUES],
  profitYearlyIncreaseSell: [...geneEnums.VALUES.PRICE_YEARLY_VALUES],
  profitYearlyDecreaseBuy: [...geneEnums.VALUES.PRICE_YEARLY_VALUES],
  profitYearlyDecreaseSell: [...geneEnums.VALUES.PRICE_YEARLY_VALUES],
  incomeYearlyIncreaseBuy: [...geneEnums.VALUES.PRICE_YEARLY_VALUES],
  incomeYearlyIncreaseSell: [...geneEnums.VALUES.PRICE_YEARLY_VALUES],
  incomeYearlyDecreaseBuy: [...geneEnums.VALUES.PRICE_YEARLY_VALUES],
  incomeYearlyDecreaseSell: [...geneEnums.VALUES.PRICE_YEARLY_VALUES],
  revenueYearlyIncreaseBuy: [...geneEnums.VALUES.PRICE_YEARLY_VALUES],
  revenueYearlyIncreaseSell: [...geneEnums.VALUES.PRICE_YEARLY_VALUES],
  revenueYearlyDecreaseBuy: [...geneEnums.VALUES.PRICE_YEARLY_VALUES],
  revenueYearlyDecreaseSell: [...geneEnums.VALUES.PRICE_YEARLY_VALUES],
  cashMaxPercent: [...geneEnums.VALUES.CASH_MAX_PERCENT],
  tickerMinPercent: [...geneEnums.VALUES.PORTFOLIO_PERCENT],
  tickerMaxPercent: [...geneEnums.VALUES.PORTFOLIO_PERCENT],
  holdingBuyPercent: [...geneEnums.VALUES.PORTFOLIO_PERCENT],
  holdingSellPercent: [...geneEnums.VALUES.HOLDING_PERCENT],
  tradeFrequency: [...geneEnums.VALUES.TRADE_FREQUENCY],
  rebalanceFrequency: [...geneEnums.VALUES.REBALANCE_FREQUENCY],
}

const GENE_GROUPS: traderDNAModel.GeneType[][] = [
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
  ],
  ['cashMaxPercent'],
  ['tickerMinPercent'],
  ['tickerMaxPercent'],
  ['holdingBuyPercent'],
  ['holdingSellPercent'],
  ['tradeFrequency'],
  ['rebalanceFrequency'],
]

interface Gene {
  type: traderDNAModel.GeneType;
  value: number;
}

type MovementKey =
  tickerDailyModel.MovementKey | tickerQuarterlyModel.MovementKey | tickerYearlyModel.MovementKey

export const getGeneGroups = () => (
  GENE_GROUPS.map((group) => (
    group.reduce((allValues: Gene[], type) => {
      const geneValues: number[] = GENE_VALUES[type]
      const genes = geneValues.map((value: number) => ({
        type, value,
      }))
      return [...allValues, ...genes]
    }, [])
  ))
)

export const getPriceMovementBuyWeights = (
  dna: traderDNAModel.Record,
  tickerDaily: tickerDailyModel.Record,
  tickerQuarterly?: tickerQuarterlyModel.Record,
  tickerYearly?: tickerYearlyModel.Record,
): number => {
  const GENE_TRIGGERS: {
    [key in traderDNAModel.BuyGene]: MovementKey
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
  }

  const tickerInfo = {
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
  }
  const geneTriggerKeys = Object.keys(GENE_TRIGGERS) as Array<keyof typeof GENE_TRIGGERS>

  const weights = geneTriggerKeys.reduce((
    weights: number, gene,
  ): number => {
    const tickerKey = GENE_TRIGGERS[gene]
    const tickerValue = tickerInfo[tickerKey]
    const dnaValue = dna[gene]

    if (!dnaValue) return weights
    if (!tickerValue || tickerValue < dnaValue) return 0
    return weights * (tickerValue - dnaValue + 2)
  }, 1)

  return weights
}

export const getPriceMovementSellWeights = (
  dna: traderDNAModel.Record,
  tickerDaily: tickerDailyModel.Record,
  tickerQuarterly?: tickerQuarterlyModel.Record,
  tickerYearly?: tickerYearlyModel.Record,
): number => {
  const GENE_TRIGGERS: {
    [key in traderDNAModel.SellGene]: MovementKey
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
  }

  const tickerInfo = {
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
  }
  const geneTriggerKeys = Object.keys(GENE_TRIGGERS) as Array<keyof typeof GENE_TRIGGERS>

  const weights = geneTriggerKeys.reduce((
    weights: number, gene,
  ): number => {
    const tickerKey = GENE_TRIGGERS[gene]
    const tickerValue = tickerInfo[tickerKey]
    const dnaValue = dna[gene]

    if (!dnaValue) return weights
    if (!tickerValue || tickerValue < dnaValue) return 0
    return weights * (tickerValue - dnaValue + 2)
  }, 1)

  return weights
}

// export const getBaseDNAs = () => {
//   const genesInGroups = getGeneGroups()
//   const DNAs = genesInGroups.reduce((allDNAs: Gene[][], genesInGroup) => {
//     console.log(allDNAs.length)
//     if (allDNAs.length === 0) {
//       return genesInGroup.map((gene) => [gene])
//     }
//     return genesInGroup.reduce((newDNAS: Gene[][], gene) => {
//       const combos = allDNAs.map((combo) => [...combo, gene])
//       return [
//         ...newDNAS,
//         ...combos
//       ]
//     }, [])
//   }, [])
//   return DNAs
// }
