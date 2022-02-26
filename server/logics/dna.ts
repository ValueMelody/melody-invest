import * as geneEnums from '../enums/gene'
import * as traderModel from '../models/trader'
import * as traderDNAModel from '../models/traderDNA'
import * as tickerDailyModel from '../models/tickerDaily'
import * as tickerQuarterlyModel from '../models/tickerQuarterly'
import * as tickerYearlyModel from '../models/tickerYearly'
import * as generateTool from '../tools/generate'

const GENE_VALUES = {
  priceDailyIncreaseBuy: [...geneEnums.VALUES.MOVEMENT_VALUE],
  priceDailyIncreaseSell: [...geneEnums.VALUES.MOVEMENT_VALUE],
  priceDailyDecreaseBuy: [...geneEnums.VALUES.MOVEMENT_VALUE],
  priceDailyDecreaseSell: [...geneEnums.VALUES.MOVEMENT_VALUE],
  priceWeeklyIncreaseBuy: [...geneEnums.VALUES.MOVEMENT_VALUE],
  priceWeeklyIncreaseSell: [...geneEnums.VALUES.MOVEMENT_VALUE],
  priceWeeklyDecreaseBuy: [...geneEnums.VALUES.MOVEMENT_VALUE],
  priceWeeklyDecreaseSell: [...geneEnums.VALUES.MOVEMENT_VALUE],
  priceMonthlyIncreaseBuy: [...geneEnums.VALUES.MOVEMENT_VALUE],
  priceMonthlyIncreaseSell: [...geneEnums.VALUES.MOVEMENT_VALUE],
  priceMonthlyDecreaseBuy: [...geneEnums.VALUES.MOVEMENT_VALUE],
  priceMonthlyDecreaseSell: [...geneEnums.VALUES.MOVEMENT_VALUE],
  priceQuarterlyIncreaseBuy: [...geneEnums.VALUES.MOVEMENT_VALUE],
  priceQuarterlyIncreaseSell: [...geneEnums.VALUES.MOVEMENT_VALUE],
  priceQuarterlyDecreaseBuy: [...geneEnums.VALUES.MOVEMENT_VALUE],
  priceQuarterlyDecreaseSell: [...geneEnums.VALUES.MOVEMENT_VALUE],
  priceYearlyIncreaseBuy: [...geneEnums.VALUES.MOVEMENT_VALUE],
  priceYearlyIncreaseSell: [...geneEnums.VALUES.MOVEMENT_VALUE],
  priceYearlyDecreaseBuy: [...geneEnums.VALUES.MOVEMENT_VALUE],
  priceYearlyDecreaseSell: [...geneEnums.VALUES.MOVEMENT_VALUE],
  epsQuarterlyBeatsBuy: [...geneEnums.VALUES.MOVEMENT_VALUE],
  epsQuarterlyMissBuy: [...geneEnums.VALUES.MOVEMENT_VALUE],
  epsQuarterlyBeatsSell: [...geneEnums.VALUES.MOVEMENT_VALUE],
  epsQuarterlyMissSell: [...geneEnums.VALUES.MOVEMENT_VALUE],
  profitQuarterlyIncreaseBuy: [...geneEnums.VALUES.MOVEMENT_VALUE],
  profitQuarterlyIncreaseSell: [...geneEnums.VALUES.MOVEMENT_VALUE],
  profitQuarterlyDecreaseBuy: [...geneEnums.VALUES.MOVEMENT_VALUE],
  profitQuarterlyDecreaseSell: [...geneEnums.VALUES.MOVEMENT_VALUE],
  incomeQuarterlyIncreaseBuy: [...geneEnums.VALUES.MOVEMENT_VALUE],
  incomeQuarterlyIncreaseSell: [...geneEnums.VALUES.MOVEMENT_VALUE],
  incomeQuarterlyDecreaseBuy: [...geneEnums.VALUES.MOVEMENT_VALUE],
  incomeQuarterlyDecreaseSell: [...geneEnums.VALUES.MOVEMENT_VALUE],
  revenueQuarterlyIncreaseBuy: [...geneEnums.VALUES.MOVEMENT_VALUE],
  revenueQuarterlyIncreaseSell: [...geneEnums.VALUES.MOVEMENT_VALUE],
  revenueQuarterlyDecreaseBuy: [...geneEnums.VALUES.MOVEMENT_VALUE],
  revenueQuarterlyDecreaseSell: [...geneEnums.VALUES.MOVEMENT_VALUE],
  profitYearlyIncreaseBuy: [...geneEnums.VALUES.MOVEMENT_VALUE],
  profitYearlyIncreaseSell: [...geneEnums.VALUES.MOVEMENT_VALUE],
  profitYearlyDecreaseBuy: [...geneEnums.VALUES.MOVEMENT_VALUE],
  profitYearlyDecreaseSell: [...geneEnums.VALUES.MOVEMENT_VALUE],
  incomeYearlyIncreaseBuy: [...geneEnums.VALUES.MOVEMENT_VALUE],
  incomeYearlyIncreaseSell: [...geneEnums.VALUES.MOVEMENT_VALUE],
  incomeYearlyDecreaseBuy: [...geneEnums.VALUES.MOVEMENT_VALUE],
  incomeYearlyDecreaseSell: [...geneEnums.VALUES.MOVEMENT_VALUE],
  revenueYearlyIncreaseBuy: [...geneEnums.VALUES.MOVEMENT_VALUE],
  revenueYearlyIncreaseSell: [...geneEnums.VALUES.MOVEMENT_VALUE],
  revenueYearlyDecreaseBuy: [...geneEnums.VALUES.MOVEMENT_VALUE],
  revenueYearlyDecreaseSell: [...geneEnums.VALUES.MOVEMENT_VALUE],
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

export const getDNAHashCode = (
  dna: traderDNAModel.Record | traderDNAModel.Create
): string => {
  const template = GENE_GROUPS.map((group) => group.map((gene) => dna[gene]))
  return generateTool.toSHA512(JSON.stringify(template))
}

export const groupDNACouples = (traders: traderModel.Record[]): traderModel.Record[][] => {
  return traders.reduce((couples: traderModel.Record[][], trader, index) => {
    if (index % 2 === 0) {
      return [...couples, [trader]]
    }

    const lastCouple = [...couples[couples.length - 1], trader]
    return couples.map((couple, i) => i === couples.length - 1 ? lastCouple : couple)
  }, [])
}

const pickTradingGenes = (
  geneTypes: traderDNAModel.GeneType[],
  first: traderDNAModel.Record,
  second: traderDNAModel.Record,
): Gene[] => {
  const allValues = geneTypes.reduce((values: Gene[], type: traderDNAModel.GeneType): Gene[] => {
    if (first[type]) return [...values, { type, value: first[type]! }]
    if (second[type]) return [...values, { type, value: second[type]! }]
    return values
  }, [])
  const remainingTotal = Math.floor(allValues.length / 2) || 1
  const chanceOfStay = remainingTotal * 100 / allValues.length
  const subValues = allValues.reduce((values: Gene[], value: Gene) => {
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

export const generateDNAChild = (
  first: traderDNAModel.Record,
  second: traderDNAModel.Record,
  shouldMutation: boolean = false,
) => {
  const newChild: traderDNAModel.Create = {
    hashCode: '',
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
    cashMaxPercent: generateTool.pickOneNumber(first.cashMaxPercent, second.cashMaxPercent),
    tickerMinPercent: generateTool.pickOneNumber(first.tickerMinPercent, second.tickerMinPercent),
    tickerMaxPercent: generateTool.pickOneNumber(first.tickerMaxPercent, second.tickerMaxPercent),
    holdingBuyPercent: generateTool.pickOneNumber(first.holdingBuyPercent, second.holdingBuyPercent),
    holdingSellPercent: generateTool.pickOneNumber(first.holdingSellPercent, second.holdingSellPercent),
    tradeFrequency: generateTool.pickOneNumber(first.tradeFrequency, second.tradeFrequency),
    rebalanceFrequency: generateTool.pickOneNumber(first.rebalanceFrequency, second.rebalanceFrequency),
  }

  const buyGeneKeys = GENE_GROUPS[0]
  const childBuyGenes = pickTradingGenes(buyGeneKeys, first, second)
  childBuyGenes.forEach((gene) => {
    newChild[gene.type] = newChild[gene.type]
      ? generateTool.pickOneNumber(gene.value, newChild[gene.type]!)
      : gene.value
  })

  const sellGeneKeys = GENE_GROUPS[1]
  const childSellGenes = pickTradingGenes(sellGeneKeys, first, second)
  childSellGenes.forEach((gene) => {
    newChild[gene.type] = newChild[gene.type]
      ? generateTool.pickOneNumber(gene.value, newChild[gene.type]!)
      : gene.value
  })

  if (shouldMutation) {
    const potentialKeys = Object.keys(GENE_VALUES) as Array<keyof typeof GENE_VALUES>
    const keyIndex = generateTool.pickNumberInRange(0, potentialKeys.length - 1)
    const geneKey = potentialKeys[keyIndex]
    const potentialValues = GENE_VALUES[geneKey]
    const valueIndex = generateTool.pickNumberInRange(0, potentialValues.length - 1)
    const geneValue = potentialValues[valueIndex]
    newChild[geneKey] = geneValue
  }

  newChild.hashCode = getDNAHashCode(newChild)

  return newChild
}
