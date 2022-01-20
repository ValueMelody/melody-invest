import * as tableEnums from '../enums/table'
import * as geneEnums from '../enums/gene'
import * as tradeDNAModel from '../models/tradeDNA'
import * as tickerDailyModel from '../models/tickerDaily'

type BuyGene =
  typeof tableEnums.DNA_KEYS.PRICE_DAILY_INCREASE_BUY |
  typeof tableEnums.DNA_KEYS.PRICE_DAILY_DECREASE_BUY |
  typeof tableEnums.DNA_KEYS.PRICE_WEEKLY_INCREASE_BUY |
  typeof tableEnums.DNA_KEYS.PRICE_WEEKLY_DECREASE_BUY |
  typeof tableEnums.DNA_KEYS.PRICE_MONTHLY_INCREASE_BUY |
  typeof tableEnums.DNA_KEYS.PRICE_MONTHLY_DECREASE_BUY |
  typeof tableEnums.DNA_KEYS.PRICE_QUARTERLY_INCREASE_BUY |
  typeof tableEnums.DNA_KEYS.PRICE_QUARTERLY_DECREASE_BUY |
  typeof tableEnums.DNA_KEYS.PRICE_YEARLY_INCREASE_BUY |
  typeof tableEnums.DNA_KEYS.PRICE_YEARLY_DECREASE_BUY

type SellGene =
  typeof tableEnums.DNA_KEYS.PRICE_DAILY_INCREASE_SELL |
  typeof tableEnums.DNA_KEYS.PRICE_DAILY_DECREASE_SELL |
  typeof tableEnums.DNA_KEYS.PRICE_WEEKLY_INCREASE_SELL |
  typeof tableEnums.DNA_KEYS.PRICE_WEEKLY_DECREASE_SELL |
  typeof tableEnums.DNA_KEYS.PRICE_MONTHLY_INCREASE_SELL |
  typeof tableEnums.DNA_KEYS.PRICE_MONTHLY_DECREASE_SELL |
  typeof tableEnums.DNA_KEYS.PRICE_QUARTERLY_INCREASE_SELL |
  typeof tableEnums.DNA_KEYS.PRICE_QUARTERLY_DECREASE_SELL |
  typeof tableEnums.DNA_KEYS.PRICE_YEARLY_INCREASE_SELL |
  typeof tableEnums.DNA_KEYS.PRICE_YEARLY_DECREASE_SELL

type CashGene = typeof tableEnums.DNA_KEYS.CASH_MAX_PERCENT

type PositionMinGene = typeof tableEnums.DNA_KEYS.TICKER_MIN_PERCENT

type PositionMaxGene = typeof tableEnums.DNA_KEYS.TICKER_MAX_PERCENT

type BuyAmountGene = typeof tableEnums.DNA_KEYS.HOLDING_BUY_PERCENT

type SellAmountGene = typeof tableEnums.DNA_KEYS.HOLDING_SELL_PERCENT

type FrequencyGene = typeof tableEnums.DNA_KEYS.TRADE_FREQUENCY

