import * as interfaces from '@shared/interfaces'

export const presentTraderProfile = (
  trader: interfaces.traderModel.Record,
  patterns: interfaces.traderPatternModel.Public[],
): interfaces.response.TraderProfile => {
  const matchedPattern = patterns.find((pattern) => pattern.id === trader.traderPatternId)!
  return { trader, pattern: matchedPattern }
}
