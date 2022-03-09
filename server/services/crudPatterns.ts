import * as interfaces from '@interfaces'
import * as traderModel from '../models/trader'
import * as traderPatternModel from '../models/traderPattern'

const combineTraderAndPattern = (
  trader: interfaces.traderModel.Record,
  patterns: interfaces.traderPatternModel.Record[],
) => {
  const matchedPattern = patterns.find((pattern) => pattern.id === trader.traderPatternId)!
  return { trader, pattern: matchedPattern }
}

export const getTopPatterns = async (): Promise<interfaces.patternsResponse.Top> => {
  const tops = await traderModel.getTops(15)
  const topTraders = [...tops.yearly, ...tops.pastYear, ...tops.pastQuarter, ...tops.pastMonth, ...tops.pastWeek]
  const relatedPatternIds = topTraders.map((trader) => trader.traderPatternId)
  const relatedPatterns = await traderPatternModel.getInPKs(relatedPatternIds)
  return {
    yearly: tops.yearly.map((trader) => combineTraderAndPattern(trader, relatedPatterns)),
    pastYear: tops.pastYear.map((trader) => combineTraderAndPattern(trader, relatedPatterns)),
    pastQuarter: tops.pastQuarter.map((trader) => combineTraderAndPattern(trader, relatedPatterns)),
    pastMonth: tops.pastMonth.map((trader) => combineTraderAndPattern(trader, relatedPatterns)),
    pastWeek: tops.pastWeek.map((trader) => combineTraderAndPattern(trader, relatedPatterns)),
  }
}