type RebalanceGene = typeof tableEnums.DNA_KEYS.REBALANCE_FREQUENCY

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
  [tableEnums.DNA_KEYS.PRICE_DAILY_INCREASE_BUY]: [...geneEnums.VALUES.PRICE_DAILY_VALUES],
  [tableEnums.DNA_KEYS.PRICE_DAILY_INCREASE_SELL]: [...geneEnums.VALUES.PRICE_DAILY_VALUES],
  [tableEnums.DNA_KEYS.PRICE_DAILY_DECREASE_BUY]: [...geneEnums.VALUES.PRICE_DAILY_VALUES],
  [tableEnums.DNA_KEYS.PRICE_DAILY_DECREASE_SELL]: [...geneEnums.VALUES.PRICE_DAILY_VALUES],
  [tableEnums.DNA_KEYS.PRICE_WEEKLY_INCREASE_BUY]: [...geneEnums.VALUES.PRICE_WEEKLY_VALUES],
  [tableEnums.DNA_KEYS.PRICE_WEEKLY_INCREASE_SELL]: [...geneEnums.VALUES.PRICE_WEEKLY_VALUES],
  [tableEnums.DNA_KEYS.PRICE_WEEKLY_DECREASE_BUY]: [...geneEnums.VALUES.PRICE_WEEKLY_VALUES],
  [tableEnums.DNA_KEYS.PRICE_WEEKLY_DECREASE_SELL]: [...geneEnums.VALUES.PRICE_WEEKLY_VALUES],
  [tableEnums.DNA_KEYS.PRICE_MONTHLY_INCREASE_BUY]: [...geneEnums.VALUES.PRICE_MONTHLY_VALUES],
  [tableEnums.DNA_KEYS.PRICE_MONTHLY_INCREASE_SELL]: [...geneEnums.VALUES.PRICE_MONTHLY_VALUES],
  [tableEnums.DNA_KEYS.PRICE_MONTHLY_DECREASE_BUY]: [...geneEnums.VALUES.PRICE_MONTHLY_VALUES],
  [tableEnums.DNA_KEYS.PRICE_MONTHLY_DECREASE_SELL]: [...geneEnums.VALUES.PRICE_MONTHLY_VALUES],
  [tableEnums.DNA_KEYS.PRICE_QUARTERLY_INCREASE_BUY]: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  [tableEnums.DNA_KEYS.PRICE_QUARTERLY_INCREASE_SELL]: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  [tableEnums.DNA_KEYS.PRICE_QUARTERLY_DECREASE_BUY]: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  [tableEnums.DNA_KEYS.PRICE_QUARTERLY_DECREASE_SELL]: [...geneEnums.VALUES.PRICE_QUARTERLY_VALUES],
  [tableEnums.DNA_KEYS.PRICE_YEARLY_INCREASE_BUY]: [...geneEnums.VALUES.PRICE_YEARLY_VALUES],
  [tableEnums.DNA_KEYS.PRICE_YEARLY_INCREASE_SELL]: [...geneEnums.VALUES.PRICE_YEARLY_VALUES],
  [tableEnums.DNA_KEYS.PRICE_YEARLY_DECREASE_BUY]: [...geneEnums.VALUES.PRICE_YEARLY_VALUES],
  [tableEnums.DNA_KEYS.PRICE_YEARLY_DECREASE_SELL]: [...geneEnums.VALUES.PRICE_YEARLY_VALUES],
  [tableEnums.DNA_KEYS.CASH_MAX_PERCENT]: [...geneEnums.VALUES.CASH_MAX_PERCENT],
  [tableEnums.DNA_KEYS.TICKER_MIN_PERCENT]: [...geneEnums.VALUES.TICKER_PERCENT],
  [tableEnums.DNA_KEYS.TICKER_MAX_PERCENT]: [...geneEnums.VALUES.TICKER_PERCENT],
  [tableEnums.DNA_KEYS.HOLDING_BUY_PERCENT]: [...geneEnums.VALUES.HOLDING_PERCENT],
  [tableEnums.DNA_KEYS.HOLDING_SELL_PERCENT]: [...geneEnums.VALUES.HOLDING_PERCENT],
  [tableEnums.DNA_KEYS.TRADE_FREQUENCY]: [...geneEnums.VALUES.TRADE_FREQUENCY],
  [tableEnums.DNA_KEYS.REBALANCE_FREQUENCY]: [...geneEnums.VALUES.REBALANCE_FREQUENCY]
}

