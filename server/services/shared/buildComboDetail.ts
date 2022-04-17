import * as interfaces from '@shared/interfaces'
import * as traderPatternModel from '../../models/traderPattern'
import * as traderHoldingModel from '../../models/traderHolding'
import * as traderLogic from '../../logics/trader'
import * as holdingLogic from '../../logics/holding'

const buildComboDetail = async (
  traders: interfaces.traderModel.Record[],
): Promise<{
  traderIds: number[];
  profiles: interfaces.traderRes.TraderProfile[];
  holdings: interfaces.traderHoldingModel.Detail[];
}> => {
  const relatedPatterns = await traderPatternModel.getPublicByTraders(traders)
  const profiles = traders.map((trader) => traderLogic.presentTraderProfile(trader, relatedPatterns))

  const traderIds = traders.map((trader) => trader.id)
  const holdings = await traderHoldingModel.getAllByTraderIds(traderIds)
  const holdingsByTraders = traderLogic.groupHoldingRecordsByTraders(holdings)
  const holdingsByDates = traderLogic.gatherTraderHoldingRecordsByDate(
    traderIds, holdings, holdingsByTraders,
  )

  const aggregatedHoldings = Object.keys(holdingsByDates)
    .map((date) => traderLogic.mergeHoldingsByDate(
      date,
      holdingsByDates[date],
      holdingLogic.getInitialCash(),
    ))
  const sortedHoldings = aggregatedHoldings.sort((prev, curr) => curr.date < prev.date ? -1 : 1)
  return {
    traderIds,
    profiles,
    holdings: sortedHoldings,
  }
}

export default buildComboDetail
