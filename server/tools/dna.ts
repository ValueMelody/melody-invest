import * as geneEnums from '../enums/gene'
import * as traderDNAModel from '../models/traderDNA'
import * as tickerDailyModel from '../models/tickerDaily'

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
  cashMaxPercent: [...geneEnums.VALUES.CASH_MAX_PERCENT],
  tickerMinPercent: [...geneEnums.VALUES.PORTFOLIO_PERCENT],
  tickerMaxPercent: [...geneEnums.VALUES.PORTFOLIO_PERCENT],
  holdingBuyPercent: [...geneEnums.VALUES.PORTFOLIO_PERCENT],
  holdingSellPercent: [...geneEnums.VALUES.HOLDING_PERCENT],
  tradeFrequency: [...geneEnums.VALUES.TRADE_FREQUENCY],
  rebalanceFrequency: [...geneEnums.VALUES.REBALANCE_FREQUENCY]
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
    'priceYearlyDecreaseBuy'
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
    'priceYearlyDecreaseSell'
  ],
  ['cashMaxPercent'],
  ['tickerMinPercent'],
  ['tickerMaxPercent'],
  ['holdingBuyPercent'],
  ['holdingSellPercent'],
  ['tradeFrequency'],
  ['rebalanceFrequency']
]

interface Gene {
  type: traderDNAModel.GeneType;
  value: number;
}

export const getGeneGroups = () => (
  GENE_GROUPS.map((group) => (
    group.reduce((allValues: Gene[], type) => {
      const geneValues: number[] = GENE_VALUES[type]
      const genes = geneValues.map((value: number) => ({
        type, value
      }))
      return [...allValues, ...genes]
    }, [])
  ))
)

export const getPriceMovementBuyWeights = (
  dna: traderDNAModel.traderDNA,
  tickerDaily: tickerDailyModel.TickerDaily
): number => {
  const GENE_TRIGGERS: {
    [key in traderDNAModel.BuyGene]: tickerDailyModel.TrendType
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
    priceYearlyDecreaseBuy: 'priceYearlyDecrease'
  }

  const geneTriggerKeys = Object.keys(GENE_TRIGGERS) as Array<keyof typeof GENE_TRIGGERS>

  const weights = geneTriggerKeys.reduce((
    weights: number, gene
  ): number => {
    const tickerKey = GENE_TRIGGERS[gene]
    const tickerValue = tickerDaily[tickerKey]
    const dnaValue = dna[gene]
    const combinedWeights = dnaValue !== null && tickerValue >= dnaValue
      ? (weights || 1) * (tickerValue - dnaValue + 2)
      : weights
    return combinedWeights
  }, 0)

  return weights
}

export const getPriceMovementSellWeights = (
  dna: traderDNAModel.traderDNA,
  tickerDaily: tickerDailyModel.TickerDaily
): number => {
  const GENE_TRIGGERS: {
    [key in traderDNAModel.SellGene]: tickerDailyModel.TrendType
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
    priceYearlyDecreaseSell: 'priceYearlyDecrease'
  }

  const geneTriggerKeys = Object.keys(GENE_TRIGGERS) as Array<keyof typeof GENE_TRIGGERS>

  const weights = geneTriggerKeys.reduce((
    weights: number, gene
  ): number => {
    const tickerKey = GENE_TRIGGERS[gene]
    const tickerValue = tickerDaily[tickerKey]
    const dnaValue = dna[gene]
    const combinedWeights = dnaValue !== null && tickerValue >= dnaValue
      ? (weights || 1) * (tickerValue - dnaValue + 2)
      : weights
    return combinedWeights
  }, 0)

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
