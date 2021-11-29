import * as tableEnums from '../enums/table'
import * as geneEnums from '../enums/gene'

const RNA_BLUEPRINT = {
  values: {
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
  },
  groups: [
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
}

interface Values {
  [key: string]: number[]
}

interface Gene {
  key: string;
  value: number;
}

type Genes = Gene[]

const connectGeneKeyAndValues = (
  key: string,
  values: Values
): Gene[] => {
  const includedValues = values[key]
  return includedValues.map((value) => ({
    key, value
  }))
}

const buildGroupValues = (
  group: string[],
  values: Values
) => {
  const valueGroups = group.map((key) => {
    return connectGeneKeyAndValues(key, values)
  })

  const combinations: Genes[] = []
  valueGroups.forEach((valueGroup) => {
    [...combinations].forEach((combo) => {
      valueGroup.forEach((val) => {
        combinations.push([...combo, val])
      })
    })
    valueGroup.forEach((val) => combinations.push([{ ...val }]))
  })
  console.log(combinations.length)
  return combinations
}

export const getGeneCombinations = () => {
  const groupValues = RNA_BLUEPRINT.groups.map((group) => {
    return buildGroupValues(group, RNA_BLUEPRINT.values)
  })
  return groupValues
}
