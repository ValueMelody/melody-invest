import * as tableEnums from '../enums/table'
import * as geneEnums from '../enums/gene'

type BuyGene =
  typeof tableEnums.RNA_KEYS.PRICE_DAILY_INCREASE_BUY |
  typeof tableEnums.RNA_KEYS.PRICE_DAILY_DECREASE_BUY |
  typeof tableEnums.RNA_KEYS.PRICE_WEEKLY_INCREASE_BUY |
  typeof tableEnums.RNA_KEYS.PRICE_WEEKLY_DECREASE_BUY |
  typeof tableEnums.RNA_KEYS.PRICE_MONTHLY_INCREASE_BUY |
  typeof tableEnums.RNA_KEYS.PRICE_MONTHLY_DECREASE_BUY |
  typeof tableEnums.RNA_KEYS.PRICE_QUARTERLY_INCREASE_BUY |
  typeof tableEnums.RNA_KEYS.PRICE_QUARTERLY_DECREASE_BUY |
  typeof tableEnums.RNA_KEYS.PRICE_YEARLY_INCREASE_BUY |
  typeof tableEnums.RNA_KEYS.PRICE_YEARLY_DECREASE_BUY

type SellGene =
  typeof tableEnums.RNA_KEYS.PRICE_DAILY_INCREASE_SELL |
  typeof tableEnums.RNA_KEYS.PRICE_DAILY_DECREASE_SELL |
  typeof tableEnums.RNA_KEYS.PRICE_WEEKLY_INCREASE_SELL |
  typeof tableEnums.RNA_KEYS.PRICE_WEEKLY_DECREASE_SELL |
  typeof tableEnums.RNA_KEYS.PRICE_MONTHLY_INCREASE_SELL |
  typeof tableEnums.RNA_KEYS.PRICE_MONTHLY_DECREASE_SELL |
  typeof tableEnums.RNA_KEYS.PRICE_QUARTERLY_INCREASE_SELL |
  typeof tableEnums.RNA_KEYS.PRICE_QUARTERLY_DECREASE_SELL |
  typeof tableEnums.RNA_KEYS.PRICE_YEARLY_INCREASE_SELL |
  typeof tableEnums.RNA_KEYS.PRICE_YEARLY_DECREASE_SELL

type CashGene = typeof tableEnums.RNA_KEYS.CASH_MAX_PERCENT

type PositionMinGene = typeof tableEnums.RNA_KEYS.TICKET_MIN_PERCENT

type PositionMaxGene = typeof tableEnums.RNA_KEYS.TICKET_MAX_PERCENT

type BuyAmountGene = typeof tableEnums.RNA_KEYS.HOLDING_BUY_PERCENT

type SellAmountGene = typeof tableEnums.RNA_KEYS.HOLDING_SELL_PERCENT

type FrequencyGene = typeof tableEnums.RNA_KEYS.TRADE_FREQUENCY

type RebalanceGene = typeof tableEnums.RNA_KEYS.REBALANCE_FREQUENCY

type GeneType = BuyGene |
  SellGene |
  CashGene |
  PositionMaxGene |
  PositionMinGene |
  BuyAmountGene |
  SellAmountGene |
  FrequencyGene |
  RebalanceGene

const GENE_VALUES = {
  [tableEnums.RNA_KEYS.PRICE_DAILY_INCREASE_BUY]: [...geneEnums.VALUES.PRICE_DAILY_VALUES],
  [tableEnums.RNA_KEYS.PRICE_DAILY_INCREASE_SELL]: [...geneEnums.VALUES.PRICE_DAILY_VALUES],
  [tableEnums.RNA_KEYS.PRICE_DAILY_DECREASE_BUY]: [...geneEnums.VALUES.PRICE_DAILY_VALUES],
  [tableEnums.RNA_KEYS.PRICE_DAILY_DECREASE_SELL]: [...geneEnums.VALUES.PRICE_DAILY_VALUES],
  [tableEnums.RNA_KEYS.PRICE_WEEKLY_INCREASE_BUY]: [...geneEnums.VALUES.PRICE_WEEKLY_VALUES],
  [tableEnums.RNA_KEYS.PRICE_WEEKLY_INCREASE_SELL]: [...geneEnums.VALUES.PRICE_WEEKLY_VALUES],
  [tableEnums.RNA_KEYS.PRICE_WEEKLY_DECREASE_BUY]: [...geneEnums.VALUES.PRICE_WEEKLY_VALUES],
  [tableEnums.RNA_KEYS.PRICE_WEEKLY_DECREASE_SELL]: [...geneEnums.VALUES.PRICE_WEEKLY_VALUES],
  [tableEnums.RNA_KEYS.PRICE_MONTHLY_INCREASE_BUY]: [...geneEnums.VALUES.PRICE_MONTHLY_VALUES],
  [tableEnums.RNA_KEYS.PRICE_MONTHLY_INCREASE_SELL]: [...geneEnums.VALUES.PRICE_MONTHLY_VALUES],
  [tableEnums.RNA_KEYS.PRICE_MONTHLY_DECREASE_BUY]: [...geneEnums.VALUES.PRICE_MONTHLY_VALUES],
  [tableEnums.RNA_KEYS.PRICE_MONTHLY_DECREASE_SELL]: [...geneEnums.VALUES.PRICE_MONTHLY_VALUES],
  [tableEnums.RNA_KEYS.PRICE_QUARTERLY_INCREASE_BUY]: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  [tableEnums.RNA_KEYS.PRICE_QUARTERLY_INCREASE_SELL]: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  [tableEnums.RNA_KEYS.PRICE_QUARTERLY_DECREASE_BUY]: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  [tableEnums.RNA_KEYS.PRICE_QUARTERLY_DECREASE_SELL]: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  [tableEnums.RNA_KEYS.PRICE_YEARLY_INCREASE_BUY]: [...geneEnums.VALUES.PRICE_YEARLY_VALUES],
  [tableEnums.RNA_KEYS.PRICE_YEARLY_INCREASE_SELL]: [...geneEnums.VALUES.PRICE_YEARLY_VALUES],
  [tableEnums.RNA_KEYS.PRICE_YEARLY_DECREASE_BUY]: [...geneEnums.VALUES.PRICE_YEARLY_VALUES],
  [tableEnums.RNA_KEYS.PRICE_YEARLY_DECREASE_SELL]: [...geneEnums.VALUES.PRICE_YEARLY_VALUES],
  [tableEnums.RNA_KEYS.CASH_MAX_PERCENT]: [...geneEnums.VALUES.CASH_MAX_PERCENT],
  [tableEnums.RNA_KEYS.TICKET_MIN_PERCENT]: [...geneEnums.VALUES.TICKET_PERCENT],
  [tableEnums.RNA_KEYS.TICKET_MAX_PERCENT]: [...geneEnums.VALUES.TICKET_PERCENT],
  [tableEnums.RNA_KEYS.HOLDING_BUY_PERCENT]: [...geneEnums.VALUES.HOLDING_PERCENT],
  [tableEnums.RNA_KEYS.HOLDING_SELL_PERCENT]: [...geneEnums.VALUES.HOLDING_PERCENT],
  [tableEnums.RNA_KEYS.TRADE_FREQUENCY]: [...geneEnums.VALUES.TRADE_FREQUENCY],
  [tableEnums.RNA_KEYS.REBALANCE_FREQUENCY]: [...geneEnums.VALUES.REBALANCE_FREQUENCY]
}

