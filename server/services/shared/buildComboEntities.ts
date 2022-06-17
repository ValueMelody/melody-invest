import * as interfaces from '@shared/interfaces'
import * as traderPatternModel from 'models/traderPattern'
import * as traderHoldingModel from 'models/traderHolding'
import * as traderLogic from 'logics/trader'
import * as holdingLogic from 'logics/holding'

const buildComboEntities = async (
  traders: interfaces.traderModel.Record[],
): Promise<{
  traderProfiles: interfaces.response.TraderProfile[];
  holdings: interfaces.traderHoldingModel.Detail[];
}> => {
  const relatedPatterns = await traderPatternModel.getPublicByTraders(traders)
  const profiles = traders.map((trader) => traderLogic.presentTraderProfile(trader, relatedPatterns))

  const traderIds = traders.map((trader) => trader.id)
  const holdings = await traderHoldingModel.getAllByTraderIds(traderIds)
  const holdingsByTraders = holdingLogic.groupHoldingsByTraders(holdings)
  const holdingDates = holdings.map((holding) => holding.date)
  const uniqueDates = Array.from(new Set(holdingDates))
  const holdingsByDates = holdingLogic.groupTraderHoldingsByDate(
    uniqueDates, traderIds, holdingsByTraders,
  )

  const aggregatedHoldings = Object.keys(holdingsByDates)
    .map((date) => holdingLogic.mergeTraderHoldingsByDate(
      date, holdingsByDates[date],
    ))
  const sortedHoldings = aggregatedHoldings.sort((prev, curr) => curr.date < prev.date ? -1 : 1)

  return {
    traderProfiles: profiles,
    holdings: sortedHoldings,
  }
}

export default buildComboEntities
