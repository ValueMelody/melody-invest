import * as interfaces from '@shared/interfaces'

export const presentTraderProfile = (
  trader: interfaces.traderModel.Record,
  patterns: interfaces.traderPatternModel.Record[],
): interfaces.response.TraderProfile => {
  const matchedPattern = patterns.find((pattern) => pattern.id === trader.traderPatternId)!
  return { trader, pattern: matchedPattern }
}

export const groupTraderCouples = (
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