const GENE_GROUPS = [
  [
    tableEnums.DNA_KEYS.PRICE_DAILY_INCREASE_BUY,
    tableEnums.DNA_KEYS.PRICE_DAILY_DECREASE_BUY,
    tableEnums.DNA_KEYS.PRICE_WEEKLY_INCREASE_BUY,
    tableEnums.DNA_KEYS.PRICE_WEEKLY_DECREASE_BUY,
    tableEnums.DNA_KEYS.PRICE_MONTHLY_INCREASE_BUY,
    tableEnums.DNA_KEYS.PRICE_MONTHLY_DECREASE_BUY,
    tableEnums.DNA_KEYS.PRICE_QUARTERLY_INCREASE_BUY,
    tableEnums.DNA_KEYS.PRICE_QUARTERLY_DECREASE_BUY,
    tableEnums.DNA_KEYS.PRICE_YEARLY_INCREASE_BUY,
    tableEnums.DNA_KEYS.PRICE_YEARLY_DECREASE_BUY
  ],
  [
    tableEnums.DNA_KEYS.PRICE_DAILY_INCREASE_SELL,
    tableEnums.DNA_KEYS.PRICE_DAILY_DECREASE_SELL,
    tableEnums.DNA_KEYS.PRICE_WEEKLY_INCREASE_SELL,
    tableEnums.DNA_KEYS.PRICE_WEEKLY_DECREASE_SELL,
    tableEnums.DNA_KEYS.PRICE_MONTHLY_INCREASE_SELL,
    tableEnums.DNA_KEYS.PRICE_MONTHLY_DECREASE_SELL,
    tableEnums.DNA_KEYS.PRICE_QUARTERLY_INCREASE_SELL,
    tableEnums.DNA_KEYS.PRICE_QUARTERLY_DECREASE_SELL,
    tableEnums.DNA_KEYS.PRICE_YEARLY_INCREASE_SELL,
    tableEnums.DNA_KEYS.PRICE_YEARLY_DECREASE_SELL
  ],
  [tableEnums.DNA_KEYS.CASH_MAX_PERCENT],
  [tableEnums.DNA_KEYS.TICKER_MIN_PERCENT],
  [tableEnums.DNA_KEYS.TICKER_MAX_PERCENT],
  [tableEnums.DNA_KEYS.HOLDING_BUY_PERCENT],
  [tableEnums.DNA_KEYS.HOLDING_SELL_PERCENT],
  [tableEnums.DNA_KEYS.TRADE_FREQUENCY],
  [tableEnums.DNA_KEYS.REBALANCE_FREQUENCY]
]

interface Gene {
  type: GeneType;
  value: number;
}

export const getGeneGroups = () => (
  GENE_GROUPS.map((group: GeneType[]): Gene[] => (
    group.reduce((allValues: Gene[], type) => {
      const geneValues: number[] = GENE_VALUES[type]
      const genes = geneValues.map((value: number) => ({
        type, value
      }))
      return [...allValues, ...genes]
    }, [])
  ))
)

export const isTickerMetBuyGene = (
  tickerDaily: tickerDailyModel.TickerDaily,
  dna: tradeDNAModel.TradeDNA
): boolean => {
  const priceMovementKeyMappings = {
    [tableEnums.DNA_KEYS.PRICE_DAILY_INCREASE_BUY]: tableEnums.TICKER_KEYS.PRICE_DAILY_INCREASE,
    [tableEnums.DNA_KEYS.PRICE_DAILY_DECREASE_BUY]: tableEnums.TICKER_KEYS.PRICE_DAILY_DECREASE,
    [tableEnums.DNA_KEYS.PRICE_WEEKLY_INCREASE_BUY]: tableEnums.TICKER_KEYS.PRICE_WEEKLY_INCREASE,
    [tableEnums.DNA_KEYS.PRICE_WEEKLY_DECREASE_BUY]: tableEnums.TICKER_KEYS.PRICE_WEEKLY_DECREASE,
    [tableEnums.DNA_KEYS.PRICE_MONTHLY_INCREASE_BUY]: tableEnums.TICKER_KEYS.PRICE_MONTHLY_INCREASE,
    [tableEnums.DNA_KEYS.PRICE_MONTHLY_DECREASE_BUY]: tableEnums.TICKER_KEYS.PRICE_MONTHLY_DECREASE,
    [tableEnums.DNA_KEYS.PRICE_QUARTERLY_INCREASE_BUY]: tableEnums.TICKER_KEYS.PRICE_QUARTERLY_INCREASE,
    [tableEnums.DNA_KEYS.PRICE_QUARTERLY_DECREASE_BUY]: tableEnums.TICKER_KEYS.PRICE_QUARTERLY_DECREASE,
    [tableEnums.DNA_KEYS.PRICE_YEARLY_INCREASE_BUY]: tableEnums.TICKER_KEYS.PRICE_YEARLY_INCREASE,
    [tableEnums.DNA_KEYS.PRICE_YEARLY_DECREASE_BUY]: tableEnums.TICKER_KEYS.PRICE_YEARLY_DECREASE
  }

  // @ts-ignore
  const metPriceMovementBuyGene = Object.keys(priceMovementKeyMappings).some((
    dnaKey: keyof typeof priceMovementKeyMappings
  ) => {
    const tickerKey = priceMovementKeyMappings[dnaKey]
    const tickerValue = tickerDaily[tickerKey]
    const dnaValue = dna[dnaKey]
    return dnaValue !== null && tickerValue >= dnaValue
  })

  return metPriceMovementBuyGene
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