const GENE_GROUPS = [
  [
    tableEnums.RNA_KEYS.PRICE_DAILY_INCREASE_BUY,
    tableEnums.RNA_KEYS.PRICE_DAILY_DECREASE_BUY,
    tableEnums.RNA_KEYS.PRICE_WEEKLY_INCREASE_BUY,
    tableEnums.RNA_KEYS.PRICE_WEEKLY_DECREASE_BUY,
    tableEnums.RNA_KEYS.PRICE_MONTHLY_INCREASE_BUY,
    tableEnums.RNA_KEYS.PRICE_MONTHLY_DECREASE_BUY,
    tableEnums.RNA_KEYS.PRICE_QUARTERLY_INCREASE_BUY,
    tableEnums.RNA_KEYS.PRICE_QUARTERLY_DECREASE_BUY,
    tableEnums.RNA_KEYS.PRICE_YEARLY_INCREASE_BUY,
    tableEnums.RNA_KEYS.PRICE_YEARLY_DECREASE_BUY
  ],
  [
    tableEnums.RNA_KEYS.PRICE_DAILY_INCREASE_SELL,
    tableEnums.RNA_KEYS.PRICE_DAILY_DECREASE_SELL,
    tableEnums.RNA_KEYS.PRICE_WEEKLY_INCREASE_SELL,
    tableEnums.RNA_KEYS.PRICE_WEEKLY_DECREASE_SELL,
    tableEnums.RNA_KEYS.PRICE_MONTHLY_INCREASE_SELL,
    tableEnums.RNA_KEYS.PRICE_MONTHLY_DECREASE_SELL,
    tableEnums.RNA_KEYS.PRICE_QUARTERLY_INCREASE_SELL,
    tableEnums.RNA_KEYS.PRICE_QUARTERLY_DECREASE_SELL,
    tableEnums.RNA_KEYS.PRICE_YEARLY_INCREASE_SELL,
    tableEnums.RNA_KEYS.PRICE_YEARLY_DECREASE_SELL
  ],
  [tableEnums.RNA_KEYS.CASH_MAX_PERCENT],
  [tableEnums.RNA_KEYS.TICKET_MIN_PERCENT],
  [tableEnums.RNA_KEYS.TICKET_MAX_PERCENT],
  [tableEnums.RNA_KEYS.HOLDING_BUY_PERCENT],
  [tableEnums.RNA_KEYS.HOLDING_SELL_PERCENT],
  [tableEnums.RNA_KEYS.TRADE_FREQUENCY],
  [tableEnums.RNA_KEYS.REBALANCE_FREQUENCY]
]

interface Gene {
  type: GeneType;
  value: number;
}

const getGenesByGroup = (
  group: GeneType[]
): Gene[] => {
  return group.reduce((allValues: Gene[], type) => {
    const geneValues: number[] = GENE_VALUES[type]
    const genes = geneValues.map((value: number) => ({
      type, value
    }))
    return [...allValues, ...genes]
  }, [])
}

export const getBaseRNAs = () => {
  const genesInGroups = GENE_GROUPS.map((group) => {
    return getGenesByGroup(group)
  })
  const rnas = genesInGroups.reduce((allRNAs: Gene[][], genesInGroup) => {
    console.log(allRNAs.length)
    if (allRNAs.length === 0) {
      return genesInGroup.map((gene) => [gene])
    }
    return genesInGroup.reduce((newRNAS: Gene[][], gene) => {
      const combos = allRNAs.map((combo) => [...combo, gene])
      return [
        ...newRNAS,
        ...combos
      ]
    }, [])
  }, [])
  return rnas
}
