import * as holdingLogic from 'logics/holding'
import * as interfaces from '@shared/interfaces'
import * as traderHoldingModel from 'models/traderHolding'
import * as traderLogic from 'logics/trader'
import * as traderPatternModel from 'models/traderPattern'

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

  // istanbul ignore next
  const availableDates = Object
    .keys(holdingsByDates)
    .sort((prev, curr) => curr < prev ? -1 : 1)

  const aggregatedHoldings = availableDates
    .map((date) => holdingLogic.mergeTraderHoldingsByDate(
      date, holdingsByDates[date],
    ))

  return {
    traderProfiles: profiles,
    holdings: aggregatedHoldings,
  }
}

export default buildComboEntities
