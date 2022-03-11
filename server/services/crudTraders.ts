import * as interfaces from '@shared/interfaces'
import * as traderModel from '../models/trader'
import * as traderPatternModel from '../models/traderPattern'
import * as errorEnum from '../enums/error'

export const getTrader = async (
  id: number, accessCode: string
): Promise<interfaces.tradersResponse.TraderSummary> => {
  const trader = await traderModel.getByPK(id)
  if (!trader || trader.accessCode !== accessCode) throw errorEnum.HTTP_ERRORS.FORBIDDEN

  const pattern = await traderPatternModel.getByPK(trader.traderPatternId)
  if (!pattern) throw errorEnum.HTTP_ERRORS.FORBIDDEN

  const { hashCode, ...patternPublic } = pattern

  return {
    trader,
    pattern: patternPublic,
  }
}

const combineTraderAndPattern = (
  trader: interfaces.traderModel.Record,
  patterns: interfaces.traderPatternModel.Public[],
) => {
  const matchedPattern = patterns.find((pattern) => pattern.id === trader.traderPatternId)!
  return { trader, pattern: matchedPattern }
}

export const getTopPatterns = async (): Promise<interfaces.tradersResponse.Top> => {
  const tops = await traderModel.getTops(15)
  const topTraders = [...tops.yearly, ...tops.pastYear, ...tops.pastQuarter, ...tops.pastMonth, ...tops.pastWeek]
  const relatedPatternIds = topTraders.map((trader) => trader.traderPatternId)
  const patterns = await traderPatternModel.getInPKs(relatedPatternIds)
  const relatedPatterns = patterns.map(({ hashCode, ...publicPattern }) => publicPattern)

  return {
    yearly: tops.yearly.map((trader) => combineTraderAndPattern(trader, relatedPatterns)),
    pastYear: tops.pastYear.map((trader) => combineTraderAndPattern(trader, relatedPatterns)),
    pastQuarter: tops.pastQuarter.map((trader) => combineTraderAndPattern(trader, relatedPatterns)),
    pastMonth: tops.pastMonth.map((trader) => combineTraderAndPattern(trader, relatedPatterns)),
    pastWeek: tops.pastWeek.map((trader) => combineTraderAndPattern(trader, relatedPatterns)),
  }
}
